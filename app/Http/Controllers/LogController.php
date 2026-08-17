<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;

class LogController extends DefaultController
{
    protected array $_searchFields = [
        'users.name',
        'logs.value',
        'lt_t_logo.logo_name',
    ];

    protected function _extendIndexQuery(Builder $query): array
    {
        $keyword = request()->query('keyword');

        $query
            ->leftJoin('users', 'logs.created_by', '=', 'users.id')
            ->leftJoin('lt_t_logo', 'logs.logo_id', '=', 'lt_t_logo.logo_id')
            ->select(
                'logs.*',
                'users.name as user_name',
                'lt_t_logo.logo_name as logo_name',
            );

        if ($keyword) {
            $query->where(function (Builder $q) use ($keyword) {
                foreach ($this->_searchFields as $searchField) {
                    $q->orWhere($searchField, 'like', "%{$keyword}%");
                }
            });
        }

        return [$query, ['keyword' => $keyword]];
    }
}
