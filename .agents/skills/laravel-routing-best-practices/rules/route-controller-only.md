---
title: Keep routes files thin
impact: HIGH
impactDescription: clearer responsibility boundaries
tags: routing, controllers, structure
---

## Keep routes files thin

Avoid putting logic inside route definitions. Use controllers or single-action classes.

**Bad:**

```php
Route::get('/reports', function (): View {
    $reports = Report::query()->latest()->take(10)->get();

    return view('reports.index', ['reports' => $reports]);
});
```

**Good:**

```php
Route::get('/reports', [ReportController::class, 'index']);

class ReportController
{
    public function index(): View
    {
        $reports = Report::query()->latest()->take(10)->get();

        return view('reports.index', ['reports' => $reports]);
    }
}
```
