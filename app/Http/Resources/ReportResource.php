<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'judul'         => $this->judul,
            'deskripsi'     => $this->deskripsi,
            'status'        => $this->status,
            'priority'      => $this->priority,
            'lokasi' => [
                'latitude'  => $this->latitude,
                'longitude' => $this->longitude,
                'address'   => $this->address,
            ],
            'category' => [
                'id'        => $this->category->id,
                'nama'      => $this->category->name,
            ],
            'pelapor' => [
                'id'        => $this->user->id,
                'nama'      => $this->user->nama,
            ],
            'foto' => $this->images->map(function ($image) {
                return [
                    'id'    => $image->id,
                    'url' => $image->image_url,
                ];
            }),
            'dibuat_pada'   => $this->created_at
                       ->setTimezone('Asia/Jakarta')
                       ->translatedFormat('d M Y H:i'),
            'diupdate_pada' => $this->updated_at
                       ->setTimezone('Asia/Jakarta')
                       ->translatedFormat('d M Y H:i'),
        ];
    }
}
