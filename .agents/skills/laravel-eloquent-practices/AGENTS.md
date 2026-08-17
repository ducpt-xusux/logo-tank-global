# Laravel Eloquent Best Practices - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive Eloquent ORM best practices for Laravel applications. It covers query optimization, relationship management, and efficient data handling patterns.

---

## Table of Contents

1. [Query Structure](#1-query-structure)
   - 1.1 [Prefer Models over DB Facade](#11-prefer-models-over-db-facade) (HIGH)
   - 1.2 [Eager Loading](#12-eager-loading) (HIGH)
2. [Relationships & Scopes](#2-relationships--scopes)
   - 2.1 [Typed Relationships](#21-typed-relationships) (HIGH)
   - 2.2 [Query Scopes](#22-query-scopes) (HIGH)
3. [Data Volume](#3-data-volume)
   - 3.1 [Chunking Large Datasets](#31-chunking-large-datasets) (MEDIUM)
   - 3.2 [Date Casting](#32-date-casting) (MEDIUM)

---

## 1. Query Structure

### 1.1 Prefer Models over DB Facade

Always use Eloquent models instead of the `DB::` facade for consistency and model features.

**Bad:**
```php
$users = DB::table('users')->where('active', true)->get();
```

**Good:**
```php
$users = User::query()->where('active', true)->get();
```

Using `Model::query()` gives you access to model events, casts, scopes, and relationships.

### 1.2 Eager Loading

Prevent N+1 queries by eager loading relationships upfront.

**Bad:**
```php
$users = User::all();
foreach ($users as $user) {
    echo $user->profile->name; // N+1 query!
}
```

**Good:**
```php
$users = User::with('profile')->get();
foreach ($users as $user) {
    echo $user->profile->name; // No additional queries
}
```

For nested relationships:
```php
$users = User::with(['posts.comments', 'profile'])->get();
```

For conditional eager loading:
```php
$users = User::with(['posts' => function ($query) {
    $query->where('published', true)->latest()->limit(5);
}])->get();
```

---

## 2. Relationships & Scopes

### 2.1 Typed Relationships

Always define relationship methods with explicit return types.

**Bad:**
```php
public function posts()
{
    return $this->hasMany(Post::class);
}
```

**Good:**
```php
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
}

public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
}
```

### 2.2 Query Scopes

Extract reusable query logic into local scopes.

**Bad:**
```php
// Repeated in multiple places
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

// Usage
$activeUsers = User::active()->get();
```

Chain multiple scopes:
```php
public function scopeRecent(Builder $query, int $days = 30): Builder
{
    return $query->where('created_at', '>=', now()->subDays($days));
}

// Usage
$users = User::active()->recent(7)->get();
```

---

## 3. Data Volume

### 3.1 Chunking Large Datasets

Process large datasets in chunks to prevent memory exhaustion.

**Bad:**
```php
// Loads all records into memory
$users = User::all();
foreach ($users as $user) {
    $user->sendNewsletter();
}
```

**Good:**
```php
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        $user->sendNewsletter();
    }
});
```

For updating records while chunking:
```php
User::where('active', true)->chunkById(100, function ($users) {
    foreach ($users as $user) {
        $user->update(['notified_at' => now()]);
    }
});
```

Using lazy collections for memory efficiency:
```php
User::lazy()->each(function ($user) {
    $user->processData();
});
```

### 3.2 Date Casting

Use proper date casting for datetime columns.

**Bad:**
```php
class User extends Model
{
    // No casts defined - dates are strings
}

// Manual parsing
$date = Carbon::parse($user->created_at);
```

**Good:**
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'birth_date' => 'date',
            'settings' => 'array',
            'is_admin' => 'boolean',
        ];
    }
}

// Automatic Carbon instance
$user->email_verified_at->diffForHumans();
```

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| eloquent-prefer-models | HIGH | Use `Model::query()` over `DB::` |
| eloquent-eager-loading | HIGH | Always eager load relationships |
| eloquent-relations | HIGH | Add return types to relationships |
| eloquent-scopes | HIGH | Extract reusable queries into scopes |
| eloquent-chunking | MEDIUM | Process large datasets in chunks |
| eloquent-date-casts | MEDIUM | Cast datetime columns properly |
