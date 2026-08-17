<?php

namespace App\Http\Controllers;

use App\Models\KeywordLanguage;
use Illuminate\Database\Eloquent\Builder;

class KeywordController extends DefaultController
{
    protected function _extendIndexQuery(Builder $query): array
    {
        $query->with(['keywordLanguage']);

        return [$query, []];
    }

    public function show(): \Inertia\Response
    {
        $itemId = request()->{$this->_alias};
        $item = \App\Models\Keyword::with('keywordLanguage')->find($itemId);
        if (empty($item)) {
            abort(404);
        }

        return \Inertia\Inertia::render('admin/'.$this->_alias.'/form', [
            'item' => $item,
        ]);
    }

    protected function _validateRule($model, $action = 'store'): array
    {
        return [
            'name_ja' => 'required',
            'name_vi' => 'nullable',
            'name_en' => 'nullable',
            'state' => 'nullable|numeric',
            'explain' => 'nullable',
        ];
    }

    protected function _beforeSave($data, $action = 'store')
    {
        return [
            'keyword' => $data['name_ja'] ?? null,
        ];
    }

    protected function _afterSave($item, $action = 'store')
    {
        KeywordLanguage::updateOrCreate(
            ['keyword_id' => $item->id],
            [
                'ja' => request()->input('name_ja'),
                'vi' => request()->input('name_vi'),
                'en' => request()->input('name_en'),
            ],
        );
    }
}
