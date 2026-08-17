<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Color::truncate();

        $data = [
            [
                'id' => 10,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '単色',
                'name_vi' => 'Đơn sắc',
                'name_en' => 'Monochrome',
                'explain' => null,
            ],
            [
                'id' => 11,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '複数色',
                'name_vi' => 'Đa sắc',
                'name_en' => 'Multicolored',
                'explain' => null,
            ],
            [
                'id' => 12,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'グラデーション',
                'name_vi' => 'Chuyển màu',
                'name_en' => 'Gradation',
                'explain' => null,
            ],
            [
                'id' => 13,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '動物系',
                'name_vi' => 'Động vật',
                'name_en' => 'Animals',
                'explain' => null,
            ],
            [
                'id' => 14,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'イラスト系',
                'name_vi' => 'Hình minh họa',
                'name_en' => 'Illustration',
                'explain' => null,
            ],
        ];

        Color::insert($data);
    }
}
