---
title: Test HTTP endpoints thoroughly
impact: HIGH
impactDescription: complete API coverage
tags: testing, http, api
---

## Test HTTP endpoints thoroughly

Test HTTP endpoints with proper request methods and assertions.

**Bad:**
```php
it('creates a post', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->post('/posts', ['title' => 'Test']);
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

Test validation errors:
```php
it('validates required fields', function () {
    $response = $this->actingAs($user)->postJson('/api/posts', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'content']);
});
```
