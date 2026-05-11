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
        \App\Models\Room::create([
            'name' => 'Aula Serbaguna',
            'capacity' => 100,
            'facilities' => ['Projector', 'Sound System', 'AC'],
            'status' => 'available',
        ]);

        \App\Models\Room::create([
            'name' => 'Ruang Rapat A',
            'capacity' => 20,
            'facilities' => ['TV', 'Whiteboard', 'AC'],
            'status' => 'available',
        ]);
    }
}
