---
title: Mock external dependencies properly
impact: MEDIUM
impactDescription: isolated and fast tests
tags: testing, mocking, dependencies
---

## Mock external dependencies properly

Mock external services and dependencies to isolate tests.

**Bad:**
```php
it('sends welcome email', function () {
    // Actually sends email during test
    $this->postJson('/api/register', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);
});
```

**Good:**
```php
it('sends welcome email', function () {
    Mail::fake();

    $this->postJson('/api/register', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    Mail::assertSent(WelcomeEmail::class, fn($mail) =>
        $mail->hasTo('john@example.com')
    );
});
```

Mock services with Pest:
```php
use function Pest\Laravel\mock;

it('processes payment', function () {
    mock(PaymentGateway::class)
        ->shouldReceive('charge')
        ->once()
        ->andReturn(true);

    $response = $this->postJson('/api/checkout', ['amount' => 1000]);
    $response->assertOk();
});
```

Laravel fakes:
- `Mail::fake()`, `Queue::fake()`, `Event::fake()`, `Notification::fake()`
