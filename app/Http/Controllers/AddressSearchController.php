<?php

namespace App\Http\Controllers;

use App\Models\AddressSearch;
use Inertia\Inertia;
use Inertia\Response;

class AddressSearchController extends DefaultController
{
    protected string $_alias = 'address-search';

    protected string $_model = AddressSearch::class;

    public function show(): Response
    {

        $itemId = request()->logo_zip;
        $item = call_user_func([$this->_model, 'find'], $itemId);
        if (empty($item)) {
            abort(404);
        }

        return Inertia::render('admin/'.$this->_alias.'/form', [
            'item' => $item,
        ]);
    }
}
