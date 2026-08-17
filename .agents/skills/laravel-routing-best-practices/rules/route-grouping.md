---
title: Group routes with prefix, name, and middleware
impact: HIGH
impactDescription: consistent structure and fewer mistakes
tags: routing, grouping, middleware, naming
---

## Group routes with prefix, name, and middleware

Keep related routes together and define shared concerns once.

**Bad:**

```php
Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
Route::get('/admin/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
```

**Good:**

```php
Route::prefix('admin')
    ->middleware(['auth', 'verified'])
    ->name('admin.')
    ->group(function (): void {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    });
```
