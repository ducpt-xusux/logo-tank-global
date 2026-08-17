---
title: Use resource collections for lists
impact: MEDIUM
impactDescription: consistent transformation
tags: api, resources
---

## Use resource collections for lists

Leverage resource collections to shape list responses.

**Bad:**

```php
return User::query()->latest()->paginate();
```

**Good:**

```php
return UserResource::collection(User::query()->latest()->paginate());
```
