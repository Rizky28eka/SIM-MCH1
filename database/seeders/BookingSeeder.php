<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Notifications\BookingNotification;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = Room::all();
        $user = User::where('email', 'user@example.com')->first();
        
        if (!$user) return;

        $scenarios = [
            [
                'purpose' => 'Makassar Startup Pitching Day 2026',
                'objective' => 'Menghubungkan inovator muda Makassar dengan investor nasional untuk pendanaan tahap awal.',
                'organization' => 'Makassar Digital Valley',
                'position' => 'Program Manager',
                'participants' => 80,
                'format' => 'Tidak Berbayar',
                'status' => 'approved',
                'room_index' => 0, // Auditorium
                'days_offset' => 2,
            ],
            [
                'purpose' => 'Sosialisasi Digitalisasi UMKM Lorong',
                'objective' => 'Memberikan pelatihan pemasaran digital bagi pelaku usaha mikro di wilayah Makassar.',
                'organization' => 'Dinas Koperasi & UMKM Kota Makassar',
                'position' => 'Kepala Bidang Pemberdayaan',
                'participants' => 45,
                'format' => 'Tidak Berbayar',
                'status' => 'approved',
                'room_index' => 6, // Workshop Area
                'days_offset' => 5,
            ],
            [
                'purpose' => 'Recording Podcast "Kreatifitas Anak Muda"',
                'objective' => 'Produksi konten mingguan yang membahas tren ekonomi kreatif di Sulawesi Selatan.',
                'organization' => 'Komunitas Kreatif Makassar',
                'position' => 'Content Creator',
                'participants' => 3,
                'format' => 'Tidak Berbayar',
                'status' => 'pending',
                'room_index' => 1, // Studio
                'days_offset' => 1,
            ],
            [
                'purpose' => 'Workshop UI/UX Design for Beginners',
                'objective' => 'Meningkatkan skill desain antarmuka bagi mahasiswa dan fresh graduate.',
                'organization' => 'Dribbble Meetup Makassar',
                'position' => 'Regional Coordinator',
                'participants' => 20,
                'format' => 'Berbayar',
                'status' => 'approved',
                'room_index' => 4, // Multimedia Lab
                'days_offset' => 10,
            ],
            [
                'purpose' => 'Rapat Koordinasi Festival F8 Makassar',
                'objective' => 'Sinkronisasi teknis antara panitia pelaksana dan pihak MCH sebagai lokasi satelit.',
                'organization' => 'Panitia Festival F8',
                'position' => 'Sekretaris Umum',
                'participants' => 12,
                'format' => 'Tidak Berbayar',
                'status' => 'approved',
                'room_index' => 3, // Meeting Room
                'days_offset' => 3,
            ],
            [
                'purpose' => 'Sesi Foto Katalog Brand Lokal "Lontara"',
                'objective' => 'Pemotretan koleksi terbaru untuk kebutuhan website dan media sosial.',
                'organization' => 'Lontara Apparel',
                'position' => 'Creative Director',
                'participants' => 6,
                'format' => 'Tidak Berbayar',
                'status' => 'approved',
                'room_index' => 5, // Photo Studio
                'days_offset' => 7,
            ],
            [
                'purpose' => 'Community Gathering & Networking Night',
                'objective' => 'Ajang silaturahmi antar pengembang aplikasi di Makassar.',
                'organization' => 'Makassar Dev Community',
                'position' => 'Lead Organizer',
                'participants' => 40,
                'format' => 'Tidak Berbayar',
                'status' => 'pending',
                'room_index' => 9, // Rooftop
                'days_offset' => 12,
            ],
            [
                'purpose' => 'Pelatihan Jurnalistik Warga',
                'objective' => 'Edukasi cara penulisan berita dan etika jurnalistik bagi pemuda.',
                'organization' => 'AJI Makassar',
                'position' => 'Ketua Bidang Pendidikan',
                'participants' => 25,
                'format' => 'Tidak Berbayar',
                'status' => 'rejected',
                'room_index' => 0, // Auditorium
                'days_offset' => -2, // Past date
            ],
        ];

        foreach ($scenarios as $s) {
            $room = $rooms[$s['room_index']];
            $startTime = Carbon::now()->addDays($s['days_offset'])->setTime(9, 0, 0);
            $endTime = (clone $startTime)->addHours(4);

            $booking = Booking::create([
                'user_id' => $user->id,
                'room_id' => $room->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'purpose' => $s['purpose'],
                'objective' => $s['objective'],
                'organization' => $s['organization'],
                'position' => $s['position'],
                'phone' => '0812' . rand(10000000, 99999999),
                'participants_count' => $s['participants'],
                'event_format' => $s['format'],
                'status' => $s['status'],
                'statement_path' => $s['status'] === 'approved' ? 'verifications/dummy_statement.pdf' : null,
                'usage_path' => $s['status'] === 'approved' ? 'verifications/dummy_usage.pdf' : null,
            ]);

            // Create initial notification for each booking
            $user->notify(new BookingNotification(
                $booking,
                'Status Peminjaman',
                'Peminjaman Anda untuk ' . $booking->room->name . ' telah ' . ($s['status'] === 'approved' ? 'Disetujui' : ($s['status'] === 'rejected' ? 'Ditolak' : 'Diterima Sistem')),
                $s['status'] === 'approved' ? 'success' : ($s['status'] === 'rejected' ? 'error' : 'info')
            ));
        }

        echo "✅ BookingSeeder: Data profesional berhasil dibuat.\n";
    }
}
