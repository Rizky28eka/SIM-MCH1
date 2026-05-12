<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $isAdmin = $user->hasRole('admin');

        // ── Parsing Filter Tanggal ────────────────────────────────
        $startDate = $request->input('from') 
            ? Carbon::parse($request->input('from'))->startOfDay() 
            : now()->startOfMonth()->startOfDay();
            
        $endDate = $request->input('to') 
            ? Carbon::parse($request->input('to'))->endOfDay() 
            : now()->endOfDay();

        // ── Statistik Utama (Role-Scoped) ────────────────────────
        $roomQuery = Room::query();
        $bookingQuery = Booking::whereBetween('created_at', [$startDate, $endDate]);
        
        if (!$isAdmin) {
            $bookingQuery->where('user_id', $user->id);
        }

        $totalRooms      = Room::count();
        $totalBookings   = (clone $bookingQuery)->count();
        $pendingBookings = (clone $bookingQuery)->where('status', 'pending')->count();
        $approvedBookings= (clone $bookingQuery)->where('status', 'approved')->count();

        // ── Perhitungan Delta ────────────────────────────────────
        $daysDiff = $startDate->diffInDays($endDate) + 1;
        $prevStartDate = $startDate->copy()->subDays($daysDiff);
        $prevEndDate = $endDate->copy()->subDays($daysDiff);

        $prevPeriodQuery = Booking::whereBetween('created_at', [$prevStartDate, $prevEndDate]);
        if (!$isAdmin) {
            $prevPeriodQuery->where('user_id', $user->id);
        }
        $prevPeriodCount = $prevPeriodQuery->count();

        $monthDelta = 0;
        if ($prevPeriodCount > 0) {
            $monthDelta = round((($totalBookings - $prevPeriodCount) / $prevPeriodCount) * 100);
        } elseif ($totalBookings > 0) {
            $monthDelta = 100;
        }

        // ── Statistik Penggunaan Ruangan ─────────────────────────
        $roomUsageQuery = Room::withCount(['bookings' => function($q) use ($startDate, $endDate, $isAdmin, $user) {
            $q->whereBetween('created_at', [$startDate, $endDate]);
            if (!$isAdmin) {
                $q->where('user_id', $user->id);
            }
        }]);
        
        $roomUsage = $roomUsageQuery->get()->map(fn($r) => [
            'name'  => $r->name,
            'count' => $r->bookings_count,
        ]);

        // ── Aktivitas Terkini ───────────────────────────────────
        $recentBookingsQuery = Booking::with(['user', 'room'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest();
            
        if (!$isAdmin) {
            $recentBookingsQuery->where('user_id', $user->id);
        }
        
        $recentBookings = $recentBookingsQuery->take(5)->get();

        return Inertia::render('Dashboard', [
            'isAdmin' => $isAdmin,
            'filters' => [
                'from' => $startDate->toDateString(),
                'to'   => $endDate->toDateString(),
            ],
            'stats' => [
                'totalRooms'      => $totalRooms,
                'totalBookings'   => $totalBookings,
                'pendingBookings' => $pendingBookings,
                'approvedBookings'=> $approvedBookings,
                'monthDelta'      => $monthDelta,
                'thisMonth'       => $totalBookings,
            ],
            'roomUsage'      => $roomUsage,
            'recentBookings' => $recentBookings,
        ]);
    }
}
