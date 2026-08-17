---
title: Keep consistent response envelopes
impact: HIGH
impactDescription: predictable clients
tags: api, response
---

## Keep consistent response envelopes

Wrap data consistently so clients always know what to expect.

**Bad:**

```php
return [
    'id' => $user->id,
    'name' => $user->name,
];
```

**Good:**

```php
return [
    'data' => [
        'id' => $user->id,
        'name' => $user->name,
    ],
];
```
