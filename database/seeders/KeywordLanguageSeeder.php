<?php

namespace Database\Seeders;

use App\Models\KeywordLanguage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KeywordLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Truncate existing data
        DB::table('lt_t_keyword_languages')->truncate();

        $data = [
            [
                'keyword_id' => 1,
                'vi' => 'Công nghệ',
                'en' => 'Technology',
                'ja' => 'テクノロジー',
            ],
            [
                'keyword_id' => 2,
                'vi' => 'Giáo dục',
                'en' => 'Education',
                'ja' => '教育',
            ],
            [
                'keyword_id' => 3,
                'vi' => 'Y tế',
                'en' => 'Medical',
                'ja' => '医療',
            ],
            [
                'keyword_id' => 4,
                'vi' => 'Bất động sản',
                'en' => 'Real Estate',
                'ja' => '不動産',
            ],
            [
                'keyword_id' => 5,
                'vi' => 'Thời trang',
                'en' => 'Fashion',
                'ja' => 'ファッション',
            ],
            [
                'keyword_id' => 6,
                'vi' => 'Ẩm thực',
                'en' => 'Food & Drink',
                'ja' => '飲食',
            ],
            [
                'keyword_id' => 7,
                'vi' => 'Du lịch',
                'en' => 'Travel',
                'ja' => '旅行',
            ],
            [
                'keyword_id' => 8,
                'vi' => 'Tài chính',
                'en' => 'Finance',
                'ja' => '金融',
            ],
            [
                'keyword_id' => 9,
                'vi' => 'Giải trí',
                'en' => 'Entertainment',
                'ja' => 'エンターテインメント',
            ],
            [
                'keyword_id' => 10,
                'vi' => 'Thể thao',
                'en' => 'Sports',
                'ja' => 'スポーツ',
            ],
        ];

        // Ensure we handle timestamp maintenance if the model expects it,
        // though insert() implies raw query usually, using Model::insert is better if timestamps exist
        // The migration has $table->timestamps();

        $now = now();
        foreach ($data as &$item) {
            $item['created_at'] = $now;
            $item['updated_at'] = $now;
        }

        KeywordLanguage::insert($data);
    }
}
