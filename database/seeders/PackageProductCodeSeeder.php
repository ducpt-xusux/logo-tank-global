<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PackageProductCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            4 => 'BAS5875737578',
            5 => 'PRO5875737578',
            6 => 'PRE5875737578',
        ];

        foreach ($data as $id => $code) {
            \App\Models\Package::where('id', $id)->update(['product_code' => $code]);
        }
    }
}
