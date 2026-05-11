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
        // ── 1. Pastikan admin ada ────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@mch.com'],
            [
                'name'     => 'Administrator',
                'password' => Hash::make('password'),
            ]
        );
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // ── 2. Buat user member dummy ────────────────────────────────────
        $memberUsers = [
            ['name' => 'Budi Santoso',    'email' => 'budi@mch.com'],
            ['name' => 'Siti Rahayu',     'email' => 'siti@mch.com'],
            ['name' => 'Ahmad Fauzi',     'email' => 'ahmad@mch.com'],
            ['name' => 'Rizky Prayoga',   'email' => 'rizky@mch.com'],
            ['name' => 'Dewi Anggraeni',  'email' => 'dewi@mch.com'],
            ['name' => 'Hendra Wijaya',   'email' => 'hendra@mch.com'],
        ];

        $members = [];
        foreach ($memberUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name'     => $userData['name'],
                    'password' => Hash::make('password'),
                ]
            );
            if (!$user->hasRole('pengguna')) {
                $user->assignRole('pengguna');
            }
            $members[] = $user;
        }

        // ── 3. Ambil / buat ruangan dummy ───────────────────────────────
        $rooms = Room::all();

        if ($rooms->isEmpty()) {
            $this->command->warn('Tidak ada ruangan. Jalankan RoomSeeder terlebih dahulu.');
            return;
        }

        // ── 4. Data booking ─────────────────────────────────────────────
        $bookingData = [
            // Januari
            ['user' => 0, 'room' => 0, 'start' => '2026-01-08 08:00', 'end' => '2026-01-08 10:00', 'purpose' => 'Rapat koordinasi divisi bulanan',            'status' => 'approved'],
            ['user' => 1, 'room' => 1, 'start' => '2026-01-15 13:00', 'end' => '2026-01-15 15:00', 'purpose' => 'Presentasi laporan keuangan Q4 2025',        'status' => 'approved'],
            ['user' => 2, 'room' => 0, 'start' => '2026-01-22 09:00', 'end' => '2026-01-22 12:00', 'purpose' => 'Sosialisasi kebijakan SDM baru',              'status' => 'rejected'],

            // Februari
            ['user' => 3, 'room' => 1, 'start' => '2026-02-05 10:00', 'end' => '2026-02-05 11:30', 'purpose' => 'Review anggaran proyek infrastruktur',       'status' => 'approved'],
            ['user' => 4, 'room' => 0, 'start' => '2026-02-12 08:00', 'end' => '2026-02-12 16:00', 'purpose' => 'Seminar peningkatan kompetensi pegawai',      'status' => 'approved'],
            ['user' => 0, 'room' => 1, 'start' => '2026-02-20 14:00', 'end' => '2026-02-20 15:30', 'purpose' => 'Evaluasi kinerja triwulan I',                 'status' => 'approved'],

            // Maret
            ['user' => 1, 'room' => 0, 'start' => '2026-03-03 09:00', 'end' => '2026-03-03 11:00', 'purpose' => 'Workshop manajemen risiko',                  'status' => 'approved'],
            ['user' => 5, 'room' => 1, 'start' => '2026-03-17 13:30', 'end' => '2026-03-17 15:00', 'purpose' => 'Diskusi rencana kerja semester I',            'status' => 'rejected'],
            ['user' => 2, 'room' => 0, 'start' => '2026-03-25 10:00', 'end' => '2026-03-25 12:00', 'purpose' => 'Pelatihan penggunaan sistem baru',            'status' => 'approved'],

            // April
            ['user' => 3, 'room' => 0, 'start' => '2026-04-02 08:00', 'end' => '2026-04-02 12:00', 'purpose' => 'Rapat pleno seluruh staf',                   'status' => 'approved'],
            ['user' => 4, 'room' => 1, 'start' => '2026-04-09 14:00', 'end' => '2026-04-09 16:00', 'purpose' => 'Presentasi vendor sistem ERP baru',          'status' => 'approved'],
            ['user' => 0, 'room' => 0, 'start' => '2026-04-16 09:30', 'end' => '2026-04-16 11:30', 'purpose' => 'Koordinasi panitia acara Hari Kartini',       'status' => 'approved'],
            ['user' => 5, 'room' => 1, 'start' => '2026-04-23 13:00', 'end' => '2026-04-23 14:30', 'purpose' => 'Review desain ulang sistem SIM',             'status' => 'rejected'],

            // Mei (bulan ini)
            ['user' => 1, 'room' => 0, 'start' => '2026-05-05 10:00', 'end' => '2026-05-05 12:00', 'purpose' => 'Rapat evaluasi kinerja staf April 2026',     'status' => 'approved'],
            ['user' => 2, 'room' => 1, 'start' => '2026-05-08 13:00', 'end' => '2026-05-08 14:30', 'purpose' => 'Briefing proyek digitalisasi arsip',          'status' => 'approved'],
            ['user' => 3, 'room' => 0, 'start' => '2026-05-12 09:00', 'end' => '2026-05-12 11:00', 'purpose' => 'Sosialisasi prosedur pengadaan barang',       'status' => 'approved'],
            ['user' => 4, 'room' => 1, 'start' => '2026-05-14 14:00', 'end' => '2026-05-14 16:00', 'purpose' => 'Presentasi inovasi layanan publik 2026',     'status' => 'pending'],
            ['user' => 5, 'room' => 0, 'start' => '2026-05-19 08:30', 'end' => '2026-05-19 10:00', 'purpose' => 'Focus group discussion survei kepuasan',     'status' => 'pending'],
            ['user' => 0, 'room' => 1, 'start' => '2026-05-26 13:00', 'end' => '2026-05-26 15:00', 'purpose' => 'Rapat persiapan laporan semester I 2026',    'status' => 'pending'],

            // Juni (mendatang)
            ['user' => 1, 'room' => 0, 'start' => '2026-06-02 09:00', 'end' => '2026-06-02 11:00', 'purpose' => 'Kick-off proyek pengembangan aplikasi',      'status' => 'pending'],
        ];

        foreach ($bookingData as $data) {
            $user = $members[$data['user']] ?? $members[0];
            $room = $rooms[$data['room'] % $rooms->count()];

            Booking::firstOrCreate(
                [
                    'user_id'    => $user->id,
                    'room_id'    => $room->id,
                    'start_time' => $data['start'],
                ],
                [
                    'end_time' => $data['end'],
                    'purpose'  => $data['purpose'],
                    'status'   => $data['status'],
                ]
            );
        }

        $this->command->info('✅ BookingSeeder: ' . count($bookingData) . ' booking berhasil dibuat.');
        $this->command->info('   Users: ' . count($memberUsers) . ' member + 1 admin');
        $this->command->info('   Status: approved / pending / rejected tersebar merata');
    }
}
