$BASE = "http://127.0.0.1:8000/api"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "test_e2e_$timestamp@swara.test"
$password = "TestPass123!"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " SWARA E2E TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

function SafeRequest {
    param($Uri, $Method, $Body, $Headers, $ContentType)
    try {
        $params = @{ Uri = $Uri; Method = $Method; ErrorAction = "Stop" }
        if ($Body) { $params.Body = $Body }
        if ($Headers) { $params.Headers = $Headers }
        if ($ContentType) { $params.ContentType = $ContentType } else { $params.ContentType = "application/json" }
        $result = Invoke-RestMethod @params
        return @{ Success = $true; Data = $result }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errBody = ""
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd()
        } catch {}
        return @{ Success = $false; StatusCode = $statusCode; Error = $errBody; Exception = $_.Exception.Message }
    }
}

# ── STEP 1: REGISTER ──
Write-Host "1. REGISTER" -ForegroundColor Yellow
$regBody = @{
    nama = "Test E2E User"
    email = $email
    password = $password
    password_confirmation = $password
    nik = "3578" + (Get-Random -Minimum 1000000000 -Maximum 9999999999)
    alamat = "Jl. Test E2E No. 1, Lamongan"
    no_telepon = "0812" + (Get-Random -Minimum 10000000 -Maximum 99999999)
} | ConvertTo-Json

$reg = SafeRequest -Uri "$BASE/auth/register" -Method POST -Body $regBody
if ($reg.Success) {
    Write-Host "   [OK] Register berhasil: $($reg.Data.data.user.nama)" -ForegroundColor Green
    Write-Host "   Email: $email" -ForegroundColor Gray
} else {
    Write-Host "   [FAIL] Register gagal (HTTP $($reg.StatusCode))" -ForegroundColor Red
    Write-Host "   $($reg.Error)" -ForegroundColor Red
}

# ── STEP 2: LOGIN ──
Write-Host "`n2. LOGIN" -ForegroundColor Yellow
$loginBody = @{ email = $email; password = $password } | ConvertTo-Json

$login = SafeRequest -Uri "$BASE/auth/login" -Method POST -Body $loginBody
if ($login.Success) {
    $token = $login.Data.data.token
    Write-Host "   [OK] Login berhasil, token: $($token.Substring(0, 20))..." -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Login gagal (HTTP $($login.StatusCode))" -ForegroundColor Red
    Write-Host "   $($login.Error)" -ForegroundColor Red
    exit 1
}

$headers = @{ Authorization = "Bearer $token"; Accept = "application/json" }

# ── STEP 3: GET PROFILE ──
Write-Host "`n3. GET PROFILE" -ForegroundColor Yellow
$prof = SafeRequest -Uri "$BASE/auth/profile" -Method GET -Headers $headers
if ($prof.Success) {
    Write-Host "   [OK] Nama: $($prof.Data.data.nama) | Role: $($prof.Data.data.role)" -ForegroundColor Green
} else { Write-Host "   [FAIL] HTTP $($prof.StatusCode)" -ForegroundColor Red }

# ── STEP 4: TAMBAH POTENSI ──
Write-Host "`n4. TAMBAH POTENSI EKONOMI" -ForegroundColor Yellow
$resBody = @{
    resource_name = "Keripik Tempe Bu Darmi - E2E Test"
    description = "Usaha keripik tempe rumahan dengan bahan baku lokal berkualitas tinggi dari Lamongan. Produksi harian 50kg."
    category_id = 1
    latitude = -7.1195
    longitude = 112.4316
    address = "Jl. Lamongan Raya No. 123"
    province = "Jawa Timur"
    city = "Lamongan"
    business_scale = "mikro"
    monthly_capacity = "1500 kg"
    investment_needed = 25000000
    collaboration_needed = "Membutuhkan distributor untuk area Surabaya"
    opportunity_status = "mencari_distributor"
    contact_information = "081234567890"
} | ConvertTo-Json

$create = SafeRequest -Uri "$BASE/resources" -Method POST -Body $resBody -Headers $headers
if ($create.Success) {
    $resourceId = $create.Data.data.id
    Write-Host "   [OK] Potensi berhasil dibuat!" -ForegroundColor Green
    Write-Host "   ID: $resourceId" -ForegroundColor Gray
    Write-Host "   Nama: $($create.Data.data.resource_name)" -ForegroundColor Gray
    Write-Host "   Status: $($create.Data.data.status)" -ForegroundColor Gray
    Write-Host "   Verifikasi: Lv.$($create.Data.data.verification_level) - $($create.Data.data.verification_label)" -ForegroundColor Gray
    Write-Host "   Kategori: $($create.Data.data.category.name)" -ForegroundColor Gray
    Write-Host "   Lokasi: $($create.Data.data.lokasi.city), $($create.Data.data.lokasi.province)" -ForegroundColor Gray
} else {
    Write-Host "   [FAIL] HTTP $($create.StatusCode)" -ForegroundColor Red
    Write-Host "   $($create.Error)" -ForegroundColor Red
    $resourceId = $null
}

# ── STEP 5: LIST POTENSI SAYA ──
Write-Host "`n5. LIST POTENSI SAYA" -ForegroundColor Yellow
$mine = SafeRequest -Uri "$BASE/resources/mine" -Method GET -Headers $headers
if ($mine.Success) {
    Write-Host "   [OK] Total: $($mine.Data.data.pagination.total) potensi" -ForegroundColor Green
    foreach ($r in $mine.Data.data.resources) {
        Write-Host "   - $($r.resource_name) [$($r.status)]" -ForegroundColor Gray
    }
} else { Write-Host "   [FAIL] HTTP $($mine.StatusCode)" -ForegroundColor Red }

# ── STEP 6: DETAIL POTENSI ──
if ($resourceId) {
    Write-Host "`n6. DETAIL POTENSI" -ForegroundColor Yellow
    $detail = SafeRequest -Uri "$BASE/resources/$resourceId" -Method GET -Headers $headers
    if ($detail.Success) {
        Write-Host "   [OK] Detail dimuat" -ForegroundColor Green
        Write-Host "   Opportunity: $($detail.Data.data.opportunity_status)" -ForegroundColor Gray
        Write-Host "   Views: $($detail.Data.data.view_count)" -ForegroundColor Gray
        Write-Host "   Score: $($detail.Data.data.verification_score)" -ForegroundColor Gray
    } else { Write-Host "   [FAIL] HTTP $($detail.StatusCode)" -ForegroundColor Red }
}

# ── STEP 7: ECONOMIC MAP ──
Write-Host "`n7. ECONOMIC MAP (PUBLIC)" -ForegroundColor Yellow
$map = SafeRequest -Uri "$BASE/resources/map" -Method GET
if ($map.Success) {
    Write-Host "   [OK] $($map.Data.data.Count) potensi di peta" -ForegroundColor Green
} else { Write-Host "   [FAIL] HTTP $($map.StatusCode) - $($map.Error)" -ForegroundColor Red }

# ── STEP 8: PAPAN PELUANG ──
Write-Host "`n8. PAPAN PELUANG" -ForegroundColor Yellow
$opp = SafeRequest -Uri "$BASE/opportunities" -Method GET -Headers $headers
if ($opp.Success) {
    Write-Host "   [OK] $($opp.Data.data.pagination.total) peluang" -ForegroundColor Green
} else { Write-Host "   [FAIL] HTTP $($opp.StatusCode)" -ForegroundColor Red }

# ── STEP 9: SIMPAN PELUANG ──
if ($resourceId) {
    Write-Host "`n9. SIMPAN PELUANG" -ForegroundColor Yellow
    $save = SafeRequest -Uri "$BASE/opportunities/$resourceId/save" -Method POST -Headers $headers
    if ($save.Success) {
        Write-Host "   [OK] $($save.Data.message)" -ForegroundColor Green
    } else { Write-Host "   [INFO] HTTP $($save.StatusCode) - $($save.Error)" -ForegroundColor Yellow }
}

# ── STEP 10: LIST KOLABORASI ──
Write-Host "`n10. LIST KOLABORASI" -ForegroundColor Yellow
$collab = SafeRequest -Uri "$BASE/collaborations" -Method GET -Headers $headers
if ($collab.Success) {
    Write-Host "   [OK] $($collab.Data.data.pagination.total) kolaborasi" -ForegroundColor Green
} else { Write-Host "   [FAIL] HTTP $($collab.StatusCode)" -ForegroundColor Red }

# ── STEP 11: PELUANG TERSIMPAN ──
Write-Host "`n11. PELUANG TERSIMPAN" -ForegroundColor Yellow
$saved = SafeRequest -Uri "$BASE/opportunities/saved" -Method GET -Headers $headers
if ($saved.Success) {
    Write-Host "   [OK] $($saved.Data.data.saved.Count) tersimpan" -ForegroundColor Green
} else { Write-Host "   [FAIL] HTTP $($saved.StatusCode)" -ForegroundColor Red }

# ── STEP 12: LOGOUT ──
Write-Host "`n12. LOGOUT" -ForegroundColor Yellow
$out = SafeRequest -Uri "$BASE/auth/logout" -Method POST -Headers $headers
if ($out.Success) {
    Write-Host "   [OK] $($out.Data.message)" -ForegroundColor Green
} else { Write-Host "   [FAIL] HTTP $($out.StatusCode)" -ForegroundColor Red }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " E2E TEST SELESAI" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
