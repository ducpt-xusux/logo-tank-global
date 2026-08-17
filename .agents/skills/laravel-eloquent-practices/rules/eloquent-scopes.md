---
title: Extract reusable query logic into scopes
impact: HIGH
impactDescription: DRY code and readability
tags: eloquent, scopes, queries
---

## Extract reusable query logic into scopes

Use local scopes to encapsulate frequently used query constraints.

**Bad:**
```php
// Repeated across multiple files
$activeUsers = User::where('active', true)
    ->where('verified_at', '!=', null)
    ->get();
```

**Good:**
```php
// In User model
public function scopeActive(Builder $query): Builder
{
    return $query->where('active', true)
        ->whereNotNull('verified_at');
}

// Usage - clean and reusable
$activeUsers = User::active()->get();
```

Scopes can accept parameters:
```php
public function scopeRecent(Builder $query, int $days = 30): Builder
{
    return $query->where('created_at', '>=', now()->subDays($days));
}

// Usage
$recentUsers = User::active()->recent(7)->get();
```
