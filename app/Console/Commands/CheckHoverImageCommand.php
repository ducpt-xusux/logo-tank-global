<?php

namespace App\Console\Commands;

use App\Models\Logo;
use Illuminate\Console\Command;

class CheckHoverImageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:hover';

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
        Logo::chunk(5000, function ($logos) {
            foreach ($logos as $logo) {
                $file_dir = public_path('/logo/logo_data/'.$logo->logo_id.'_1.gif');
                $file_dir_png = public_path('/logo/logo_data/'.$logo->logo_id.'_1.png');
                switch (true) {
                    case file_exists($file_dir_png):
                        $logo->two_img = 1;
                        $logo->save();
                    case file_exists($file_dir):
                        $logo->two_img = 1;
                        $logo->save();
                        break;
                    default:
                        $logo->two_img = 0;
                        $logo->save();
                }
            }
        }, 'logo_id');
    }
}
