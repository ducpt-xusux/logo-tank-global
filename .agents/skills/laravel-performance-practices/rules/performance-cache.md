---
title: Cache expensive operations
impact: HIGH
impactDescription: reduces database load
tags: performance, caching, queries
---

## Cache expensive operations

Cache database queries and computed values.

**Bad:**
```php
public function index()
{
    // Runs expensive query on every request
    $stats = [
        'users' => User::count(),
        'posts' => Post::count(),
    ];
    return view('dashboard', compact('stats'));
}
```

**Good:**
```php
public function index()
{
    $stats = Cache::remember('dashboard-stats', now()->addMinutes(5), function () {
        return [
            'users' => User::count(),
            'posts' => Post::count(),
        ];
    });
    return view('dashboard', compact('stats'));
}
```

With cache tags:
```php
Cache::tags(['users', 'stats'])->remember('user-count', 3600, fn() => User::count());

// Invalidate
Cache::tags(['users'])->flush();
```
