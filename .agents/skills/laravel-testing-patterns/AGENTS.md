# Laravel Testing Patterns - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive testing patterns for Laravel applications using Pest. It covers test structure, HTTP testing, factories, assertions, and mocking strategies.

---

## Table of Contents

1. [Test Structure](#1-test-structure)
   - 1.1 [Pest Syntax](#11-pest-syntax) (HIGH)
   - 1.2 [Using Factories](#12-using-factories) (HIGH)
2. [HTTP Testing](#2-http-testing)
   - 2.1 [HTTP Endpoints](#21-http-endpoints) (HIGH)
   - 2.2 [Specific Assertions](#22-specific-assertions) (HIGH)
3. [Advanced Patterns](#3-advanced-patterns)
   - 3.1 [Mocking Dependencies](#31-mocking-dependencies) (MEDIUM)

---

## 1. Test Structure

### 1.1 Pest Syntax

Use Pest's expressive syntax for all tests.

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

Using `describe` for grouping:
```php
describe('User registration', function () {
    it('requires a valid email', function () {
        $response = $this->postJson('/api/register', [
            'name' => 'John',
            'email' => 'invalid-email',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    });

    it('creates user with valid data', function () {
        $response = $this->postJson('/api/register', [
            'name' => 'John',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    });
});
```

### 1.2 Using Factories

Always use factories for creating test models.

**Bad:**
```php
it('shows user profile', function () {
    $user = new User();
    $user->name = 'John';
    $user->email = 'john@example.com';
    $user->password = bcrypt('password');
    $user->save();

    $response = $this->actingAs($user)->get('/profile');
    $response->assertOk();
});
```

**Good:**
```php
it('shows user profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk()
        ->assertSee($user->name);
});
```

Using factory states:
```php
it('shows admin dashboard to admins', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertOk();
});

it('denies regular users access to admin dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/dashboard');

    $response->assertForbidden();
});
```

Using factory relationships:
```php
it('shows user posts', function () {
    $user = User::factory()
        ->has(Post::factory()->count(3))
        ->create();

    $response = $this->actingAs($user)->get('/my-posts');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});
```

---

## 2. HTTP Testing

### 2.1 HTTP Endpoints

Test HTTP endpoints with proper assertions.

**Bad:**
```php
it('creates a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/posts', [
        'title' => 'Test Post',
        'content' => 'Content here',
    ]);

    $this->assertTrue($response->status() === 201);
});
```

**Good:**
```php
it('creates a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/posts', [
        'title' => 'Test Post',
        'content' => 'Content here',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.title', 'Test Post');

    $this->assertDatabaseHas('posts', [
        'user_id' => $user->id,
        'title' => 'Test Post',
    ]);
});
```

Testing validation errors:
```php
it('validates required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/posts', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'content']);
});
```

### 2.2 Specific Assertions

Use specific assertion methods instead of generic ones.

**Bad:**
```php
it('returns not found for missing resource', function () {
    $response = $this->getJson('/api/posts/999999');

    $this->assertEquals(404, $response->status());
});

it('denies unauthorized access', function () {
    $response = $this->getJson('/api/admin/users');

    $this->assertEquals(403, $response->status());
});
```

**Good:**
```php
it('returns not found for missing resource', function () {
    $response = $this->getJson('/api/posts/999999');

    $response->assertNotFound();
});

it('denies unauthorized access', function () {
    $response = $this->getJson('/api/admin/users');

    $response->assertForbidden();
});

it('requires authentication', function () {
    $response = $this->getJson('/api/profile');

    $response->assertUnauthorized();
});
```

Common specific assertions:
- `assertOk()` - 200
- `assertCreated()` - 201
- `assertNoContent()` - 204
- `assertUnauthorized()` - 401
- `assertForbidden()` - 403
- `assertNotFound()` - 404
- `assertUnprocessable()` - 422

---

## 3. Advanced Patterns

### 3.1 Mocking Dependencies

Mock external dependencies to isolate tests.

**Bad:**
```php
it('sends welcome email', function () {
    $user = User::factory()->create();

    // Actually sends email during test
    $this->postJson('/api/register', [
        'name' => 'John',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);
});
```

**Good:**
```php
use function Pest\Laravel\mock;

it('sends welcome email', function () {
    Mail::fake();

    $this->postJson('/api/register', [
        'name' => 'John',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    Mail::assertSent(WelcomeEmail::class, function ($mail) {
        return $mail->hasTo('john@example.com');
    });
});
```

Mocking services:
```php
it('fetches weather data', function () {
    $weatherService = mock(WeatherService::class);
    $weatherService->shouldReceive('getCurrentTemperature')
        ->with('New York')
        ->andReturn(72);

    $response = $this->getJson('/api/weather?city=New+York');

    $response->assertOk()
        ->assertJsonPath('temperature', 72);
});
```

Using Pest's `mock` function:
```php
use function Pest\Laravel\mock;

it('processes payment', function () {
    mock(PaymentGateway::class)
        ->shouldReceive('charge')
        ->once()
        ->with(1000, 'tok_visa')
        ->andReturn(true);

    $response = $this->postJson('/api/checkout', [
        'amount' => 1000,
        'token' => 'tok_visa',
    ]);

    $response->assertOk();
});
```

Using Laravel fakes:
```php
it('dispatches job after order', function () {
    Queue::fake();

    $this->postJson('/api/orders', ['product_id' => 1]);

    Queue::assertPushed(ProcessOrder::class);
});

it('fires event on user creation', function () {
    Event::fake([UserCreated::class]);

    User::factory()->create();

    Event::assertDispatched(UserCreated::class);
});
```

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| testing-pest-syntax | HIGH | Use Pest's expressive syntax |
| testing-factories | HIGH | Always use factories for models |
| testing-http | HIGH | Test endpoints thoroughly |
| testing-assertions | HIGH | Use specific assertion methods |
| testing-mocking | MEDIUM | Mock external dependencies |
