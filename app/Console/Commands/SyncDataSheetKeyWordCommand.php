<?php

namespace App\Console\Commands;

use App\Models\KeywordLanguage;
use Illuminate\Console\Command;
use Revolution\Google\Sheets\Facades\Sheets;

class SyncDataSheetKeyWordCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:keyword';

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
            $getrange = 'A:E';
            $sheets = Sheets::spreadsheet($spreadsheetID)->sheet('keyword')->range($getrange)->get();
            $header = [
                'keyword_id',
                'keyword',
                'vi',
                'en',
                'ja',
            ];
            $data = Sheets::collection($header, $sheets);
            $bar = $this->output->createProgressBar($data->count());
            $bar->start();
            foreach ($data as $key => $value) {
                if ($key) {
                    if (KeywordLanguage::where('keyword_id', $value['keyword_id'])->first()) {
                        KeywordLanguage::where('keyword_id', $value['keyword_id'])->update([
                            'vi' => $value['vi'] ?? '',
                            'en' => $value['en'] ?? '',
                            'ja' => $value['ja'] ?? '',
                        ]);
                    } else {
                        KeywordLanguage::create([
                            'keyword_id' => $value['keyword_id'],
                            'vi' => $value['vi'] ?? '',
                            'en' => $value['en'] ?? '',
                            'ja' => $value['ja'] ?? '',
                        ]);
                    }
                    $bar->advance();
                }
            }

            $bar->finish();
        }
    }
}
