---
title: Define typed relationship methods
impact: HIGH
impactDescription: better IDE support and type safety
tags: eloquent, relationships, typing
---

## Define typed relationship methods

Always add explicit return types to relationship methods.

**Bad:**
```php
public function posts()
{
    return $this->hasMany(Post::class);
}
```

**Good:**
```php
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
}

public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
}
```

This enables IDE autocompletion and static analysis.
