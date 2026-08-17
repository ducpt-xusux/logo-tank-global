<?php

namespace App\Console\Commands;

use App\Models\Favorite;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncKeepCanceledLogoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:keep-canceled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update keep canceled logo';

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
            $records = Favorite::whereRaw(DB::raw('DATE_ADD(keep_date, INTERVAL 10 DAY) < NOW()'))->get();

            foreach ($records as $item) {
                $item->update([
                    'keep_date' => null,
                    'is_keep' => Favorite::IS_NOT_KEEP
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
        }
    }
}
