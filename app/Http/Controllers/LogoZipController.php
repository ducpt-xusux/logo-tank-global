<?php

namespace App\Http\Controllers;

use App\Models\LogoZip;
use Inertia\Inertia;
use Inertia\Response;

class LogoZipController extends DefaultController
{
    protected string $_alias = 'logo-zip';

    protected string $_model = LogoZip::class;

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

    public function update(): Response
    {
        $itemId = request()->route('logo_zip') ?? request()->logo_zip;
        $item = $this->_model::findOrFail($itemId);
        $data = $this->_getDataUpdate($item);
        if (request()->hasFile('file')) {
            $file = request()->file('file');
            $logoId = $data['logo_id'] ?? $item->logo_id;
            $fileName = $logoId.'_order.zip';

            if (! \Storage::disk('public_files_img')->put($fileName, file_get_contents($file))) {
                throw new \Exception('Failed to upload file. Please check directory permissions.');
            }
            $data['url_zip'] = asset('files/'.$fileName);
        }

        unset($data['file']);

        $item->update($data);

        $this->_afterSave($item, 'update');

        return Inertia::render('admin/'.$this->_alias.'/form', [
            'item' => $item->fresh(),
        ]);
    }

    public function destroy()
    {
        $itemId = request()->logo_zip;

        $item = call_user_func([$this->_model, 'find'], $itemId);
        if (empty($item)) {
            abort(404);
        }
        $item->delete();

        return redirect()
            ->route('admin.'.$this->_alias.'.index')
            ->with('success', '項目が正常に削除されました。');
    }

    public function _validateRule($model, $action = 'store'): array
    {
        return [
            'logo_id' => 'required',
            'file' => 'required|mimes:zip,rar',
        ];
    }
}
