---
title: Use consistent named routes
impact: HIGH
impactDescription: reliable URL generation and refactors
tags: routing, naming
---

## Use consistent named routes

Use snake_case with dot notation for route names and prefer named routes in links.

**Bad:**

```php
Route::get('/users/{user}', [UserController::class, 'show'])->name('show-user');
```

**Good:**

```php
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
```

```php
return redirect()->route('users.show', $user);
```
