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
use Barryvdh\DomPDF\Facade\Pdf;

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
            'position' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'participants_count' => 'required|integer|min:1',
            'event_format' => 'required|string|in:Berbayar,Tidak Berbayar',
            'objective' => 'required|string|max:1000',
        ]);

        // 1. Pastikan waktu tidak di masa lalu (double check)
        if (Carbon::parse($request->start_time)->isPast()) {
            return redirect()->back()->withErrors(['error' => 'Waktu mulai tidak boleh di masa lalu.']);
        }

        // 2. Cek bentrok jadwal (Conflict Detection)
        // Rumus Overlap: (StartA < EndB) AND (EndA > StartB)
        $conflict = Booking::where('room_id', $request->room_id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(function ($query) use ($request) {
                $query->where('start_time', '<', $request->end_time)
                      ->where('end_time', '>', $request->start_time);
            })
            ->first();

        if ($conflict) {
            $startTime = Carbon::parse($conflict->start_time)->translatedFormat('H:i');
            $endTime = Carbon::parse($conflict->end_time)->translatedFormat('H:i');
            return redirect()->back()->withErrors([
                'error' => "Ruangan ini sudah dipesan pada pukul {$startTime} - {$endTime} untuk kegiatan: '{$conflict->purpose}'."
            ]);
        }

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'room_id' => $request->room_id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'purpose' => $request->purpose,
            'position' => $request->position,
            'organization' => $request->organization,
            'phone' => $request->phone,
            'participants_count' => $request->participants_count,
            'event_format' => $request->event_format,
            'objective' => $request->objective,
            'status' => 'pending',
        ]);

        // Notify Admins
        $admins = \App\Models\User::role('admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new BookingNotification(
            $booking,
            'Pengajuan Baru',
            'Ada pengajuan peminjaman baru untuk ' . $booking->room->name . ' dari ' . Auth::user()->name,
            'info'
        ));

        return redirect()->route('bookings.index')->with('message', 'Peminjaman berhasil diajukan.');
    }

    public function show(Booking $booking)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user is owner or admin
        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403);
        }

        return Inertia::render('Bookings/Show', [
            'booking' => $booking->load(['room', 'user']),
            'isAdmin' => $user->hasRole('admin'),
        ]);
    }

    public function download(Booking $booking, $type)
    {
        $path = null;
        if ($type === 'statement') $path = $booking->statement_path;
        elseif ($type === 'usage') $path = $booking->usage_path;
        elseif ($type === 'document') $path = $booking->document_path;

        if (!$path) {
            abort(404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user is owner or admin
        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403);
        }

        return response()->file(storage_path('app/public/' . $path));
    }

    public function generateTemplate(Booking $booking, string $type)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user is owner or admin
        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403);
        }

        // Generate dynamic PDF based on type
        if ($type === 'statement') {
            $pdf = Pdf::loadView('pdf.statement', compact('booking'));
            return $pdf->stream('Surat_Pernyataan_' . $booking->id . '.pdf');
        }

        if ($type === 'usage') {
            $pdf = Pdf::loadView('pdf.usage', compact('booking'));
            return $pdf->stream('Surat_Penggunaan_' . $booking->id . '.pdf');
        }

        abort(404);
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

        if ($validated['status'] === 'approved' && (!$booking->statement_path || !$booking->usage_path)) {
            return redirect()->back()->withErrors(['error' => 'Peminjaman tidak dapat disetujui sebelum kedua berkas verifikasi diunggah oleh penyewa.']);
        }

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
            'type' => 'required|in:statement,usage',
            'file' => 'required|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);

        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        if ($booking->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Berkas hanya dapat diunggah saat status pengajuan masih pending.']);
        }

        $type = $request->type;
        $path = $request->file('file')->store('verifications', 'public');

        if ($type === 'statement') {
            $booking->update(['statement_path' => $path]);
        } else {
            $booking->update(['usage_path' => $path]);
        }

        // Notify Admins about upload
        $admins = \App\Models\User::role('admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new BookingNotification(
            $booking,
            'Berkas Baru Diunggah',
            'Penyewa ' . $booking->user->name . ' telah mengunggah ' . ($type === 'statement' ? 'Surat Pernyataan' : 'Surat Penggunaan') . ' untuk ' . $booking->room->name,
            'success'
        ));

        return redirect()->back()->with('message', 'Berkas berhasil diunggah.');
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $conflict = Booking::where('room_id', $request->room_id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(function ($query) use ($request) {
                $query->where('start_time', '<', $request->end_time)
                      ->where('end_time', '>', $request->start_time);
            })
            ->first();

        if ($conflict) {
            return response()->json([
                'available' => false,
                'conflict' => [
                    'purpose' => $conflict->purpose,
                    'start' => Carbon::parse($conflict->start_time)->format('H:i'),
                    'end' => Carbon::parse($conflict->end_time)->format('H:i'),
                ]
            ]);
        }

        return response()->json(['available' => true]);
    }

    public function getRoomSchedule(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
        ]);

        $bookings = Booking::where('room_id', $request->room_id)
            ->whereIn('status', ['pending', 'approved'])
            ->where('end_time', '>=', now()) // Hanya yang akan datang atau sedang berlangsung
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function($b) {
                return [
                    'start' => Carbon::parse($b->start_time)->format('d M, H:i'),
                    'end' => Carbon::parse($b->end_time)->format('H:i'),
                    'purpose' => $b->purpose
                ];
            });

        return response()->json($bookings);
    }
}
