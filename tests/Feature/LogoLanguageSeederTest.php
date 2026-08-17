<?php

use App\Models\Logo;
use Database\Seeders\LogoLanguageSeeder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LogoLanguageSeederTest extends TestCase
{
    #[Test]
    public function it_builds_language_attributes_from_the_existing_logo_name(): void
    {
        $logo = new Logo([
            'logo_name' => 'First Logo',
        ]);

        $attributes = (new LogoLanguageSeeder)->languageAttributesForLogo($logo);

        $this->assertSame([
            'create_by' => 'Seeder',
            'ja' => 'First Logo',
            'vi' => 'First Logo',
            'en' => 'First Logo',
        ], $attributes);
    }

    #[Test]
    public function it_defines_typed_relationships_between_logos_and_logo_languages(): void
    {
        $this->assertSame(
            HasOne::class,
            (string) (new \ReflectionMethod(Logo::class, 'logoLanguage'))->getReturnType(),
        );
        $this->assertSame(
            BelongsTo::class,
            (string) (new \ReflectionMethod(App\Models\LogoLanguage::class, 'logo'))->getReturnType(),
        );
    }
}
