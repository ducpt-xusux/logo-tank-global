---
title: Follow naming conventions
impact: MEDIUM
impactDescription: consistent and predictable schema
tags: migration, naming, conventions
---

## Follow naming conventions

Use Laravel's standard naming conventions.

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

// Counts - use _count suffix
$table->unsignedInteger('views_count')->default(0);
```

Always implement the `down()` method for rollbacks.
