---
title: Ekspor CSV Jutaan Data di Laravel Tanpa Library Eksternal (Hemat RAM & Otomatis Upload ke S3)
description: sedikit pengalaman saat optimasi eksport data besar.
---

# Ekspor CSV Jutaan Data di Laravel Tanpa Library Eksternal (Hemat RAM & Otomatis Upload ke S3)

Pada artikel ini, saya akan membagikan bagaimana cara melakukan ekspor data dalam jumlah besar (jutaan row) dari database Laravel ke file `.csv` **tanpa menggunakan Laravel Excel**, serta **mengunggah hasilnya langsung ke S3/DigitalOcean Spaces**.

## 🎯 Studi Kasus

- Model: `FailedRecon`
- Tujuan: Ekspor data ke CSV
- Kebutuhan:
  - Hemat RAM (server 2GB RAM & 1 core CPU)
  - Filter by tanggal & bank
  - Format delimiter titik koma `;`
  - Upload hasil ke S3 dan hapus file lokal

## 🧱 Pendekatan yang Digunakan

1. **`lazyById()`**: Untuk efisiensi memori dan menghindari duplikasi data.
2. **`fopen()` + `fputcsv()`**: Menulis CSV secara langsung (stream) agar hemat resource.
3. **`Storage::disk('s3')->put()`**: Mengunggah hasil ke S3 atau DigitalOcean Spaces.
4. **`unlink()`**: Menghapus file lokal setelah berhasil upload.

## 📄 Kode Lengkap Job Laravel

```php
<?php

namespace App\Jobs;

use App\Models\FailedRecon;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExportFailedReconCsvJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $filePath;
    protected ?string $startDate;
    protected ?string $endDate;
    protected ?int $bankId;

    public function __construct(
        string $filePath = 'exports/failed_recon.csv',
        ?string $startDate = null,
        ?string $endDate = null,
        ?int $bankId = null
    ) {
        $this->filePath = $filePath;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->bankId = $bankId;
    }

    public function handle(): void
    {
        $localPath = storage_path("app/public/{$this->filePath}");

        if (!is_dir(dirname($localPath))) {
            mkdir(dirname($localPath), 0755, true);
        }

        $stream = fopen($localPath, 'w');
        fwrite($stream, $this->getUtf8Bom());
        fputcsv($stream, [
            'Key Code',
            'Bank ID',
            'Type',
            'Payment Date',
            'Amount',
            'Created At',
        ], ';');

        $query = FailedRecon::query()->orderBy('id');

        if ($this->startDate && $this->endDate) {
            $query->whereBetween('payment_date', [$this->startDate, $this->endDate]);
        }

        if ($this->bankId) {
            $query->where('bank_id', $this->bankId);
        }

        foreach ($query->lazyById(1000) as $row) {
            fputcsv($stream, [
                $row->key_code,
                $row->bank_id,
                $row->type,
                $row->payment_date,
                $row->amount,
                $row->created_at,
            ], ';');
        }

        fclose($stream);

        // Upload ke S3
        $fileResource = fopen($localPath, 'r');
        Storage::disk('s3')->put($this->filePath, $fileResource, 'public');
        fclose($fileResource);

        // Hapus file lokal
        unlink($localPath);

        Log::info("Export selesai & file diupload ke S3: {$this->filePath}");
    }

    protected function getUtf8Bom(): string
    {
        return chr(239) . chr(187) . chr(191);
    }
}
```

## ⚙️ Contoh Controller untuk Menjalankan Ekspor

```php
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Jobs\ExportFailedReconCsvJob;

public function downloadFailedRecon(Request $request)
{
    $validated = $request->validate([
        'start_date' => 'nullable|date',
        'end_date'   => 'nullable|date|after_or_equal:start_date',
        'bank_id'    => 'nullable|exists:banks,id', // sesuaikan jika nama tabel lain
    ]);

    $start = $validated['start_date'] ?? 'all';
    $end = $validated['end_date'] ?? 'all';
    $bankId = $validated['bank_id'] ?? 'all';

    // Buat nama file unik berdasarkan filter + random string
    $filename = 'failed_recon_' . $start . '_' . $end . '_bank' . $bankId . '_' . Str::random(6) . '.csv';
    $filePath = 'exports/' . $filename;

    ExportFailedReconCsvJob::dispatch(
        $filePath,
        $validated['start_date'] ?? null,
        $validated['end_date'] ?? null,
        $validated['bank_id'] ?? null
    );

    return response()->json([
        'message' => 'File sedang disiapkan. Silakan tunggu beberapa saat.'
    ]);
}
```

## ✅ Kelebihan Pendekatan Ini

⚡ Super ringan untuk RAM kecil

✔️ Aman dari data berubah saat proses (karena lazyById)

📤 Otomatis terupload ke cloud (S3/Spaces)

📑 Format CSV rapi, delimiter bisa dikustom
