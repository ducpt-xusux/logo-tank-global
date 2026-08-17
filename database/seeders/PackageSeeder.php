<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            // Logo Modification Plans
            [
                'category' => 'modification',
                'key' => 'plan_1',
                'prices' => ['vi' => 1500000, 'en' => 310, 'ja' => 20500],
            ],
            [
                'category' => 'modification',
                'key' => 'plan_2',
                'prices' => ['vi' => 2050000, 'en' => 420, 'ja' => 28000],
            ],
            [
                'category' => 'modification',
                'key' => 'plan_3',
                'prices' => ['vi' => 1100000, 'en' => 230, 'ja' => 15000],
            ],

            // Full Design Order Plans
            [
                'category' => 'full_design',
                'key' => 'plan_1',
                'prices' => ['vi' => 5000000, 'en' => 1030, 'ja' => 68000],
            ],
            [
                'category' => 'full_design',
                'key' => 'plan_2',
                'prices' => ['vi' => 8000000, 'en' => 1650, 'ja' => 109000],
            ],
            [
                'category' => 'full_design',
                'key' => 'plan_3',
                'prices' => ['vi' => 15000000, 'en' => 3100, 'ja' => 205000],
            ],

            // Selection Items
            [
                'category' => 'selection',
                'key' => 'item_1',
                'prices' => ['vi' => 2150000, 'en' => 440, 'ja' => 29000],
            ],
            [
                'category' => 'selection',
                'key' => 'item_2',
                'prices' => ['vi' => 1500000, 'en' => 310, 'ja' => 20500],
            ],
            [
                'category' => 'selection',
                'key' => 'item_3',
                'prices' => ['vi' => 3000000, 'en' => 620, 'ja' => 41000],
            ],
        ];

        foreach ($packages as $pkg) {
            Package::updateOrCreate(
                ['category' => $pkg['category'], 'key' => $pkg['key']],
                ['prices' => $pkg['prices'], 'is_active' => true]
            );
        }
    }
}
