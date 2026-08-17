<?php

namespace App\Console\Commands;

use App\Models\Logo;
use Illuminate\Console\Command;

class SyncDataLikeTankCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:like-logo';

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
        $endpoint = env('LOGOTANK_ENDPOINT', '');
        $client = new \GuzzleHttp\Client;
        $response = [json_decode($client->get($endpoint.'api/logo/get-like-logo.php')->getBody(), true)];
        foreach ($response as $key => $value) {
            $bar = $this->output->createProgressBar(count($value['data']));
            $bar->start();
            foreach ($value['data'] as $k => $v) {
                Logo::where('logo_id', $v['logo_id'])->update(['tank_num_logo_tank_jp' => (int) $v['tank_num']]);
                $bar->advance();
            }
            $bar->finish();
        }
    }
}
