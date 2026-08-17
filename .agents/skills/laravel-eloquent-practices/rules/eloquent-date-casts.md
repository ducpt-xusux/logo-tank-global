---
title: Use proper date casting for datetime columns
impact: MEDIUM
impactDescription: automatic Carbon instances
tags: eloquent, casts, dates
---

## Use proper date casting for datetime columns

Define casts for datetime columns to get automatic Carbon instances.

**Bad:**
```php
class User extends Model
{
    // No casts - dates remain as strings
}

// Manual parsing required
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
$user->trial_ends_at->isPast();
```
