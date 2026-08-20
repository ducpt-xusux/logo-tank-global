<?php

namespace Tests\Unit;

use Database\Seeders\AddressSearchSeeder;
use Database\Seeders\ColorSeeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DesignerDataSeeder;
use Database\Seeders\DesignerSeeder;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\KeywordLanguageSeeder;
use Database\Seeders\KeywordSeeder;
use Database\Seeders\LogoLanguageSeeder;
use Database\Seeders\LogoSeeder;
use Database\Seeders\LogoZipSeeder;
use Database\Seeders\LogSeeder;
use Database\Seeders\OrderLogoSeeder;
use Database\Seeders\OrderSeeder;
use Database\Seeders\PackageProductCodeSeeder;
use Database\Seeders\PackageSeeder;
use Database\Seeders\SettingSeeder;
use Database\Seeders\TasteSeeder;
use Database\Seeders\UserSeeder;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    public function test_it_runs_every_application_seeder_in_dependency_order(): void
    {
        $databaseSeeder = new class extends DatabaseSeeder
        {
            /** @var array<int, class-string> */
            public array $seeders = [];

            public function call($class, $silent = false, array $parameters = [])
            {
                $this->seeders = is_array($class) ? $class : [$class];

                return $this;
            }
        };

        $databaseSeeder->run();

        $this->assertSame([
            UserSeeder::class,
            DesignerSeeder::class,
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
        ], $databaseSeeder->seeders);
    }
}
