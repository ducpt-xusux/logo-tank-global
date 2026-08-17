<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Setting::truncate();
        Setting::insert([
            [
                'key' => 'logo_price',
                'value' => json_encode([
                    'vi' => 968000,
                    'ja' => 13200,
                    'en' => 198,
                ]),
            ],
            [
                'key' => 'logo_manual_price',
                'value' => json_encode([
                    'vi' => 1760000,
                    'ja' => 7150,
                    'en' => 75,
                ]),
            ],
            [
                'key' => 'logo_motion_price',
                'value' => json_encode([
                    'vi' => 2710000,
                    'ja' => 11000,
                    'en' => 135,
                ]),
            ],
            [
                'key' => 'cancellation_fee',
                'value' => json_encode([
                    'vi' => 810000,
                    'ja' => 3300,
                    'en' => 49,
                ]),
            ],
            [
                'key' => 'tax',
                'value' => json_encode([
                    'vi' => 10,
                    'ja' => 10,
                    'en' => 10,
                ]),
            ],
            // [
            //     'key' => 'shipping_cost',
            //     'value' => json_encode([
            //         'vi' => 0,
            //         'ja' => 0,
            //         'en' => 0
            //     ])
            // ],

        ]);
    }
}
