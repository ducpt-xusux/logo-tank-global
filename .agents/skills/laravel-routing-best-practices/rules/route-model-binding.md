---
title: Prefer implicit route model binding
impact: MEDIUM
impactDescription: fewer manual lookups
tags: routing, models, binding
---

## Prefer implicit route model binding

Let Laravel resolve models for you instead of manual queries.

**Bad:**

```php
Route::get('/users/{id}', [UserController::class, 'show']);

class UserController
{
    public function show(int $id): View
    {
        $user = User::findOrFail($id);

        return view('users.show', ['user' => $user]);
    }
}
```

**Good:**

```php
Route::get('/users/{user}', [UserController::class, 'show']);

class UserController
{
    public function show(User $user): View
    {
        return view('users.show', ['user' => $user]);
    }
}
```
