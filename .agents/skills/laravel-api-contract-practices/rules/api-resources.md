---
title: Use API resources for responses
impact: HIGH
impactDescription: stable API contracts
tags: api, resources
---

## Use API resources for responses

Transform models with API resources instead of returning raw models.

**Bad:**

```php
return User::query()->findOrFail($id);
```

**Good:**

```php
return new UserResource(User::query()->findOrFail($id));
```
