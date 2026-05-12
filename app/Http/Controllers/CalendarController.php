<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['room', 'user'])
            ->whereIn('status', ['approved', 'pending'])
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'title' => $booking->room->name . ' (' . $booking->user->name . ')',
                    'start' => $booking->start_time,
                    'end' => $booking->end_time,
                    'status' => $booking->status,
                    'purpose' => $booking->purpose,
                ];
            });

        return Inertia::render('Calendar', [
            'events' => $bookings,
            'rooms' => Room::all(),
        ]);
    }
}
