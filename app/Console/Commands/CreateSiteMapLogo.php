<?php

namespace App\Console\Commands;

use App\Models\Logo;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;

class CreateSiteMapLogo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:createlogo';

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
        $sitemap = App::make('sitemap');
        // dd($sitemap->addChild('url'));

        $data = [];
        // add Logo
        $logos = Logo::orderBy('logo_id', 'DESC')->get();
        foreach ($logos as $logo) {
            $d = date('Y-m', strtotime($logo->reg_date));
            $data[$d][] = $logo;

        }
        foreach ($data as $key => $value) {
            foreach ($value as $v) {
                $sitemap->add(env('APP_URL')."/vi/logo/detail/{$v->logo_id}", Carbon::now('Asia/Tokyo'), '0.7', 'daily');
                $sitemap->add(env('APP_URL')."/en/logo/detail/{$v->logo_id}", Carbon::now('Asia/Tokyo'), '0.7', 'daily');
                $sitemap->add(env('APP_URL')."/ja/logo/detail/{$v->logo_id}", Carbon::now('Asia/Tokyo'), '0.7', 'daily');
            }
            $sitemap->store('xml', 'sitemap-logo-'.$key);
        }
    }
}
