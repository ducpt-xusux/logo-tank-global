<?php

namespace Database\Seeders;

use App\Models\Log;
use App\Models\Logo;
use App\Models\User;
use Illuminate\Database\Seeder;

class LogSeeder extends Seeder
{
    /**
     * Seed the logs table.
     *
     * @return void
     */
    public function run()
    {
        $logos = Logo::all();
        $users = User::all();

        if ($logos->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Logos or Users not found. Please run LogoSeeder and UserSeeder first.');

            // DEBUG: Hiển thị thông tin chi tiết
            $this->command->info('Logos count: '.$logos->count());
            $this->command->info('Users count: '.$users->count());

            return;
        }

        $logData = [
            'Color changed to red',
            'Font size increased to 24px',
            'Background modified',
            'Text element added',
            'Design updated',
            'Color palette adjusted',
            'Logo rotated 90 degrees',
            'Logo dimensions modified',
            'Opacity adjusted to 80%',
            'New design layer created',
            'Shadow effect added',
            'Border style applied',
            'Elements aligned to center',
            'Logo position adjusted',
            'Logo scale changed to 150%',
            'Gradient fill added',
            'Pattern texture applied',
            'Shadow effect removed',
            'Blur effect 5px applied',
            'Stroke width set to 2px',
            'Fill color updated',
            'Export format changed to PNG',
            'Resolution set to 300dpi',
            'Watermark applied',
            'Sepia filter added',
            'Icon element replaced',
            'Bold and italic applied',
            'Letter spacing modified',
            'Fade animation applied',
            'Design version 2.0 saved',
        ];

        foreach ($logData as $index => $value) {
            try {
                Log::create([
                    'logo_id' => $logos->random()->logo_id, // Đảm bảo random() không null
                    'created_by' => $users->random()->id,
                    'value' => $value,
                ]);
            } catch (\Exception $e) {
                $this->command->error("Error creating log at index {$index}: ".$e->getMessage());

                // DEBUG: Hiển thị giá trị đang bị lỗi
                $this->command->info('Logo ID: '.($logos->random() ? $logos->random()->id : 'NULL'));
                $this->command->info('User ID: '.($users->random() ? $users->random()->id : 'NULL'));

                continue;
            }
        }

        $this->command->info('LogSeeder: '.count($logData).' log records created successfully!');
    }
}
