---
title: Paginate collections
impact: HIGH
impactDescription: predictable paging and load
tags: api, pagination
---

## Paginate collections

Use pagination for collection endpoints instead of returning all records.

**Bad:**

```php
return UserResource::collection(User::query()->latest()->get());
```

**Good:**

```php
return UserResource::collection(User::query()->latest()->paginate());
```
