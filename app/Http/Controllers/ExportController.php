<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Exports\BookingsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ExportController extends Controller
{
    // ── Export semua bookings ke Excel ──────────────────────────
    public function excel()
    {
        return Excel::download(new BookingsExport, 'laporan-peminjaman-' . now()->format('Y-m-d') . '.xlsx');
    }

    // ── Export semua bookings ke PDF ────────────────────────────
    public function pdf()
    {
        $bookings = Booking::with(['user', 'room'])->latest()->get();
        
        $pdf = Pdf::loadView('exports.bookings_pdf', [
            'bookings' => $bookings
        ]);

        return $pdf->download('laporan-peminjaman-' . now()->format('Y-m-d') . '.pdf');
    }

    // ── Export per periode (bulan/tahun) ─────────────────────────
    public function period(Request $request)
    {
        $year  = $request->integer('year',  now()->year);
        $month = $request->integer('month', now()->month);
        
        $start = Carbon::create($year, $month, 1)->startOfDay();
        $end   = Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

        $bookings = Booking::with(['user', 'room'])
            ->whereBetween('start_time', [$start, $end])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('exports.bookings_pdf', [
            'bookings' => $bookings
        ]);

        return $pdf->download("laporan-peminjaman-{$year}-{$month}.pdf");
    }
}
