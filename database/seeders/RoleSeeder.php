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
        $adminRole = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        $userRole = \Spatie\Permission\Models\Role::create(['name' => 'pengguna']);

        $admin = \App\Models\User::create([
            'name' => 'Admin SIM MCH',
            'email' => 'admin@mch.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole($adminRole);

        $user = \App\Models\User::create([
            'name' => 'John Doe',
            'email' => 'user@mch.com',
            'password' => bcrypt('password'),
        ]);
        $user->assignRole($userRole);
    }
}
