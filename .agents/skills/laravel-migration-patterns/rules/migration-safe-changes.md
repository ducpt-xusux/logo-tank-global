---
title: Make non-breaking schema changes
impact: CRITICAL
impactDescription: prevents production downtime
tags: migration, schema, safety
---

## Make non-breaking schema changes

Use multi-step migrations for safe production changes.

**Bad:**
```php
// Dangerous - removes column immediately
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('legacy_field');
});

// Dangerous - renames column
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

// Step 2: Migrate data (separate migration)
DB::table('users')->update(['full_name' => DB::raw('name')]);

// Step 3: Remove old column (after code is updated)
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('name');
});
```

For adding required columns, start nullable then make required after data migration.
