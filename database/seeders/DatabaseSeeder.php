<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ColorSeeder::class,
            IndustrySeeder::class,
            TasteSeeder::class,
            LogoLanguageSeeder::class,
            DesignerDataSeeder::class,
            SettingSeeder::class,
            LogSeeder::class,
        ]);
    }
}
