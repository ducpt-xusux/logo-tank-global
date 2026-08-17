<?php

use Google\Cloud\Translate\V2\TranslateClient;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

function checkCurrency($currency)
{
    if ($currency === 'ja') {
        return '¥';
    } elseif ($currency === 'en') {
        return 'USD';
    } else {
        return 'VND';
    }
}

function updateStateLogoNet($token, $logo_id, $state)
{
    $response = Http::withToken($token)
        ->post(config('common.logotank_api').'api/logo/update.php', [
            'logo_id' => $logo_id,
            'state' => $state,
        ])->throw(function (Response $response, RequestException $e) {
            Log::error($e);

            return response()->json(['status' => 'FAIL'], self::BAD_REQUEST);
        });
    $result = $response->json();

    return $result;
}

function _translate($text)
{
    // Replace with the path to your Service Account JSON file
    $keyFilePath = env('GOOGLE_APPLICATION_CREDENTIALS');

    // Initialize the Google Translate client
    $translate = new TranslateClient([
        'keyFilePath' => $keyFilePath,
    ]);

    // Translate the Japanese text to English
    $resultEn = $translate->translate($text, [
        'target' => 'en', // Translate to English
    ]);

    // Translate the Japanese text to Vietnamese
    $resultVi = $translate->translate($text, [
        'target' => 'vi', // Translate to Vietnamese
    ]);

    $translatedTextEn = $resultEn['text'];
    $translatedTextVi = $resultVi['text'];

    return [$translatedTextEn, $translatedTextVi];
}

function replace_language($text, $type)
{
    if ($type == 'vi') {
        return str_replace('&quot;', '', $text);
    }
    if ($type == 'en') {
        return str_replace('&quot;', '', $text);
    }
}
function checkExitImage($logo_id)
{
    $file_dir = public_path('/logo/logo_data/'.$logo_id.'_1.gif');
    $file_dir_png = public_path('/logo/logo_data/'.$logo_id.'_1.png');
    switch (true) {
        case file_exists($file_dir_png):
            $output = env('APP_URL').'/logo/logo_data/'.$logo_id.'_1.png';
            break;
        case file_exists($file_dir):
            $output = env('APP_URL').'/logo/logo_data/'.$logo_id.'_1.gif';
            break;
        default:
            $output = '';
    }

    return $output;
}
