<?php

namespace App\Console\Commands;

use App\Models\Keyword;
use App\Models\KeywordLanguage;
use App\Models\Logo;
use App\Models\LogoAlphabet;
use App\Models\LogoKeyword;
use App\Models\LogoLanguage;
use App\Models\Recommend;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class SyncLogoDataDailyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:logo-daily';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawling, insert and update logo at 24 PM every day';

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
     */
    public function handle(): int
    {
        try {
            $endpoint = env('LOGOTANK_ENDPOINT', '');
            $client = new \GuzzleHttp\Client;
            $response = $client->get($endpoint.'api/auth', [
                'query' => [
                    'username' => 'nunso',
                    'password' => 'gama12345',
                ],
            ]);
            $limit = 1000;
            $page = 1;
            $lastPage = 10000;
            $auth = @json_decode($response->getBody());
            $token = $auth->token;
            $maxDate = Logo::query()->max('reg_date', 'up_date');
            $logo_id_max = Logo::query()->max('logo_id');
            $totalRecord = 0;
            while ($lastPage > $page) {
                $response = @json_decode($client->get($endpoint.'api/get-logos', [
                    'headers' => [
                        'Authorization' => 'Bearer '.$token,
                    ],
                    'query' => [
                        'limit' => $limit,
                        'page' => $page,
                        'field_fill' => 'all',
                        'start_date' => $maxDate,
                    ],
                ])->getBody(), true);
                $totalRecord = $response['total'];
                if (isset($response['data']) && $response['total'] > 0) {
                    $this->info("\nPage $page:");
                    $bar = $this->output->createProgressBar($limit);
                    $bar->start();
                    DB::beginTransaction();
                    foreach ($response['data'] as $item) {
                        if ($this->checkLogoImageExist($item['logo_id'])) {
                            for ($i = 1; $i < 2; $i++) {
                                $this->getLogoImage($item['logo_id'], $i);
                            }
                        }
                        $this->getLogoImage($item['logo_id']);

                        if ($item['logo_id'] > $logo_id_max) {
                            $logo = Logo::updateOrCreate(['logo_id' => $item['logo_id'] ?? 0], [
                                'logo_id' => $item['logo_id'] ?? 0,
                                'state' => $item['state'] ?? 0,
                                'reg_date' => $item['reg_date'] != '0000-00-00 00:00:00' ? $item['reg_date'] : null,
                                'up_date' => $item['up_date'] != '0000-00-00 00:00:00' ? $item['up_date'] : ($item['reg_date'] != '0000-00-00 00:00:00' ? $item['reg_date'] : null),
                                'reg_by' => $item['reg_by'] ?? null,
                                'up_by' => $item['up_by'] ?? null,
                                'logo_name' => $item['logo_name'] ?? null,
                                'logo_explain' => $item['logo_explain'] ?? null,
                                'logo_d_id' => $item['logo_d_id'] ?? null,
                                'reg_user' => $item['reg_user'] ?? null,
                            ]);
                            LogoLanguage::updateOrCreate(['logo_id' => $item['logo_id'] ?? 0], [
                                'create_by' => $item['reg_user'] ?? null,
                                'vi' => replace_language(ucfirst(_translate($item['logo_name'])[1]), 'vi') ?? null,
                                'en' => replace_language(ucfirst(_translate($item['logo_name'])[0]), 'en') ?? null,
                                'ja' => $item['logo_name'] ?? null,
                            ]);

                            if (isset($item[''])) {
                                foreach ($item['alphabets'] as $value) {
                                    LogoAlphabet::updateOrCreate([
                                        'logo_id' => $value['logo_id'] ?? null,
                                        'alphabet_id' => $value['alphabet_id'] ?? null,
                                    ]);
                                }
                            }

                            if (isset($item['colors'])) {
                                $logo->colors()->sync(array_column($item['colors'], 'color_id'));
                            }

                            if (isset($item['industries'])) {
                                $logo->industries()->sync(array_column($item['industries'], 'industry_id'));
                            }

                            if (isset($item['keywords'])) {
                                foreach ($item['keywords'] as $value) {
                                    $record = Keyword::updateOrCreate(
                                        ['id' => $value['keyword_id'] ?? 0],
                                        [
                                            'id' => $value['keyword_id'],
                                            'keyword' => $value['keyword'],
                                        ]
                                    );
                                    KeywordLanguage::updateOrCreate(['keyword_id' => $record->id ?? 0], [
                                        'keyword_id' => $record->id,
                                        'vi' => replace_language(ucfirst(_translate($value['keyword'])[1]), 'vi') ?? null,
                                        'en' => replace_language(ucfirst(_translate($value['keyword'])[0]), 'en') ?? null,
                                        'ja' => $value['keyword'] ?? null,
                                    ]);
                                    LogoKeyword::updateOrCreate(['logo_id' => $value['logo_id'] ?? 0, 'keyword_id' => $value['keyword_id'] ?? 0], [
                                        'logo_id' => $value['logo_id'] ?? null,
                                        'keyword_id' => $value['keyword_id'] ?? $record->id,
                                        'type' => $value['type'] ?? 2,
                                    ]);
                                }
                            }

                            if (isset($item['tastes'])) {
                                $logo->tastes()->sync(array_column($item['tastes'], 'taste_id'));
                            }
                            if (isset($item['recommend'])) {
                                Recommend::create($item['recommend']);
                            }
                            $bar->advance();
                        }
                    }
                    DB::commit();

                    $page++;
                    $lastPage = $response['last_page'];
                    $bar->finish();
                } else {
                    $lastPage = $page;
                }
            }
            Log::info(__METHOD__." => Updated $totalRecord records");
        } catch (\Exception|GuzzleException $e) {
            Log::error('ERROR  '.__METHOD__.' '.$e);
            DB::rollBack();
        }
        $this->info('Crawling, insert and update logo complete.');

        return 0;
    }

    public function syncLogo($url)
    {
        if (getimagesize($url)) {
            $imageData = file_get_contents($url);
            if ($imageData !== false) {
                $fileName = basename($url);
                $savePath = public_path('logo/logo_data/').$fileName;
                file_put_contents($savePath, $imageData);
            } else {
                echo 'Failed to fetch the image data from the URL.';
            }
        }
    }

    public function moveImageLogo($url)
    {
        File::delete($url);
    }

    public function checkFileExist($url): bool
    {
        $headers = get_headers($url);

        return (bool) stripos($headers[0], '200 OK');
    }

    public function getLogoImage($logoId, $index = 0)
    {
        $extensions = ['gif', 'png'];

        foreach ($extensions as $extension) {
            $url = $index == 0 ?
                env('LOGOTANK_API').'logo_data/'.$logoId.'.'.$extension :
                env('LOGOTANK_API').'logo_data/'.$logoId.'_'.$index.'.'.$extension;
            $path = $index == 0 ?
                public_path('logo/logo_data/').$logoId.'.'.$extension :
                public_path('logo/logo_data/').$logoId.'_'.$index.'.'.$extension;

            if (file_exists($path)) {
                $this->moveImageLogo($path);
            }
            if ($this->checkFileExist($url)) {
                $this->syncLogo($url);
            }
        }
    }

    public function checkLogoImageExist($logoId): bool
    {
        $extensions = ['gif', 'png'];

        foreach ($extensions as $extension) {
            $path = public_path('logo/logo_data/').$logoId.'.'.$extension;
            if (file_exists($path)) {
                return true;
            }
        }

        return false;
    }
}
