<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $adminRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        $userRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'pengguna']);

        // 1. Admin User
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@mch.com'],
            [
                'name' => 'Admin SIM MCH',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole($adminRole);

        // 2. 15 Dummy Users
        $names = [
            'Andi Pratama', 'Budi Santoso', 'Citra Lestari', 'Dewi Sartika', 'Eko Wijaya',
            'Fajar Ramadhan', 'Gita Permata', 'Hadi Kusuma', 'Indah Putri', 'Joko Susilo',
            'Kurnia Sari', 'Lutfi Hakim', 'Maya Kartika', 'Novi Rahayu', 'Oky Saputra'
        ];

        foreach ($names as $index => $name) {
            $user = \App\Models\User::firstOrCreate(
                ['email' => 'user' . ($index + 1) . '@mch.com'],
                [
                    'name' => $name,
                    'password' => bcrypt('password'),
                ]
            );
            $user->assignRole($userRole);
        }
    }
}
