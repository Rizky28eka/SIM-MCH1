<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ExportController extends Controller
{
    // ── Export semua bookings ke Excel ──────────────────────────
    public function excel()
    {
        $bookings = Booking::with(['user', 'room'])->latest()->get();
        return $this->downloadCsv($bookings, 'laporan-peminjaman-semua.csv');
    }

    // ── Export semua bookings ke "PDF" (CSV fallback) ───────────
    public function pdf()
    {
        $bookings = Booking::with(['user', 'room'])->latest()->get();
        return $this->downloadCsv($bookings, 'laporan-peminjaman.csv');
    }

    // ── Export per periode (bulan/tahun) ─────────────────────────
    public function period(Request $request)
    {
        $year  = $request->integer('year',  now()->year);
        $month = $request->integer('month', now()->month);
        $label = $request->string('label', "laporan-{$year}-{$month}");

        $start = Carbon::create($year, $month, 1)->startOfDay();
        $end   = Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

        $bookings = Booking::with(['user', 'room'])
            ->whereBetween('created_at', [$start, $end])
            ->latest()
            ->get();

        $filename = Str::slug($label) . '.csv';
        return $this->downloadCsv($bookings, $filename);
    }

    // ── Helper: Generate CSV download response ───────────────────
    private function downloadCsv($bookings, string $filename)
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($bookings) {
            $handle = fopen('php://output', 'w');

            // BOM untuk Excel agar bisa baca UTF-8
            fputs($handle, "\xEF\xBB\xBF");

            // Header row
            fputcsv($handle, [
                'No', 'Ruangan', 'Peminjam', 'Mulai', 'Selesai', 'Keperluan', 'Status',
            ]);

            foreach ($bookings as $i => $b) {
                fputcsv($handle, [
                    $i + 1,
                    $b->room->name  ?? '-',
                    $b->user->name  ?? '-',
                    $b->start_time  ? Carbon::parse($b->start_time)->format('d/m/Y H:i') : '-',
                    $b->end_time    ? Carbon::parse($b->end_time)->format('d/m/Y H:i')   : '-',
                    $b->purpose     ?? '-',
                    match ($b->status) {
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                        'pending'  => 'Menunggu',
                        default    => $b->status,
                    },
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
