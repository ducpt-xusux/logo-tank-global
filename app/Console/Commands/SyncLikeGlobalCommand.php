<?php

namespace App\Console\Commands;

use App\Models\Favorite;
use App\Models\Logo;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncLikeGlobalCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:global';

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
        $favorites = Favorite::select('logo_id',DB::raw('COUNT(*) as total'))->groupBy('logo_id')->get();
        foreach($favorites as $key => $value){
            Logo::where('logo_id', $value->logo_id)->update(['tank_num' => $value->total]);
        }
        echo "Success";
    }
}
