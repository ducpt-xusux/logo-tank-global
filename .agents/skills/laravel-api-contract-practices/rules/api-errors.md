---
title: Standardize validation errors
impact: MEDIUM
impactDescription: predictable error handling
tags: api, validation
---

## Standardize validation errors

Use Laravel's validation responses or a consistent error shape.

**Bad:**

```php
return response()->json(['error' => 'Invalid input'], 422);
```

**Good:**

```php
throw ValidationException::withMessages([
    'email' => ['Email is required.'],
]);
```
