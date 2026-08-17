---
title: Use specific assertion methods
impact: HIGH
impactDescription: clearer test intentions
tags: testing, assertions, http
---

## Use specific assertion methods

Use Laravel's specific assertion methods instead of generic status checks.

**Bad:**
```php
it('returns not found', function () {
    $response = $this->getJson('/api/posts/999999');
    $this->assertEquals(404, $response->status());
});

it('denies access', function () {
    $response = $this->getJson('/api/admin/users');
    $this->assertEquals(403, $response->status());
});
```

**Good:**
```php
it('returns not found', function () {
    $response = $this->getJson('/api/posts/999999');
    $response->assertNotFound();
});

it('denies access', function () {
    $response = $this->getJson('/api/admin/users');
    $response->assertForbidden();
});

it('requires authentication', function () {
    $response = $this->getJson('/api/profile');
    $response->assertUnauthorized();
});
```

Common assertions:
- `assertOk()` - 200
- `assertCreated()` - 201
- `assertNoContent()` - 204
- `assertUnauthorized()` - 401
- `assertForbidden()` - 403
- `assertNotFound()` - 404
- `assertUnprocessable()` - 422
