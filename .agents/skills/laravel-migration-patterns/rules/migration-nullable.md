---
title: Handle nullable columns properly
impact: CRITICAL
impactDescription: prevents migration failures
tags: migration, schema, columns
---

## Handle nullable columns properly

Always make new columns nullable or provide defaults when adding to existing tables.

**Bad:**
```php
// Fails on tables with existing data
Schema::table('users', function (Blueprint $table) {
    $table->string('phone'); // NOT NULL by default - fails!
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

When modifying columns, include ALL attributes:
```php
Schema::table('users', function (Blueprint $table) {
    // Include all previous attributes when using change()
    $table->string('phone', 20)->nullable()->change();
});
```
