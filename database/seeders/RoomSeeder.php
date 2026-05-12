<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Aula Serbaguna (Auditorium)',
                'capacity' => 150,
                'facilities' => ['Projector 4K', 'Sound System Pro', 'AC Central', 'Stage', 'Microphone Wireless'],
                'status' => 'available',
            ],
            [
                'name' => 'Studio Musik & Podcast',
                'capacity' => 5,
                'facilities' => ['Audio Interface', 'Condenser Mic', 'Soundproof Wall', 'Monitoring Headphone'],
                'status' => 'available',
            ],
            [
                'name' => 'Coworking Space Utama',
                'capacity' => 40,
                'facilities' => ['High-Speed WiFi', 'Ergonomic Chairs', 'Power Outlets', 'Coffee Machine'],
                'status' => 'available',
            ],
            [
                'name' => 'Ruang Rapat Eksekutif',
                'capacity' => 12,
                'facilities' => ['Smart TV 65"', 'Whiteboard', 'Conference Cam', 'AC'],
                'status' => 'available',
            ],
            [
                'name' => 'Studio Foto & Video',
                'capacity' => 10,
                'facilities' => ['Green Screen', 'Softbox Lighting', 'Tripod', 'AC'],
                'status' => 'available',
            ],
            [
                'name' => 'Lab Komputer Kreatif',
                'capacity' => 20,
                'facilities' => ['iMac Pro', 'Graphic Tablets', 'High-Speed Internet', 'AC'],
                'status' => 'available',
            ],
            [
                'name' => 'Ruang Workshop Seni',
                'capacity' => 25,
                'facilities' => ['Large Tables', 'Sink', 'Good Lighting', 'Storage Lockers'],
                'status' => 'available',
            ],
            [
                'name' => 'Mini Library & Reading Nook',
                'capacity' => 8,
                'facilities' => ['Bookshelf', 'Bean Bags', 'Reading Lamps', 'Quiet Zone'],
                'status' => 'available',
            ],
            [
                'name' => 'Meeting Room B (Glass Room)',
                'capacity' => 6,
                'facilities' => ['Small Whiteboard', 'AC', 'Display Monitor'],
                'status' => 'available',
            ],
            [
                'name' => 'Outdoor Terrace Event',
                'capacity' => 50,
                'facilities' => ['Outdoor Seating', 'Ambient Lighting', 'Small Stage'],
                'status' => 'available',
            ],
        ];

        foreach ($rooms as $room) {
            \App\Models\Room::firstOrCreate(['name' => $room['name']], $room);
        }
    }
}
