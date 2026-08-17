<?php

namespace App\Console\Commands;

use App\Models\Logo;
use App\Models\LogoLanguage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncTitleLanguageGlobal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:title_language';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            DB::beginTransaction();
            $logoLanguage = LogoLanguage::orderBy('logo_id', 'DESC')->first();
            $logos = Logo::where('logo_id', '>', $logoLanguage->logo_id)->get();
            foreach ($logos as $key => $value) {
                LogoLanguage::updateOrCreate(['logo_id' => $value['logo_id'] ?? 0], [
                    'create_by' => $value['reg_user'] ?? null,
                    'vi' => ucfirst(_translate($value['logo_name'])[1]) ?? null,
                    'en' => ucfirst(_translate($value['logo_name'])[0]) ?? null,
                    'ja' => $value['logo_name'] ?? null,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            Log::error('ERROR  '.__METHOD__.' '.$e);
            DB::rollBack();
        }
    }
}
