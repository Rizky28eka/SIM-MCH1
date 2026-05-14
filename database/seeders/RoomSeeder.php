<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Auditorium Utama',
                'capacity' => 100,
                'facilities' => ['Sound System', 'Projector', 'AC', 'Wi-Fi', 'Mic Wireless', 'Podium'],
                'image_path' => 'rooms/auditorium.jpg',
                'description' => 'Ruang pertemuan megah dengan sistem audio visual mutakhir, dirancang khusus untuk konferensi besar, seminar inspiratif, dan peluncuran produk kreatif.'
            ],
            [
                'name' => 'Studio Musik & Podcast',
                'capacity' => 5,
                'facilities' => ['Soundproof', 'Audio Interface', 'Mic Condenser', 'Mixer', 'Headphones'],
                'image_path' => 'rooms/studio.jpg',
                'description' => 'Ruang kedap suara dengan standar profesional bagi para kreator audio untuk memproduksi konten podcast berkualitas tinggi atau rekaman musik akustik.'
            ],
            [
                'name' => 'Coworking Space',
                'capacity' => 30,
                'facilities' => ['High-speed Wi-Fi', 'Coffee Corner', 'Power Outlets', 'Ergonomic Chairs'],
                'image_path' => 'rooms/coworking.jpg',
                'description' => 'Area kolaboratif terbuka yang dinamis, memfasilitasi para pekerja lepas dan pengusaha muda untuk bekerja secara efisien dengan konektivitas tanpa batas.'
            ],
            [
                'name' => 'Meeting Room A',
                'capacity' => 12,
                'facilities' => ['Whiteboard', 'LED TV 55 Inch', 'AC', 'Wi-Fi', 'Conference Camera'],
                'image_path' => 'rooms/meeting.jpg',
                'description' => 'Ruang diskusi privat yang ideal untuk sesi brainstorming tim, rapat direksi, atau presentasi strategi bisnis dengan klien penting.'
            ],
            [
                'name' => 'Multimedia Lab',
                'capacity' => 20,
                'facilities' => ['Workstation PC', 'Adobe Suite', 'Drawing Tablet', 'Fiber Optic Internet'],
                'image_path' => 'rooms/lab.jpg',
                'description' => 'Laboratorium teknologi tinggi yang dilengkapi dengan perangkat keras performa tinggi untuk pelatihan desain grafis, editing video, dan pengembangan aplikasi.'
            ],
            [
                'name' => 'Photo Studio',
                'capacity' => 8,
                'facilities' => ['Lighting Kit', 'Green Screen', 'Backdrop System', 'Mirror', 'Changing Room'],
                'image_path' => 'rooms/photo.jpg',
                'description' => 'Studio fotografi profesional dengan pencahayaan terkontrol untuk kebutuhan katalog produk, sesi foto potret, hingga produksi video pendek.'
            ],
            [
                'name' => 'Workshop Area',
                'capacity' => 25,
                'facilities' => ['Large Tables', 'Toolkits', 'Storage Cabinet', 'Washbasin'],
                'image_path' => 'rooms/workshop.jpg',
                'description' => 'Ruang serbaguna yang fleksibel untuk kegiatan tangan kreatif seperti kriya, workshop UMKM, hingga pelatihan keterampilan praktis.'
            ],
            [
                'name' => 'Mini Library',
                'capacity' => 10,
                'facilities' => ['Book Collection', 'Reading Table', 'Silent Area', 'Bean Bags'],
                'image_path' => 'rooms/library.jpg',
                'description' => 'Sudut tenang dengan koleksi literatur kreatif pilihan, tempat yang sempurna untuk riset mandiri atau mencari inspirasi di tengah kesibukan.'
            ],
            [
                'name' => 'Podcasting Booth',
                'capacity' => 2,
                'facilities' => ['Dual Mic Setup', 'Audio Console', 'Comfortable Seating'],
                'image_path' => 'rooms/pod.jpg',
                'description' => 'Kapsul rekaman minimalis untuk dialog satu lawan satu, memberikan kejernihan suara maksimal bagi para podcaster pemula maupun profesional.'
            ],
            [
                'name' => 'Rooftop Creative Lounge',
                'capacity' => 50,
                'facilities' => ['Outdoor Seating', 'Ambiance Lighting', 'City View', 'Power Source'],
                'image_path' => 'rooms/rooftop.jpg',
                'description' => 'Area semi-terbuka di lantai atas dengan pemandangan kota Makassar, sangat cocok untuk networking event malam hari atau gathering komunitas.'
            ],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}
