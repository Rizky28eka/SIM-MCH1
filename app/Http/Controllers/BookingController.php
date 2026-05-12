<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use App\Notifications\BookingNotification;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $query = Booking::with(['room', 'user']);

        // Search logic
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('purpose', 'like', "%{$search}%")
                  ->orWhereHas('room', function($rq) use ($search) {
                      $rq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Admin sees all, users see theirs
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('Bookings/Index', [
            'bookings' => $query->latest()->get(),
            'isAdmin' => $user->hasRole('admin'),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Bookings/Create', [
            'rooms' => Room::where('status', 'available')->get(),
            'selected_room_id' => $request->room_id,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'purpose' => 'required|string|max:255',
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

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'room_id' => $request->room_id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'purpose' => $request->purpose,
            'status' => 'pending',
        ]);

        // Notify Admins
        $admins = User::role('admin')->get();
        if ($admins->isEmpty()) {
            $admins = User::where('email', 'admin@mch.com')->get();
        }
        Notification::send($admins, new BookingNotification(
            $booking,
            'Pengajuan Baru',
            Auth::user()->name . ' mengajukan peminjaman ' . $booking->room->name,
            'info'
        ));

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

        // Notify User
        $statusLabel = $booking->status === 'approved' ? 'Disetujui' : 'Ditolak';
        $booking->user->notify(new BookingNotification(
            $booking,
            'Status Peminjaman',
            'Peminjaman Anda untuk ' . $booking->room->name . ' telah ' . $statusLabel,
            $booking->status === 'approved' ? 'success' : 'error'
        ));

        return redirect()->back()->with('message', 'Status peminjaman diperbarui.');
    }

    public function uploadVerification(Request $request, Booking $booking)
    {
        $request->validate([
            'verification_document' => 'required|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);

        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        if ($booking->status !== 'approved') {
            return redirect()->back()->withErrors(['error' => 'Berkas hanya dapat diunggah setelah disetujui.']);
        }

        $path = $request->file('verification_document')->store('verifications', 'public');
        $booking->update(['verification_path' => $path]);

        return redirect()->back()->with('message', 'Berkas verifikasi berhasil diunggah.');
    }
}
