<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;

class DesignerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'designer@example.com'],
            [
                'name' => 'Designer',
                'name_kana' => 'デザイナー',
                'email_verified_at' => Date::now(),
                'role' => 'designer',
                'password' => Hash::make('designer123'),
            ],
        );
    }
}
