<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Booking;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // ── Overview Stats ─────────────────────────────────────
        $totalRooms     = Room::count();
        $totalBookings  = Booking::count();
        $pendingBookings  = Booking::where('status', 'pending')->count();
        $approvedBookings = Booking::where('status', 'approved')->count();
        $rejectedBookings = Booking::where('status', 'rejected')->count();

        // This month vs last month
        $thisMonth = Booking::whereMonth('created_at', now()->month)
                            ->whereYear('created_at', now()->year)->count();
        $lastMonth = Booking::whereMonth('created_at', now()->subMonth()->month)
                            ->whereYear('created_at', now()->subMonth()->year)->count();
        $monthDelta = $lastMonth > 0
            ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1)
            : ($thisMonth > 0 ? 100 : 0);

        // ── Room Usage (bar chart overview) ─────────────────────
        $roomUsage = Room::withCount(['bookings' => function ($q) {
            $q->where('status', 'approved');
        }])->get(['id', 'name'])->map(fn($r) => [
            'name'  => $r->name,
            'count' => $r->bookings_count,
        ])->values();

        // ── Recent Bookings ──────────────────────────────────────
        $recentBookings = Booking::with(['user', 'room'])
            ->latest()->take(5)->get()
            ->map(fn($b) => [
                'id'         => $b->id,
                'room'       => ['name' => $b->room->name ?? '-'],
                'user'       => ['name' => $b->user->name ?? '-'],
                'start_time' => $b->start_time,
                'status'     => $b->status,
            ]);

        // ── Analytics: Monthly Trend (12 months) ────────────────
        $monthlyTrend = collect(range(1, 12))->map(function ($month) {
            $year = now()->year;
            $total    = Booking::whereYear('created_at', $year)->whereMonth('created_at', $month)->count();
            $approved = Booking::whereYear('created_at', $year)->whereMonth('created_at', $month)->where('status', 'approved')->count();
            $rejected = Booking::whereYear('created_at', $year)->whereMonth('created_at', $month)->where('status', 'rejected')->count();
            return [
                'bulan'      => Carbon::create($year, $month)->locale('id')->monthName,
                'bulanShort' => Carbon::create($year, $month)->format('M'),
                'peminjaman' => $total,
                'disetujui'  => $approved,
                'ditolak'    => $rejected,
            ];
        })->values();

        // ── Analytics: Status Pie ─────────────────────────────────
        $pieData = [
            ['name' => 'Disetujui', 'value' => $approvedBookings, 'color' => '#0F172A'],
            ['name' => 'Pending',   'value' => $pendingBookings,  'color' => '#94a3b8'],
            ['name' => 'Ditolak',   'value' => $rejectedBookings, 'color' => '#e2e8f0'],
        ];

        // ── Analytics: KPI Cards ─────────────────────────────────
        $avgPerMonth = $monthlyTrend->avg('peminjaman');
        $peakMonth   = $monthlyTrend->sortByDesc('peminjaman')->first();
        $approvalRate = $totalBookings > 0
            ? round(($approvedBookings / $totalBookings) * 100) : 0;
        $rejectRate   = $totalBookings > 0
            ? round(($rejectedBookings / $totalBookings) * 100) : 0;

        $analytics = [
            'monthlyTrend'  => $monthlyTrend,
            'pieData'       => $pieData,
            'avgPerMonth'   => round($avgPerMonth, 1),
            'approvalRate'  => $approvalRate,
            'rejectRate'    => $rejectRate,
            'peakMonth'     => $peakMonth ? $peakMonth['bulanShort'] : '-',
            'peakCount'     => $peakMonth ? $peakMonth['peminjaman'] : 0,
        ];

        // ── Laporan: grouping per bulan + quarter ─────────────────
        $laporan = $this->buildLaporan();

        // ── Notifikasi: dihapus dari dashboard ──

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRooms'      => $totalRooms,
                'totalBookings'   => $totalBookings,
                'pendingBookings' => $pendingBookings,
                'approvedBookings'=> $approvedBookings,
                'monthDelta'      => $monthDelta,
                'thisMonth'       => $thisMonth,
            ],
            'roomUsage'      => $roomUsage,
            'recentBookings' => $recentBookings,
            'analytics'      => $analytics,
            'laporan'        => $laporan,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    private function buildLaporan(): array
    {
        $reports = [];
        $now     = now();

        // Monthly reports: last 6 months
        for ($i = 0; $i < 6; $i++) {
            $date  = $now->copy()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end   = $date->copy()->endOfMonth();
            $total = Booking::whereBetween('created_at', [$start, $end])->count();
            $isCurrentMonth = $i === 0;
            $reports[] = [
                'id'      => "month-{$date->format('Y-m')}",
                'judul'   => 'Laporan Peminjaman ' . $date->locale('id')->translatedFormat('F Y'),
                'periode' => $start->format('j') . '–' . $end->format('j') . ' ' . $date->locale('id')->translatedFormat('M Y'),
                'total'   => $total,
                'status'  => $isCurrentMonth && $end->isFuture() ? 'proses' : 'selesai',
                'file'    => $isCurrentMonth && $end->isFuture() ? '' : "laporan-{$date->format('M-Y')}.pdf",
            ];
        }

        // Q1 quarterly
        $q1Start = Carbon::create($now->year, 1, 1)->startOfDay();
        $q1End   = Carbon::create($now->year, 3, 31)->endOfDay();
        $q1Total = Booking::whereBetween('created_at', [$q1Start, $q1End])->count();
        $reports[] = [
            'id'      => "q1-{$now->year}",
            'judul'   => "Laporan Q1 {$now->year}",
            'periode' => "Jan – Mar {$now->year}",
            'total'   => $q1Total,
            'status'  => 'selesai',
            'file'    => "laporan-q1-{$now->year}.pdf",
        ];

        return $reports;
    }

}
