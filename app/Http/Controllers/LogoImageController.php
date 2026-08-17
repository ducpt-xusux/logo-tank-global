<?php

namespace App\Http\Controllers;

use App\Models\Logo;
use App\Models\LogoImage;
use File;
use Illuminate\Http\Request;

class LogoImageController extends Controller
{
    public function updateImages(Request $request, $logo_id)
    {
        try {
            $request->validate([
                'images' => ['required', 'array', 'max:6'],
                'images.*' => [
                    'file',
                    'mimes:png,gif',
                    'dimensions:width=400,height=400',
                ],
            ], [
                'images.required' => 'ロゴ画像を選択してください。',
                'images.array' => 'ロゴ画像の形式が正しくありません。',
                'images.max' => 'ロゴ画像は最大6枚までです。',
                'images.*.file' => 'ロゴ画像の形式が正しくありません。',
                'images.*.mimes' => 'ロゴ画像は.gifまたは.pngでアップロードしてください。',
                'images.*.dimensions' => 'ロゴ画像は400px x 400pxでアップロードしてください。',
            ]);

            $images = $request->file('images'); // Array of files indexed by sorter (1-6)
            $logo = Logo::findOrFail($logo_id);

            if (!$images || !is_array($images)) {
                return redirect()->back()->with('error', 'No images provided.');
            }

            foreach ($images as $sorter => $file) {
                if (!$file) {
                    continue;
                }

                $sorter = (int) $sorter;
                if ($sorter < 1 || $sorter > 6) {
                    continue;
                }

                $ext = $file->getClientOriginalExtension();
                // Set Name Rule: {logo_id}_{sorter}.{ext}
                // If sorter = 1, là ảnh chính ({id}.ext)
                $filename = ($sorter === 1) ? $logo_id . '.' . $ext : $logo_id . '_' . ($sorter - 1) . '.' . $ext;

                $uploadPath = public_path('logo/logo_data/');
                if (!File::isDirectory($uploadPath)) {
                    File::makeDirectory($uploadPath, 0777, true, true);
                }

                $file->move($uploadPath, $filename);
                $fullPath = '/logo/logo_data/' . $filename;

                LogoImage::updateOrCreate(
                    ['logo_id' => $logo_id, 'sort_order' => $sorter],
                    [
                        'path' => $fullPath,
                        'filename' => $file->getClientOriginalName(),
                        'is_main' => ($sorter === 1),
                    ]
                );

                if ($sorter > 1) {
                    $logo->update(['two_img' => 1]);
                }
            }

            return redirect()->back()->with('success', 'Images updated successfully.'); // return for flash message

        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Get all images for a logo.
     */
    // public function getImages($logo_id)
    // {
    //     $images = LogoImage::where('logo_id', $logo_id)->orderBy('sort_order')->get();
    //     return redirect()->back()->with("success", "Images retrieved successfully.");
    // }

    /**
     * Delete an slot of Image
     */
    public function deleteImage($logo_id, $sorter)
    {
        try {
            $image = LogoImage::where('logo_id', $logo_id)->where('sort_order', $sorter)->first();
            if ($image) {
                $filepath = public_path($image->path);
                if (File::exists($filepath)) {
                    File::delete($filepath);
                }
                $image->delete();

                return redirect()->back()->with('success', 'Image deleted successfully.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
