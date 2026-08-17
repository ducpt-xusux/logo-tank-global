<?php

namespace App\Console\Commands;

use App;
use App\Models\Logo;
use Carbon\Carbon;
use File;
use Illuminate\Console\Command;

class CreateSiteMap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:create';

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
        // add home pages mặc định
        $sitemap->add(env('APP_URL'), Carbon::now('Asia/Tokyo'), '1.0', 'daily');

        // add search
        $sitemap->add(env('APP_URL').'/vi/search', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/search', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/search', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add about
        $sitemap->add(env('APP_URL').'/vi/about', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/en/about', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/ja/about', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');

        // add privacy
        $sitemap->add(env('APP_URL').'/vi/privacy', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/en/privacy', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/ja/privacy', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');

        // add cookie-policy
        $sitemap->add(env('APP_URL').'/vi/cookie-policy', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/en/cookie-policy', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/ja/cookie-policy', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');

        // add terms-use
        $sitemap->add(env('APP_URL').'/vi/terms-use', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/en/terms-use', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/ja/terms-use', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');

        // add terms-use
        $sitemap->add(env('APP_URL').'/vi/logo-mark-req', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/en/logo-mark-req', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');
        $sitemap->add(env('APP_URL').'/ja/logo-mark-req', Carbon::now('Asia/Tokyo'), '0.7', 'weekly');

        // add contact
        $sitemap->add(env('APP_URL').'/vi/contact', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/contact', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/contact', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add card
        $sitemap->add(env('APP_URL').'/vi/my-page/cart', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/my-page/cart', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/my-page/cart', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add card paym/ent
        $sitemap->add(env('APP_URL').'/vi/my-page/cart/paym/ent', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/my-page/cart/paym/ent', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/my-page/cart/paym/ent', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add card complete
        $sitemap->add(env('APP_URL').'/vi/my-page/paym/ent-complete', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/my-page/paym/ent-complete', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/my-page/paym/ent-complete', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add profile
        $sitemap->add(env('APP_URL').'/vi/my-page/profile', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/my-page/profile', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/my-page/profile', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add order-history
        $sitemap->add(env('APP_URL').'/vi/my-page/order-history', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/my-page/order-history', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/my-page/order-history', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        // add my-logo
        $sitemap->add(env('APP_URL').'/vi/my-page/my-logo', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/en/my-page/my-logo', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
        $sitemap->add(env('APP_URL').'/ja/my-page/my-logo', Carbon::now('Asia/Tokyo'), '0.7', 'daily');

        $logos = Logo::selectRaw("CONCAT(YEAR(reg_date),'-',LPAD(MONTH(reg_date), 2, '0')) as date")->groupByRaw('YEAR(reg_date), MONTH(reg_date)')->orderBy('logo_id', 'DESC')->get();

        foreach ($logos as $logo) {
            if (! empty($logo->date)) {
                $sitemap->add(env('APP_URL').'/sitemap-logo-'.$logo->date.'.xml', Carbon::now('Asia/Tokyo'), '0.7', 'daily');
            }
        }

        // lưu file và phân quyền
        $sitemap->store('xml', 'sitemap');
    }
}
