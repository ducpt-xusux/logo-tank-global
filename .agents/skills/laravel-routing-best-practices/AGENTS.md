# Laravel Routing Best Practices - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive routing best practices for Laravel applications. It covers route grouping, naming, API versioning, and implicit model binding.

---

## Table of Contents

1. [Route Structure](#1-route-structure) - HIGH
   - 1.1 [Group routes with prefix, name, and middleware](#11-group-routes-with-prefix-name-and-middleware)
   - 1.2 [Keep routes files thin](#12-keep-routes-files-thin)
2. [Naming and Versioning](#2-naming-and-versioning) - HIGH
   - 2.1 [Use consistent named routes](#21-use-consistent-named-routes)
   - 2.2 [Version APIs with route groups](#22-version-apis-with-route-groups)
3. [Model Binding](#3-model-binding) - MEDIUM
   - 3.1 [Prefer implicit route model binding](#31-prefer-implicit-route-model-binding)

---

## 1. Route Structure

### 1.1 Group routes with prefix, name, and middleware

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

### 1.2 Keep routes files thin

Avoid putting logic inside routes. Use controllers or single-action classes.

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

---

## 2. Naming and Versioning

### 2.1 Use consistent named routes

Use snake_case with dot notation for route names and prefer named routes.

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

### 2.2 Version APIs with route groups

Keep API versions in dedicated groups so changes do not break clients.

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

---

## 3. Model Binding

### 3.1 Prefer implicit route model binding

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

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| route-grouping | HIGH | Group routes by prefix, name, middleware |
| route-controller-only | HIGH | Keep routes files thin |
| route-naming | HIGH | Use consistent named routes |
| route-api-versioning | HIGH | Version APIs with route groups |
| route-model-binding | MEDIUM | Prefer implicit model binding |
