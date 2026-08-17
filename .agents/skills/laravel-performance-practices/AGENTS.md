# Laravel Performance Practices - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive performance optimization practices for Laravel applications. It covers query optimization, caching strategies, and resource management.

---

## Table of Contents

1. [Query Optimization](#1-query-optimization)
   - 1.1 [Eager Loading](#11-eager-loading) (HIGH)
   - 1.2 [Select Specific Columns](#12-select-specific-columns) (HIGH)
2. [Caching](#2-caching)
   - 2.1 [Cache Expensive Operations](#21-cache-expensive-operations) (HIGH)
   - 2.2 [Config and Route Caching](#22-config-and-route-caching) (HIGH)
3. [Resource Management](#3-resource-management)
   - 3.1 [Queue Heavy Tasks](#31-queue-heavy-tasks) (MEDIUM)

---

## 1. Query Optimization

### 1.1 Eager Loading

Prevent N+1 queries with eager loading.

**Bad:**
```php
// N+1 problem - 101 queries for 100 posts
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;
}
```

**Good:**
```php
// 2 queries total
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name;
}
```

Nested eager loading:
```php
$posts = Post::with(['author', 'comments.user'])->get();
```

Constrained eager loading:
```php
$users = User::with(['posts' => function ($query) {
    $query->where('published', true)
        ->latest()
        ->limit(5);
}])->get();
```

### 1.2 Select Specific Columns

Only select columns you need.

**Bad:**
```php
// Selects all columns including large text fields
$users = User::all();
foreach ($users as $user) {
    echo $user->name;
}
```

**Good:**
```php
// Only fetches needed columns
$users = User::select(['id', 'name', 'email'])->get();
```

With relationships:
```php
$posts = Post::with(['author:id,name'])
    ->select(['id', 'title', 'user_id'])
    ->get();
```

For counts without loading models:
```php
// Bad
$count = User::all()->count();

// Good
$count = User::count();
```

---

## 2. Caching

### 2.1 Cache Expensive Operations

Cache database queries and computed values.

**Bad:**
```php
public function index()
{
    // Runs expensive query on every request
    $stats = [
        'users' => User::count(),
        'posts' => Post::count(),
        'comments' => Comment::count(),
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
            'comments' => Comment::count(),
        ];
    });

    return view('dashboard', compact('stats'));
}
```

Cache tags for granular invalidation:
```php
// Cache with tags
Cache::tags(['users', 'stats'])->remember('user-count', 3600, fn() => User::count());

// Invalidate specific tags
Cache::tags(['users'])->flush();
```

### 2.2 Config and Route Caching

Cache configuration and routes in production.

**For production deployment:**
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Cache events
php artisan event:cache
```

**Clear caches when needed:**
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

---

## 3. Resource Management

### 3.1 Queue Heavy Tasks

Offload time-consuming operations to queues.

**Bad:**
```php
public function register(RegisterRequest $request)
{
    $user = User::create($request->validated());

    // Blocks the response
    Mail::to($user)->send(new WelcomeEmail($user));
    $this->generateAvatar($user);
    $this->sendToAnalytics($user);

    return redirect('/dashboard');
}
```

**Good:**
```php
public function register(RegisterRequest $request)
{
    $user = User::create($request->validated());

    // Dispatched to queue - non-blocking
    SendWelcomeEmail::dispatch($user);
    GenerateAvatar::dispatch($user);
    SyncToAnalytics::dispatch($user);

    return redirect('/dashboard');
}
```

Job with queue:
```php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public User $user)
    {
    }

    public function handle(): void
    {
        Mail::to($this->user)->send(new WelcomeEmail($this->user));
    }
}
```

Batch processing:
```php
Bus::batch([
    new ProcessImage($image1),
    new ProcessImage($image2),
    new ProcessImage($image3),
])->dispatch();
```

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| performance-eager-loading | HIGH | Use `with()` to prevent N+1 |
| performance-select | HIGH | Select only needed columns |
| performance-cache | HIGH | Cache expensive operations |
| performance-config-cache | HIGH | Cache config/routes in production |
| performance-queues | MEDIUM | Offload heavy tasks to queues |
