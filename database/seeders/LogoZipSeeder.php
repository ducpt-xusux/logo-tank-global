<?php

namespace Database\Seeders;

use App\Models\LogoZip;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LogoZipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete old data if it exists
        DB::table('lt_t_logo_zip')->truncate();

        $logoIds = DB::table('lt_t_logo')->pluck('logo_id')->toArray();

        // Check if there is no logo
        if (empty($logoIds)) {
            $this->command->warn(
                'No records found in lt_t_logo table. Please run LogoSeeder first!',
            );

            return;
        }

        $logoZips = [];

        // Make zip data for each logo
        foreach ($logoIds as $logoId) {
            $logoZips[] = [
                'logo_id' => $logoId,
                'url_zip' => "https://storage.example.com/logos/logo-{$logoId}.zip",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert data in batch to optimize performance
        foreach (array_chunk($logoZips, 500) as $chunk) {
            LogoZip::insert($chunk);
        }

        $this->command->info(
            'LogoZip seeder completed! Created '.
            count($logoZips).
            'records.',
        );
    }
}
