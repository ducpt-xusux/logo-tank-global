<?php

namespace App\Console\Commands;

use App\Models\Keyword;
use App\Models\KeywordLanguage;
use Illuminate\Support\Facades\Log;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncKeyWordLanguageGlobal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:keyword_language';

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
        
        try{
            DB::beginTransaction();
            $keywordLanguages = Keyword::orderBy('id','DESC')->get();
            $chunkSize = 500;
            collect($keywordLanguages)->chunk($chunkSize)->each(function ($chunk){
                foreach ($chunk as $value) {
                    KeywordLanguage::updateOrCreate(['keyword_id' => $value->id ?? 0], [
                                            'vi' => ucfirst(_translate($value->keyword)[1]) ?? null,
                                            'en' => ucfirst(_translate($value->keyword)[0]) ?? null,
                                            'ja' => $value->keyword ?? null,
                                        ]);   
                }
            });
            DB::commit();
       }catch (\Exception $e) {
            Log::error('ERROR  '. __METHOD__ . " " .$e);
            DB::rollBack();
       }
    }
}
