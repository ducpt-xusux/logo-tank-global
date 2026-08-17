<?php

namespace Database\Seeders;

use App\Models\Taste;
use Illuminate\Database\Seeder;

class TasteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Taste::truncate();

        $data = [
            [
                'id' => 1,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'ポップ',
                'name_vi' => 'Pop',
                'name_en' => 'Pop',
                'explain' => null
            ],
            [
                'id' => 2,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'ナチュラル',
                'name_vi' => 'Tự nhiên',
                'name_en' => 'Natural',
                'explain' => null
            ],
            [
                'id' => 3,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'シンプル',
                'name_vi' => 'Đơn giản',
                'name_en' => 'Simple',
                'explain' => null
            ],
            [
                'id' => 4,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'モダン',
                'name_vi' => 'Hiện đại',
                'name_en' => 'Modern',
                'explain' => null
            ],
            [
                'id' => 5,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'クール',
                'name_vi' => 'Cool',
                'name_en' => 'Cool',
                'explain' => null
            ],
            [
                'id' => 6,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'ゴージャス',
                'name_vi' => 'Sang trọng',
                'name_en' => 'Gorgeous',
                'explain' => null
            ],
            [
                'id' => 7,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'キュート',
                'name_vi' => 'Dễ thương',
                'name_en' => 'Cute',
                'explain' => null
            ],
            [
                'id' => 8,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '和風',
                'name_vi' => 'Phong cách Nhật Bản',
                'name_en' => 'Japanese',
                'explain' => null
            ],
            [
                'id' => 9,
                'state' => 0,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'その他',
                'name_vi' => 'Khác',
                'name_en' => 'Other',
                'explain' => null
            ],
            // [
            //     'id' => 10,
            //     'state' => 1,
            //     'reg_date' => \Carbon\Carbon::now(),
            //     'up_date' => \Carbon\Carbon::now(),
            //     'reg_by' => 'nunso',
            //     'up_by' => null,
            //     'name' => '単色',
            //     'name_vi' => 'Đơn sắc',
            //     'name_en' => 'Monochrome',
            //     'explain' => null
            // ]
            // [
            //     'id' => 11,
            //     'state' => 1,
            //     'reg_date' => \Carbon\Carbon::now(),
            //     'up_date' => \Carbon\Carbon::now(),
            //     'reg_by' => 'nunso',
            //     'up_by' => null,
            //     'name' => '複数色',
            //     'name_vi' => 'Đa sắc',
            //     'name_en' => 'Multicolored',
            //     'explain' => null
            // ],
            // [
            //     'id' => 12,
            //     'state' => 1,
            //     'reg_date' => \Carbon\Carbon::now(),
            //     'up_date' => \Carbon\Carbon::now(),
            //     'reg_by' => 'nunso',
            //     'up_by' => null,
            //     'name' => 'グラデーション',
            //     'name_vi' => 'Chuyển màu',
            //     'name_en' => 'Gradation',
            //     'explain' => null
            // ],
            // [
            //     'id' => 13,
            //     'state' => 1,
            //     'reg_date' => \Carbon\Carbon::now(),
            //     'up_date' => \Carbon\Carbon::now(),
            //     'reg_by' => 'nunso',
            //     'up_by' => null,
            //     'name' => '動物系',
            //     'name_vi' => 'Động vật',
            //     'name_en' => 'Animals',
            //     'explain' => null
            // ],
            // [
            //     'id' => 14,
            //     'state' => 1,
            //     'reg_date' => \Carbon\Carbon::now(),
            //     'up_date' => \Carbon\Carbon::now(),
            //     'reg_by' => 'nunso',
            //     'up_by' => null,
            //     'name' => 'イラスト系',
            //     'name_vi' => 'Hình minh họa',
            //     'name_en' => 'Illustration',
            //     'explain' => null
            // ]
        ];

        Taste::insert($data);
    }
}
