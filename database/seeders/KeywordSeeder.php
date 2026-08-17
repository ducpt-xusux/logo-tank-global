<?php

namespace Database\Seeders;

use App\Models\Keyword;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KeywordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete old data if it exists
        DB::table('lt_t_keywords')->truncate();

        $faker = \Faker\Factory::create();
        $rows = [];
        $count = 30;

        for ($i = 0; $i < $count; $i++) {
            $rows[] = [
                'keyword' => $faker->unique()->words(2, true),
                'reg_date' => now(),
                'update_date' => now(),
            ];
        }

        // Insert data in batch to optimize performance
        foreach (array_chunk($rows, 500) as $chunk) {
            Keyword::insert($chunk);
        }

        $this->command->info(
            'KeywordSeeder completed! Created '.count($rows).' records.',
        );
    }
}
