---
title: Prevent N+1 with eager loading
impact: HIGH
impactDescription: dramatically reduces query count
tags: performance, eloquent, queries
---

## Prevent N+1 with eager loading

Use `with()` to load relationships upfront.

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
$users = User::with(['posts' => fn($q) =>
    $q->published()->latest()->limit(5)
])->get();
```
