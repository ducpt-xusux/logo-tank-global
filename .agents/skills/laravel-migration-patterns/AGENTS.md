# Laravel Migration Patterns - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive migration patterns for Laravel applications. It covers safe schema changes, performance optimization, and best practices.

---

## Table of Contents

1. [Schema Safety](#1-schema-safety)
   - 1.1 [Safe Changes](#11-safe-changes) (CRITICAL)
   - 1.2 [Nullable Columns](#12-nullable-columns) (CRITICAL)
2. [Performance](#2-performance)
   - 2.1 [Indexes](#21-indexes) (HIGH)
   - 2.2 [Foreign Keys](#22-foreign-keys) (HIGH)
3. [Best Practices](#3-best-practices)
   - 3.1 [Naming Conventions](#31-naming-conventions) (MEDIUM)

---

## 1. Schema Safety

### 1.1 Safe Changes

Make non-breaking schema changes in production.

**Bad:**
```php
// Dangerous - removes column immediately
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('legacy_field');
});

// Dangerous - renames column (may break running code)
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('name', 'full_name');
});
```

**Good:**
```php
// Step 1: Add new column
Schema::table('users', function (Blueprint $table) {
    $table->string('full_name')->nullable()->after('name');
});

// Step 2: Migrate data (in separate migration)
DB::table('users')->update(['full_name' => DB::raw('name')]);

// Step 3: Remove old column (after code is updated)
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('name');
});
```

For adding required columns:
```php
// Add as nullable first, then update
Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('category_id')->nullable()->constrained();
});

// Update existing data
DB::table('posts')->whereNull('category_id')->update(['category_id' => 1]);

// Then make non-nullable in separate migration
Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('category_id')->nullable(false)->change();
});
```

### 1.2 Nullable Columns

Handle nullable columns properly for existing tables.

**Bad:**
```php
// Fails on tables with existing data
Schema::table('users', function (Blueprint $table) {
    $table->string('phone'); // NOT NULL by default
});
```

**Good:**
```php
// Add as nullable for existing tables
Schema::table('users', function (Blueprint $table) {
    $table->string('phone')->nullable();
});

// Or provide a default
Schema::table('users', function (Blueprint $table) {
    $table->string('status')->default('active');
});
```

For modifying columns:
```php
// Include ALL column attributes when modifying
Schema::table('users', function (Blueprint $table) {
    $table->string('phone', 20)->nullable()->change();
});
```

---

## 2. Performance

### 2.1 Indexes

Add indexes for frequently queried columns.

**Bad:**
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id');
    $table->string('status');
    $table->timestamp('published_at');
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
    $table->index(['status', 'published_at']);
});
```

For unique constraints:
```php
$table->unique('email');
$table->unique(['user_id', 'slug']); // Composite unique
```

### 2.2 Foreign Keys

Define foreign key constraints for data integrity.

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
->cascadeOnUpdate()  // Update foreign key if parent ID changes
```

---

## 3. Best Practices

### 3.1 Naming Conventions

Follow Laravel naming conventions.

**Migration file naming:**
```
create_users_table
add_phone_to_users_table
create_post_tag_table (pivot)
drop_legacy_column_from_users_table
```

**Create with Artisan:**
```bash
php artisan make:migration create_posts_table
php artisan make:migration add_phone_to_users_table --table=users
php artisan make:migration create_post_tag_table
```

**Column naming:**
```php
// IDs
$table->id();
$table->foreignId('user_id');

// Booleans - prefix with is_, has_, can_
$table->boolean('is_active')->default(true);
$table->boolean('has_verified_email')->default(false);

// Timestamps - use _at suffix
$table->timestamp('published_at')->nullable();
$table->timestamp('verified_at')->nullable();

// Counts - use _count suffix
$table->unsignedInteger('views_count')->default(0);
```

**Down method:**
```php
public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('phone');
    });
}
```

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| migration-safe-changes | CRITICAL | Make non-breaking schema changes |
| migration-nullable | CRITICAL | Add nullable for existing tables |
| migration-indexes | HIGH | Index frequently queried columns |
| migration-foreign-keys | HIGH | Define FK constraints |
| migration-naming | MEDIUM | Follow naming conventions |
