<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Room;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Rooms/Index', [
            'rooms' => Room::all(),
            'canManage' => $user->hasRole('admin'),
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('Rooms/Create');
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'facilities' => 'nullable|array',
            'status' => 'required|string|in:available,maintenance,unavailable',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('rooms', 'public');
        }

        unset($validated['image']);

        Room::create($validated);

        return redirect()->route('rooms.index')->with('message', 'Ruangan berhasil dibuat.');
    }

    public function show(Room $room)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Rooms/Show', [
            'room' => $room,
            'canManage' => $user->hasRole('admin'),
        ]);
    }

    public function edit(Room $room)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('Rooms/Edit', [
            'room' => $room,
        ]);
    }

    public function update(Request $request, Room $room)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Simple role check for now
        if (!$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'facilities' => 'nullable|array',
            'status' => 'required|string|in:available,maintenance,unavailable',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($room->image_path) {
                Storage::disk('public')->delete($room->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('rooms', 'public');
        }

        unset($validated['image']);

        $room->update($validated);

        return redirect()->route('rooms.index')->with('message', 'Ruangan berhasil diperbarui.');
    }

    public function destroy(Room $room)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            abort(403);
        }

        if ($room->image_path) {
            Storage::disk('public')->delete($room->image_path);
        }

        $room->delete();

        return redirect()->route('rooms.index')->with('message', 'Ruangan berhasil dihapus.');
    }
}
