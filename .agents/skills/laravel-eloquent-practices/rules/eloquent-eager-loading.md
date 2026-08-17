---
title: Avoid N+1 queries with eager loading
impact: HIGH
impactDescription: fewer queries, better performance
tags: eloquent, relationships, performance
---

## Avoid N+1 queries with eager loading

Load relationships upfront using `with()` instead of querying inside loops.

**Bad:**
```php
$users = User::all();
foreach ($users as $user) {
    $profileName = $user->profile->name; // N+1 query problem
}
```

**Good:**
```php
$users = User::with('profile')->get();
foreach ($users as $user) {
    $profileName = $user->profile->name; // No additional queries
}
```

For nested relationships:
```php
$users = User::with(['posts.comments', 'profile'])->get();
```

For conditional eager loading:
```php
$users = User::with(['posts' => fn($q) => $q->published()->latest()->limit(5)])->get();
```
