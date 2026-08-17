---
title: Select only needed columns
impact: HIGH
impactDescription: reduces memory and transfer time
tags: performance, eloquent, queries
---

## Select only needed columns

Only fetch columns you actually need.

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

For counts:
```php
// Bad - loads all records
$count = User::all()->count();

// Good - SQL COUNT
$count = User::count();
```
