<?php

namespace App\Http\Controllers;

use App\Models\Collaboration;
use App\Models\EconomicResource;
use App\Services\FCMService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollaborationController extends Controller
{
    private function response($success, $message, $data = null, $code = 200)
    {
        return response()->json(['success' => $success, 'message' => $message, 'data' => $data], $code);
    }

    private function formatCollab(Collaboration $c): array
    {
        return [
            'id'           => $c->id,
            'type'         => $c->type,
            'message'      => $c->message,
            'status'       => $c->status,
            'responded_at' => $c->responded_at?->toISOString(),
            'created_at'   => $c->created_at?->toISOString(),
            'resource'     => $c->resource ? [
                'id'            => $c->resource->id,
                'resource_name' => $c->resource->resource_name,
                'category'      => $c->resource->category?->name,
            ] : null,
            'initiator'    => $c->initiator ? [
                'id'           => $c->initiator->id,
                'nama'         => $c->initiator->nama,
                'foto'         => $c->initiator->foto,
                'organization' => $c->initiator->organization,
            ] : null,
            'target'       => $c->target ? [
                'id'           => $c->target->id,
                'nama'         => $c->target->nama,
                'foto'         => $c->target->foto,
                'organization' => $c->target->organization,
            ] : null,
        ];
    }

    // ================================================================
    // POST /api/collaborations — Kirim Permintaan Kolaborasi
    // ================================================================
    public function store(Request $request)
    {
        $request->validate([
            'resource_id' => 'required|uuid|exists:economic_resources,id',
            'type'        => 'required|in:investasi,distribusi,supply,kemitraan,ekspansi',
            'message'     => 'required|string|min:20|max:1000',
        ]);

        $resource = EconomicResource::with('contributor')->find($request->resource_id);

        if ($resource->status !== 'active') {
            return $this->response(false, 'Potensi tidak aktif', null, 422);
        }

        if ($resource->user_id === Auth::id()) {
            return $this->response(false, 'Tidak dapat mengirim kolaborasi ke diri sendiri', null, 422);
        }

        // Cek duplikasi kolaborasi pending
        $existing = Collaboration::where('resource_id', $request->resource_id)
            ->where('initiator_id', Auth::id())
            ->where('type', $request->type)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            return $this->response(false, 'Anda sudah memiliki permintaan kolaborasi yang sedang pending', null, 422);
        }

        $collaboration = Collaboration::create([
            'resource_id'  => $request->resource_id,
            'initiator_id' => Auth::id(),
            'target_id'    => $resource->user_id,
            'type'         => $request->type,
            'message'      => $request->message,
            'status'       => 'pending',
        ]);

        // FCM ke pemilik resource
        try {
            $fcm    = new FCMService();
            $target = $resource->contributor;
            if ($target?->fcm_token) {
                $typeLabel = [
                    'investasi'  => 'Investasi',
                    'distribusi' => 'Distribusi',
                    'supply'     => 'Supply',
                    'kemitraan'  => 'Kemitraan',
                    'ekspansi'   => 'Ekspansi',
                ][$request->type] ?? $request->type;

                $fcm->sendToToken(
                    token: $target->fcm_token,
                    title: '🤝 Permintaan Kolaborasi Baru',
                    body:  Auth::user()->nama . " mengajukan kolaborasi {$typeLabel} untuk \"{$resource->resource_name}\"",
                    data:  ['type' => 'collaboration_request', 'collaboration_id' => (string) $collaboration->id]
                );
            }
        } catch (\Exception $e) {
            \Log::warning('FCM failed: ' . $e->getMessage());
        }

        $collaboration->load(['resource.category', 'initiator', 'target']);
        return $this->response(true, 'Permintaan kolaborasi berhasil dikirim', $this->formatCollab($collaboration), 201);
    }

    // ================================================================
    // GET /api/collaborations — Daftar Kolaborasi User
    // ================================================================
    public function index(Request $request)
    {
        $userId = Auth::id();

        $query = Collaboration::with(['resource.category', 'initiator', 'target'])
            ->where(function ($q) use ($userId) {
                $q->where('initiator_id', $userId)
                  ->orWhere('target_id', $userId);
            })
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $collaborations = $query->paginate(10);

        return $this->response(true, 'Daftar kolaborasi berhasil dimuat', [
            'collaborations' => $collaborations->map(fn($c) => $this->formatCollab($c))->values(),
            'pagination'     => [
                'total'         => $collaborations->total(),
                'per_halaman'   => $collaborations->perPage(),
                'halaman_ini'   => $collaborations->currentPage(),
                'total_halaman' => $collaborations->lastPage(),
            ],
        ]);
    }

    // ================================================================
    // GET /api/collaborations/{id} — Detail Kolaborasi
    // ================================================================
    public function show(string $id)
    {
        $collaboration = Collaboration::with(['resource.category', 'initiator', 'target'])->find($id);

        if (!$collaboration) {
            return $this->response(false, 'Kolaborasi tidak ditemukan', null, 404);
        }

        $userId = Auth::id();
        if ($collaboration->initiator_id !== $userId && $collaboration->target_id !== $userId) {
            return $this->response(false, 'Akses ditolak', null, 403);
        }

        return $this->response(true, 'Detail kolaborasi berhasil dimuat', $this->formatCollab($collaboration));
    }

    // ================================================================
    // PUT /api/collaborations/{id}/respond — Respons Kolaborasi
    // ================================================================
    public function respond(Request $request, string $id)
    {
        $collaboration = Collaboration::find($id);

        if (!$collaboration) {
            return $this->response(false, 'Kolaborasi tidak ditemukan', null, 404);
        }

        if ($collaboration->target_id !== Auth::id()) {
            return $this->response(false, 'Hanya penerima yang dapat merespons', null, 403);
        }

        if ($collaboration->status !== 'pending') {
            return $this->response(false, 'Kolaborasi sudah direspons sebelumnya', null, 422);
        }

        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $collaboration->update([
            'status'       => $request->status,
            'responded_at' => now(),
        ]);

        // FCM ke initiator
        try {
            $fcm       = new FCMService();
            $initiator = $collaboration->initiator;
            if ($initiator?->fcm_token) {
                $title = $request->status === 'accepted'
                    ? '🎉 Kolaborasi Diterima!'
                    : '❌ Kolaborasi Ditolak';
                $body = $request->status === 'accepted'
                    ? Auth::user()->nama . ' menerima permintaan kolaborasi Anda.'
                    : Auth::user()->nama . ' menolak permintaan kolaborasi Anda.';

                $fcm->sendToToken(
                    token: $initiator->fcm_token,
                    title: $title,
                    body:  $body,
                    data:  ['type' => 'collaboration_response', 'collaboration_id' => (string) $collaboration->id]
                );
            }
        } catch (\Exception $e) {
            \Log::warning('FCM failed: ' . $e->getMessage());
        }

        $collaboration->load(['resource.category', 'initiator', 'target']);
        return $this->response(true, 'Respons kolaborasi berhasil disimpan', $this->formatCollab($collaboration));
    }
}
