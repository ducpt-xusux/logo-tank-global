<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LogoSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $logos = [
            // Group 1: Designer "nunso" - State 0 (Pending)
            [
                'state' => 0,
                'reg_date' => $now->copy()->subDays(10),
                'up_date' => $now->copy()->subDays(5),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Nike Swoosh Redesign',
                'logo_explain' => 'Modern redesign of Nike swoosh logo',
                'logo_d_id' => 'D001',
                'tank_num' => 1,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 0,
                'reg_date' => $now->copy()->subDays(8),
                'up_date' => $now->copy()->subDays(3),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Apple Logo Variant',
                'logo_explain' => 'Minimalist apple logo concept',
                'logo_d_id' => 'D001',
                'tank_num' => 2,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],

            // Group 2: Designer "nunso" - State 1 (Approved)
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(20),
                'up_date' => $now->copy()->subDays(15),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Adidas Three Stripes',
                'logo_explain' => 'Classic three stripes design',
                'logo_d_id' => 'D001',
                'tank_num' => 3,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(15),
                'up_date' => $now->copy()->subDays(10),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Puma Cat Logo',
                'logo_explain' => 'Stylized puma cat silhouette',
                'logo_d_id' => 'D001',
                'tank_num' => 4,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(12),
                'up_date' => $now->copy()->subDays(7),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'BMW Roundel',
                'logo_explain' => 'Iconic BMW circular logo',
                'logo_d_id' => 'D001',
                'tank_num' => 5,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],

            // Group 3: Designer "nunso" - State 2 (Rejected)
            [
                'state' => 2,
                'reg_date' => $now->copy()->subDays(25),
                'up_date' => $now->copy()->subDays(20),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Rejected Design 1',
                'logo_explain' => 'This design did not meet requirements',
                'logo_d_id' => 'D001',
                'tank_num' => 6,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],

            // Group 4: Designer "nunso" - State 7 (Special)
            [
                'state' => 7,
                'reg_date' => $now->copy()->subDays(5),
                'up_date' => $now->copy()->subDays(2),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Premium Special Logo',
                'logo_explain' => 'VIP client special request',
                'logo_d_id' => 'D001',
                'tank_num' => 7,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],

            // Group 5: Other designers for comparison
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(14),
                'up_date' => $now->copy()->subDays(9),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Amazon Smile',
                'logo_explain' => 'Amazon arrow smile logo',
                'logo_d_id' => 'D002',
                'tank_num' => 8,
                'reg_user' => 'designer_2',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(11),
                'up_date' => $now->copy()->subDays(6),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Google G Logo',
                'logo_explain' => 'Colorful G lettermark',
                'logo_d_id' => 'D003',
                'tank_num' => 9,
                'reg_user' => 'designer_3',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 0,
                'reg_date' => $now->copy()->subDays(7),
                'up_date' => $now->copy()->subDays(4),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Facebook F Icon',
                'logo_explain' => 'Lowercase f in rounded square',
                'logo_d_id' => 'D004',
                'tank_num' => 10,
                'reg_user' => 'designer_4',
                'last_sync_at' => $now->toDateTimeString(),
            ],

            // More logos from "nunso" for pagination testing
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(9),
                'up_date' => $now->copy()->subDays(5),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Mercedes Star',
                'logo_explain' => 'Three-pointed star emblem',
                'logo_d_id' => 'D001',
                'tank_num' => 11,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 1,
                'reg_date' => $now->copy()->subDays(6),
                'up_date' => $now->copy()->subDays(3),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Audi Four Rings',
                'logo_explain' => 'Four interlocking rings',
                'logo_d_id' => 'D001',
                'tank_num' => 12,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],
            [
                'state' => 0,
                'reg_date' => $now->copy()->subDays(4),
                'up_date' => $now->copy()->subDays(2),
                'reg_by' => 'admin',
                'up_by' => 'admin',
                'logo_name' => 'Tesla T Logo',
                'logo_explain' => 'Stylized letter T design',
                'logo_d_id' => 'D001',
                'tank_num' => 13,
                'reg_user' => 'nunso',
                'last_sync_at' => $now->toDateTimeString(),
            ],
        ];

        DB::table('lt_t_logo')->insert($logos);
    }
}
