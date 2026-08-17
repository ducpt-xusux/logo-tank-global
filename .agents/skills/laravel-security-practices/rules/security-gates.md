---
title: Define gates for action-based authorization
impact: HIGH
impactDescription: reusable authorization logic
tags: security, authorization, gates
---

## Define gates for action-based authorization

Use gates for non-model authorization.

**Bad:**
```php
if ($user->role === 'admin' || $user->role === 'editor') {
    // Allow access
}
```

**Good:**
```php
// In AuthServiceProvider or bootstrap/app.php
Gate::define('access-admin-dashboard', function (User $user): bool {
    return $user->isAdmin() || $user->isEditor();
});

// Usage in controller
$this->authorize('access-admin-dashboard');

// Or check directly
if (Gate::allows('access-admin-dashboard')) {
    // Allow access
}
```

In routes with middleware:
```php
Route::middleware('can:access-admin-dashboard')->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});
```

In Blade:
```blade
@can('access-admin-dashboard')
    <a href="/admin">Admin Dashboard</a>
@endcan
```
