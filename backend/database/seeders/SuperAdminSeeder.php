<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => env('SUPER_ADMIN_EMAIL')],
            [
                'first_name' => 'Tesfa',
                'last_name'  => 'Tefera',
                'password'   => Hash::make(env('SUPER_ADMIN_PASSWORD')),
                'role'       => 'super_admin',
                'status'     => 'active',
            ]
        );
    }
}
