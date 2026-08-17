---
title: Version APIs with route groups
impact: MEDIUM
impactDescription: predictable evolution
tags: routing, api, versioning
---

## Version APIs with route groups

Keep API versions in their own groups so changes do not break existing clients.

**Bad:**

```php
Route::get('/users', [ApiUserController::class, 'index']);
Route::get('/users/{user}', [ApiUserController::class, 'show']);
```

**Good:**

```php
Route::prefix('v1')
    ->name('v1.')
    ->group(function (): void {
        Route::get('/users', [ApiUserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [ApiUserController::class, 'show'])->name('users.show');
    });
```
