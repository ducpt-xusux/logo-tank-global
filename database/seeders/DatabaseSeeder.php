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
            KeywordSeeder::class,
            KeywordLanguageSeeder::class,
            AddressSearchSeeder::class,
            DesignerDataSeeder::class,
            LogoSeeder::class,
            LogoLanguageSeeder::class,
            LogoZipSeeder::class,
            PackageSeeder::class,
            PackageProductCodeSeeder::class,
            OrderSeeder::class,
            OrderLogoSeeder::class,
            SettingSeeder::class,
            LogSeeder::class,
        ]);
    }
}
