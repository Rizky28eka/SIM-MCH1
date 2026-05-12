<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BookingSeeder extends Seeder
{
    /**
     * Seed data peminjaman ruangan.
     * Membuat 5 user member + 1 admin (jika belum ada),
     * lalu membuat 20 booking dengan berbagai status & periode.
     */
    public function run(): void
    {
        // ── 1. Ambil data yang sudah ada ────────────────────────────────
        $users = User::role('pengguna')->get();
        $rooms = Room::all();

        if ($users->count() < 15 || $rooms->count() < 10) {
            $this->command->warn('Pastikan RoleSeeder (15 users) dan RoomSeeder (10 rooms) sudah dijalankan.');
            return;
        }

        // ── 2. Data booking sinkron ─────────────────────────────────────
        $purposes = [
            'Rapat Koordinasi Komunitas Kreatif',
            'Workshop Desain Grafis Dasar',
            'Sesi Podcast Mingguan MCH',
            'Latihan Musik Band Lokal',
            'Workshop Fotografi Produk',
            'Pelatihan UI/UX Dasar',
            'Diskusi Panel Start-up Lokal',
            'Sesi Membaca Komunitas',
            'Rapat Internal Pengurus MCH',
            'Persiapan Event Akhir Tahun',
            'Workshop Video Editing',
            'Sesi Mentoring Bisnis Kreatif',
            'Pelatihan Menulis Konten',
            'Workshop Kerajinan Tangan',
            'Seminar Literasi Digital',
            'Rapat Kerjasama Antar Komunitas',
            'Sesi Foto Katalog UMKM',
            'Pelatihan Pembuatan Website',
            'Workshop Animasi 2D',
            'Evaluasi Program Bulanan'
        ];

        $statuses = ['approved', 'pending', 'rejected', 'approved', 'approved'];

        for ($i = 0; $i < 20; $i++) {
            $user = $users[$i % 15];
            $room = $rooms[$i % 10];
            
            $start = now()->startOfMonth()->addDays($i)->setHour(rand(8, 16))->setMinute(0)->setSecond(0);
            $end = (clone $start)->addHours(rand(1, 3));

            Booking::firstOrCreate(
                [
                    'user_id'    => $user->id,
                    'room_id'    => $room->id,
                    'start_time' => $start->toDateTimeString(),
                ],
                [
                    'end_time' => $end->toDateTimeString(),
                    'purpose'  => $purposes[$i],
                    'status'   => $statuses[rand(0, 4)],
                ]
            );
        }

        $this->command->info('✅ BookingSeeder: 20 booking sinkron berhasil dibuat.');
    }
}
