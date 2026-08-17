---
title: Protect against mass assignment
impact: CRITICAL
impactDescription: prevents unauthorized data modification
tags: security, mass-assignment, models
---

## Protect against mass assignment

Always define `$fillable` or `$guarded` on models.

**Bad:**
```php
class User extends Model
{
    // No protection - all fields fillable
}

// Dangerous - accepts any field
User::create($request->all());
```

**Good:**
```php
class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // OR use guarded
    protected $guarded = [
        'id',
        'is_admin',
        'role',
    ];
}

// Safe - only validated fields
User::create($request->validated());
```

Never use:
```php
// NEVER do this
Model::unguard();
User::create($request->all());
```

Best practice: Use `$request->validated()` from Form Requests.
