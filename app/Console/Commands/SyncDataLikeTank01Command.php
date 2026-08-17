<?php

namespace App\Console\Commands;

use App\Models\Logo;
use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncDataLikeTank01Command extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:like-logo01';

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
        $status_total_like = Setting::select('value')->where('key', 'status_total_like')->first();
        if ($status_total_like->value == 1) {
            $data = Logo::select('logo_id', 'tank_num')->whereRaw('up_date >= DATE_SUB(NOW(),INTERVAL 2 DAY)')->get()->toArray();
            $bar = $this->output->createProgressBar(count($data));
            $bar->start();
            Http::post(config('common.logotank_api').'api/logo/update-like.php', [
                'data' => $data,
            ])->throw(function (Response $response, RequestException $e) {
                Log::error($e);

                return response()->json(['status' => 'FAIL'], 400);
            });
            $bar->finish();
            print_r('Success');
        } else {

            $data = Logo::select('logo_id', 'tank_num')->get()->toArray();
            $bar = $this->output->createProgressBar(count($data));
            $bar->start();
            Http::post(
                config('common.logotank_api').'api/logo/update-like.php',
                [
                    'data' => $data,
                ],
            )->throw(function (Response $response, RequestException $e) {
                Log::error($e);

            });
            $bar->finish();
            DB::table('lt_t_settings')->where('key', 'status_total_like')->update(['value' => 1]);
            print_r('Success');
        }
    }
}
