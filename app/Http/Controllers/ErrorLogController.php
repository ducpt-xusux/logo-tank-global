<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ErrorLogController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        Log::channel('js')->error('JS Error', $request->all());

        return response()->json(['status' => 'logged']);
    }
}
