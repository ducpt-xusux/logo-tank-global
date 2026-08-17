<?php

namespace App\Console\Commands;

use App\Models\LogoLanguage;
use Illuminate\Console\Command;
use Revolution\Google\Sheets\Facades\Sheets;

class SyncDataSheetCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:data-sheet';

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
        $spreadsheetID = env('SPREADSHEET_ID', '');
        if ($spreadsheetID) {
            $sheets = Sheets::spreadsheet($spreadsheetID)->sheet('ロゴ説明文タイトル')->get();
            $header = [
                'logo_no',
                'LINK',
                '記入者',
                'JP',
                'EN',
                'VN'
            ];

            $data = Sheets::collection($header, $sheets);
            $bar = $this->output->createProgressBar($data->count());
            $bar->start();
            foreach ($data as $key => $value) {
                if ($key) {
                    LogoLanguage::updateOrCreate(['logo_id' => $value['logo_no']],[
                        'logo_id' => $value['logo_no'] ?? '',
                        'create_by' => $value['記入者'] ?? '',
                        'vi' => $value['VN'] ?? '',
                        'en' => $value['EN'] ?? '',
                        'ja' => $value['JP'] ?? '',
                    ]);
                    $bar->advance();
                }
            }

            $bar->finish();
        }
    }
}
