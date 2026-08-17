---
title: Use factories for model creation
impact: HIGH
impactDescription: consistent and maintainable test data
tags: testing, factories, models
---

## Use factories for model creation

Always use factories instead of manually creating models in tests.

**Bad:**
```php
it('shows user profile', function () {
    $user = new User();
    $user->name = 'John';
    $user->email = 'john@example.com';
    $user->password = bcrypt('password');
    $user->save();

    $response = $this->actingAs($user)->get('/profile');
});
```

**Good:**
```php
it('shows user profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk()->assertSee($user->name);
});
```

Use factory states for specific scenarios:
```php
$admin = User::factory()->admin()->create();
$unverified = User::factory()->unverified()->create();
```

Use factory relationships:
```php
$user = User::factory()
    ->has(Post::factory()->count(3))
    ->create();
```
