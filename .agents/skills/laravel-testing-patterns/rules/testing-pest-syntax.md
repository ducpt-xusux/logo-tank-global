---
title: Use Pest syntax consistently
impact: HIGH
impactDescription: cleaner and more expressive tests
tags: testing, pest, syntax
---

## Use Pest syntax consistently

Write all tests using Pest's expressive syntax.

**Bad:**
```php
class UserTest extends TestCase
{
    public function test_user_can_be_created(): void
    {
        $user = User::factory()->create();
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }
}
```

**Good:**
```php
it('can create a user', function () {
    $user = User::factory()->create();

    expect($user)->toBeInstanceOf(User::class);
    $this->assertDatabaseHas('users', ['id' => $user->id]);
});
```

Use `describe` for grouping related tests:
```php
describe('User registration', function () {
    it('requires a valid email', function () { ... });
    it('creates user with valid data', function () { ... });
});
```

Create with: `php artisan make:test UserTest --pest`
