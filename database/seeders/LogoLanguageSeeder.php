<?php

namespace Database\Seeders;

use App\Models\Logo;
use App\Models\LogoLanguage;
use Illuminate\Database\Seeder;

class LogoLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Logo::query()
            ->select(['logo_id', 'logo_name'])
            ->chunkById(100, function ($logos): void {
                foreach ($logos as $logo) {
                    LogoLanguage::updateOrCreate(
                        ['logo_id' => $logo->logo_id],
                        $this->languageAttributesForLogo($logo),
                    );
                }
            }, 'logo_id');
    }

    /**
     * @return array{create_by: string, ja: ?string, vi: ?string, en: ?string}
     */
    public function languageAttributesForLogo(Logo $logo): array
    {
        return [
            'create_by' => 'Seeder',
            'ja' => $logo->logo_name,
            'vi' => $logo->logo_name,
            'en' => $logo->logo_name,
        ];
    }
}
