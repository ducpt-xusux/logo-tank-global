<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Seeder;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Industry::truncate();
        $data = [
            [
                'id' => 1,
                'state' => 0,
                'order_id' => 1,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '美容・サロン',
                'name_vi' => 'Làm đẹp và Thẩm mỹ',
                'name_en' => 'Beauty and Salon',
                'explain' => null
            ],
            [
                'id' => 2,
                'state' => 0,
                'order_id' => 2,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'クリニック・整骨院',
                'name_vi' => 'Phòng khám và Phòng khám nắn chỉnh xương',
                'name_en' => 'Clinic and Cairopractic',
                'explain' => null
            ],
            [
                'id' => 3,
                'state' => 0,
                'order_id' => 3,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '建築業・不動産',
                'name_vi' => 'Kiến trúc và Bất động sản',
                'name_en' => 'Architect and Real Estate',
                'explain' => null
            ],
            [
                'id' => 4,
                'state' => 0,
                'order_id' => 4,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'IT関連',
                'name_vi' => 'Công nghệ',
                'name_en' => 'Technology',
                'explain' => null
            ],
            [
                'id' => 5,
                'state' => 0,
                'order_id' => 5,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '教育・スクール',
                'name_vi' => 'Giáo dục',
                'name_en' => 'Education and School',
                'explain' => null
            ],
            [
                'id' => 6,
                'state' => 0,
                'order_id' => 6,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'フード・飲食店',
                'name_vi' => 'Thực phẩm và Nhà hàng',
                'name_en' => 'Food and Restaurant',
                'explain' => null
            ],
            [
                'id' => 7,
                'state' => 0,
                'order_id' => 7,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'セラピー',
                'name_vi' => 'Liệu pháp trị liệu',
                'name_en' => 'Therapy',
                'explain' => null
            ],
            [
                'id' => 8,
                'state' => 0,
                'order_id' => 8,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'エコ・団体',
                'name_vi' => 'Môi trường sinh thái',
                'name_en' => 'Eco-Friendly',
                'explain' => null
            ],
            [
                'id' => 9,
                'state' => 0,
                'order_id' => 9,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'スポーツ・サークル',
                'name_vi' => 'Thể thao',
                'name_en' => 'Sports and Team',
                'explain' => null
            ],
            [
                'id' => 10,
                'state' => 0,
                'order_id' => 10,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '士業',
                'name_vi' => 'Chuyên nghiệp',
                'name_en' => 'Professional Occupation',
                'explain' => null
            ],
            [
                'id' => 11,
                'state' => 0,
                'order_id' => 11,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => '金融・証券',
                'name_vi' => 'Tài chính và chứng khoán',
                'name_en' => 'Finance and Securities',
                'explain' => null
            ],
            [
                'id' => 13,
                'state' => 0,
                'order_id' => 13,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'その他',
                'name_vi' => 'Khác',
                'name_en' => 'Others',
                'explain' => null
            ],
            [
                'id' => 14,
                'state' => 0,
                'order_id' => 12,
                'reg_date' => \Carbon\Carbon::now(),
                'up_date' => \Carbon\Carbon::now(),
                'reg_by' => 'nunso',
                'up_by' => null,
                'name' => 'ショップ・店舗',
                'name_vi' => 'Cửa hàng bán lẻ',
                'name_en' => 'Shop and Retailer',
                'explain' => null
            ],
        ];

        Industry::insert($data);
    }
}
