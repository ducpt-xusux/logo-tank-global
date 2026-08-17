<?php

namespace App\Helper;

use Illuminate\Support\Facades\Log;

class Common
{
    /**
     * Using log error to laravel.log
     */
    public static function logError(string $message): void
    {
        $backtrace = debug_backtrace();
        if (!empty($backtrace[0]) && is_array($backtrace[0])) {
            $fileinfo = $backtrace[0]['file'] . ':' . $backtrace[0]['line'];
            Log::error($fileinfo . $message);
        }
    }

    /**
     * Using log info to laravel.log
     */
    public static function logInfo(string $message): void
    {
        $backtrace = debug_backtrace();
        if (!empty($backtrace[0]) && is_array($backtrace[0])) {
            $fileinfo = $backtrace[0]['file'] . ':' . $backtrace[0]['line'];
            Log::info($fileinfo . $message);
        }
    }

    public static function generateRandomString($length = 10): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    public static function getLogoSrc($logoId): string
    {
        $v = '?v=' . time();
        $paths = [
            '/logo/logo_data/' . $logoId . '.gif',
            '/logo/logo_data/' . $logoId . '.png',
            '/logo/logo_data_n/' . $logoId . '.png',
            '/logo/logo_data_n/' . $logoId . '.gif',
        ];

        foreach ($paths as $path) {
            if (file_exists(public_path($path))) {
                return $path . $v;
            }
        }

        return '/logo_data/no.gif';
    }

    public static function getAlphabet($id)
    {
        $alphabets = config('common.alphabets');
        if (array_key_exists($id, $alphabets)) {
            return $alphabets[$id];
        }

        return '';
    }

    public static function dataUserCreate($data, $flagUpdate = false)
    {
        $dataCreate = [
            'company' => $data['company'],
            'name1' => $data['name1'],
            'name2' => $data['name2'],
            'name3' => $data['name3'],
            'name4' => $data['name4'],
            'zip' => $data['zip'],
            'pref' => $data['pref'],
            'address1' => $data['address1'],
            'address2' => $data['address2'],
            'address3' => $data['address3'],
            'tel' => $data['tel'],
            'fax' => $data['fax'],
            'past_work' => $data['past_work'] ?? 0,
            'email' => $data['email'],
        ];
        if (!($flagUpdate && !$data['password'])) {
            $dataCreate['password'] = hash('md5', $data['password']);
        }

        return $dataCreate;
    }

    public static function isAdmin(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public static function isDesigner(): bool
    {
        return auth()->user()->role === 'designer';
    }
}
