<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Room;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $query = Booking::with(['room', 'user']);

        // Admin sees all, users see theirs
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('Bookings/Index', [
            'bookings' => $query->latest()->get(),
            'rooms' => Room::where('status', 'available')->get(),
            'isAdmin' => $user->hasRole('admin'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'purpose' => 'required|string|max:255',
            'document' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:2048',
        ]);

        // Conflict detection
        $conflict = Booking::where('room_id', $request->room_id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                    });
            })
            ->exists();

        if ($conflict) {
            return redirect()->back()->withErrors(['error' => 'Ruangan sudah dipesan pada waktu tersebut.']);
        }

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('bookings', 'public');
        }

        Booking::create([
            'user_id' => Auth::id(),
            'room_id' => $request->room_id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'purpose' => $request->purpose,
            'document_path' => $documentPath,
            'status' => 'pending',
        ]);

        return redirect()->route('bookings.index')->with('message', 'Pemesanan berhasil diajukan.');
    }

    public function download(Booking $booking)
    {
        if (!$booking->document_path) {
            abort(404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user is owner or admin
        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403);
        }

        return response()->download(storage_path('app/public/' . $booking->document_path));
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,cancelled',
            'admin_note' => 'nullable|string',
        ]);

        $booking->update($validated);

        return redirect()->back()->with('message', 'Status peminjaman diperbarui.');
    }
}
