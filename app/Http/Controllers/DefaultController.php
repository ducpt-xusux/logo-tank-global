<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DefaultController extends Controller
{
    protected string $_alias = '';

    protected string $_model;

    protected string $_resource;

    /**
     * @var string[]
     */
    protected array $_searchFields = ['name'];

    /**
     * @throws Exception
     */
    public function __construct()
    {
        // Get Alias from controller name
        $className = get_called_class();
        $controllerClassName = Arr::last(explode('\\', $className));
        $name = str($controllerClassName)->replace('Controller', '');
        if (empty($this->_alias)) {
            $this->_alias = str($name)->slug();
        }
        // Set Model Name use Str::studly
        if (empty($this->_model)) {
            $modelClass = 'App\\Models\\'.Str::studly($this->_alias);
            if (! class_exists($modelClass)) {
                throw new Exception('Model Class not Found.');
            }
            $this->_model = $modelClass;
        }
        // Set Resource use Str::studly
        if (empty($this->_resource)) {
            $fileName = Str::studly($this->_alias).'Resource';
            if (file_exists(__DIR__.'/../Resources/'.$fileName.'.php')) {
                $resourceClass =
                    'App\\Http\\Resources\\'.
                    Str::studly($this->_alias).
                    'Resource';
            } else {
                $resourceClass = 'App\\Http\\Resources\\DefaultResource';
            }

            $this->_resource = $resourceClass;
        }
    }

    public function index(): Response
    {
        $keyword = request()->query('keyword', '');
        $perPage = request()->query('per_page', 20);
        $sortField = request()->query('sort_field', '');
        $sortValue = request()->query('sort_value', 'asc');

        $items = call_user_func([$this->_model, 'query']);
        if (! empty($sortField)) {
            $items->orderBy($sortField, $sortValue);
        }
        if (! empty($keyword)) {
            $searchFields = $this->_searchFields;
            $items->where(function (Builder $q) use ($searchFields, $keyword) {
                foreach ($searchFields as $field) {
                    $q->orWhere($field, 'like', '%'.$keyword.'%');
                }
            });
        }
        [$items, $filters] = $this->_extendIndexQuery($items);

        return Inertia::render('admin/'.$this->_alias.'/index', [
            'items' => call_user_func(
                [$this->_resource, 'collection'],
                $items->paginate($perPage),
            ),
            'params' => array_merge(
                [
                    'page' => request()->query('page'),
                    'alias' => $this->_alias,
                    'per_page' => $perPage,
                    'sort_field' => $sortField,
                    'sort_value' => $sortValue,
                    'keyword' => $keyword,
                ],
                $filters,
            ),
        ]);
    }

    public function show(): Response
    {
        $itemId = request()->{$this->_alias};
        $item = call_user_func([$this->_model, 'find'], $itemId);
        if (empty($item)) {
            abort(404);
        }

        return Inertia::render('admin/'.$this->_alias.'/form', [
            'item' => $item,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/'.$this->_alias.'/form');
    }

    public function store(): RedirectResponse
    {
        $data = $this->_getDataCreate();
        $item = call_user_func([$this->_model, 'create'], $data);
        $this->_afterSave($item);

        return redirect()->route('admin.'.$this->_alias.'.index');
    }

    public function update(): Response
    {
        $a = request()->all();
        $itemId = request()->{$this->_alias};
        $item = call_user_func([$this->_model, 'find'], $itemId);
        if (empty($item)) {
            abort(404);
        }
        $data = $this->_getDataUpdate($item);
        $item->update($data);
        $this->_afterSave($item, 'update');

        return Inertia::render('admin/'.$this->_alias.'/form', [
            'item' => $item,
        ]);
    }

    /**
     * @throws Exception
     */
    public function destroy()
    {
        $itemId = request()->{$this->_alias};
        $item = call_user_func([$this->_model, 'find'], $itemId);
        if (empty($item)) {
            abort(404);
        }
        $item->delete();

        return redirect()
            ->route('admin.'.$this->_alias.'.index')
            ->with('success', '項目が正常に削除されました。');
    }

    protected function _getDataUpdate($item): array
    {
        return $this->_beforeSave($this->_validate($item, 'update'), 'update');
    }

    protected function _getDataCreate(): array
    {
        $model = $this->_model;

        return $this->_beforeSave($this->_validate(new $model));
    }

    protected function _validate($model, $action = 'store'): array
    {
        return request()->validate($this->_validateRule($model, $action));
    }

    protected function _afterSave($item, $action = 'store') {}

    protected function _beforeSave($data, $action = 'store')
    {
        return $data;
    }

    protected function _validateRule($model, $action = 'store'): array
    {
        return [];
    }

    protected function _extendIndexQuery(Builder $query): array
    {
        return [$query, []];
    }
}
