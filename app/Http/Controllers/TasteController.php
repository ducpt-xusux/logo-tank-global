<?php

namespace App\Http\Controllers;

class TasteController extends DefaultController
{
    protected function _validateRule($model, $action = 'store'): array
    {
        return [
            'name' => 'required',
            'name_vi' => 'nullable',
            'name_en' => 'nullable',
            'state' => 'nullable|numeric',
            'explain' => 'nullable',
        ];
    }
}
