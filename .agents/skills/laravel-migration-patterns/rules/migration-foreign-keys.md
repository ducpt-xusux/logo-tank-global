---
title: Define foreign key constraints
impact: HIGH
impactDescription: ensures data integrity
tags: migration, foreign-keys, relationships
---

## Define foreign key constraints

Use `foreignId()->constrained()` for data integrity.

**Bad:**
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id'); // No constraint
    $table->timestamps();
});
```

**Good:**
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->constrained()->nullOnDelete();
    $table->timestamps();
});
```

Foreign key actions:
```php
->cascadeOnDelete()  // Delete posts when user deleted
->nullOnDelete()     // Set to null when parent deleted
->restrictOnDelete() // Prevent deletion if children exist
->cascadeOnUpdate()  // Update FK if parent ID changes
```
