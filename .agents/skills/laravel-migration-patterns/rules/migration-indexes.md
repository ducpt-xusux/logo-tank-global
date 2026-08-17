---
title: Add indexes for query optimization
impact: HIGH
impactDescription: dramatically improves query speed
tags: migration, indexes, performance
---

## Add indexes for query optimization

Index columns that are frequently queried.

**Bad:**
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id');
    $table->string('status');
    $table->timestamps();
});
// No indexes - slow queries on large tables
```

**Good:**
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->index();
    $table->string('status')->index();
    $table->timestamp('published_at')->nullable()->index();
    $table->timestamps();

    // Composite index for common queries
    $table->index(['user_id', 'status']);
});
```

For unique constraints:
```php
$table->unique('email');
$table->unique(['user_id', 'slug']); // Composite unique
```
