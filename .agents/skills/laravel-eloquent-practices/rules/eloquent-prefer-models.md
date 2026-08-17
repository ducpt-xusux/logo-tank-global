---
title: Prefer Eloquent Models over DB Facade
impact: HIGH
impactDescription: better maintainability and model features
tags: eloquent, queries, models
---

## Prefer Eloquent Models over DB Facade

Use `Model::query()` instead of `DB::table()` for consistency and access to model features.

**Bad:**
```php
$users = DB::table('users')->where('active', true)->get();
$count = DB::table('orders')->where('user_id', $userId)->count();
```

**Good:**
```php
$users = User::query()->where('active', true)->get();
$count = Order::query()->where('user_id', $userId)->count();
```

Using Eloquent models provides access to:
- Model events (created, updated, deleted)
- Attribute casting
- Query scopes
- Relationships
- Mutators and accessors
