<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('Admin/Users', [
            'users' => User::with('roles')->get(),
        ]);
    }

    public function destroy(User $user)
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();

        if (!$admin->hasRole('admin')) {
            abort(403);
        }

        if ($user->id === Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak bisa menghapus akun sendiri.']);
        }

        $user->delete();

        return redirect()->back()->with('message', 'User berhasil dihapus.');
    }
}
