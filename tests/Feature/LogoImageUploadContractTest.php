<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LogoImageUploadContractTest extends TestCase
{
    #[Test]
    public function admin_logo_cropper_exports_400_square_images_without_initial_zoom(): void
    {
        $adminLogoDetail = file_get_contents(resource_path('js/pages/admin/logodetail.tsx'));
        $logoCropper = file_get_contents(resource_path('js/components/logo-cropper.tsx'));

        $this->assertStringContainsString('aspectRatio={1}', $adminLogoDetail);
        $this->assertStringContainsString('autoCropArea={1}', $adminLogoDetail);
        $this->assertStringContainsString('cropWidth={400}', $adminLogoDetail);
        $this->assertStringContainsString('cropHeight={400}', $adminLogoDetail);
        $this->assertStringContainsString('width: props.cropWidth ?? 400', $logoCropper);
        $this->assertStringContainsString('height: props.cropHeight ?? 400', $logoCropper);
    }

    #[Test]
    public function logo_image_uploads_are_validated_as_400_square_png_or_gif_files(): void
    {
        $controller = file_get_contents(app_path('Http/Controllers/LogoImageController.php'));

        $this->assertStringContainsString("'images' => ['required', 'array', 'max:6']", $controller);
        $this->assertStringContainsString("'mimes:png,gif'", $controller);
        $this->assertStringContainsString("'dimensions:width=400,height=400'", $controller);
        $this->assertStringContainsString('ロゴ画像は400px x 400pxでアップロードしてください。', $controller);
    }

    #[Test]
    public function public_logo_detail_does_not_render_logo_images_larger_than_their_intrinsic_size(): void
    {
        $imageSlider = file_get_contents(resource_path('js/components/public/image-slider.tsx'));
        $publicLogoDetail = file_get_contents(resource_path('js/pages/public/public-logo-detail.tsx'));

        $this->assertStringContainsString('imageClassName?: string', $imageSlider);
        $this->assertStringNotContainsString('aspect-651/464', $publicLogoDetail);
        $this->assertStringContainsString('aspect-square w-full max-w-[400px]', $publicLogoDetail);
        $this->assertStringContainsString('imageClassName="max-h-[400px] max-w-[400px]"', $publicLogoDetail);
    }
}
