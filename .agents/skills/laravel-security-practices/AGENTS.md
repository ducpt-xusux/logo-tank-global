# Laravel Security Practices - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive security practices for Laravel applications. It covers XSS prevention, mass assignment protection, authorization patterns, and data encryption.

---

## Table of Contents

1. [Input Security](#1-input-security)
   - 1.1 [XSS Prevention](#11-xss-prevention) (CRITICAL)
   - 1.2 [Mass Assignment Protection](#12-mass-assignment-protection) (CRITICAL)
2. [Authorization](#2-authorization)
   - 2.1 [Policies](#21-policies) (HIGH)
   - 2.2 [Gates](#22-gates) (HIGH)
3. [Data Protection](#3-data-protection)
   - 3.1 [Encryption](#31-encryption) (HIGH)

---

## 1. Input Security

### 1.1 XSS Prevention

Always escape user-generated content when rendering.

**Bad:**
```php
// In Blade template - vulnerable to XSS
<div>{!! $user->bio !!}</div>
<p>{!! $comment->content !!}</p>
```

**Good:**
```php
// In Blade template - properly escaped
<div>{{ $user->bio }}</div>
<p>{{ $comment->content }}</p>
```

When you need HTML content:
```php
// Sanitize HTML before storing
use Stevebauman\Purify\Facades\Purify;

$post->content = Purify::clean($request->content);
$post->save();

// Then you can safely render
<div>{!! $post->content !!}</div>
```

For JavaScript contexts:
```php
// Bad
<script>var data = {!! json_encode($userData) !!};</script>

// Good - use Blade's @json directive
<script>var data = @json($userData);</script>
```

### 1.2 Mass Assignment Protection

Protect models from mass assignment vulnerabilities.

**Bad:**
```php
class User extends Model
{
    // No protection - all fields are fillable
}

// Dangerous - accepts any field from request
User::create($request->all());
```

**Good:**
```php
class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // OR use guarded for inverse protection
    protected $guarded = [
        'id',
        'is_admin',
        'role',
    ];
}

// Safe - only validated fields
User::create($request->validated());
```

Never use unguarded operations:
```php
// NEVER do this
Model::unguard();
User::create($request->all());
Model::reguard();
```

---

## 2. Authorization

### 2.1 Policies

Use policies for model-based authorization.

**Bad:**
```php
class PostController extends Controller
{
    public function update(Request $request, Post $post)
    {
        if ($request->user()->id !== $post->user_id) {
            abort(403);
        }

        $post->update($request->validated());
    }
}
```

**Good:**
```php
// app/Policies/PostPolicy.php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }
}

// Controller
class PostController extends Controller
{
    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());
    }
}
```

Create policy with: `php artisan make:policy PostPolicy --model=Post`

In Blade templates:
```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan
```

### 2.2 Gates

Use gates for non-model authorization.

**Bad:**
```php
if ($user->role === 'admin' || $user->role === 'editor') {
    // Allow access
}
```

**Good:**
```php
// In AuthServiceProvider or bootstrap/app.php
Gate::define('access-admin-dashboard', function (User $user): bool {
    return $user->isAdmin() || $user->isEditor();
});

Gate::define('publish-content', function (User $user): bool {
    return $user->hasPermission('publish');
});

// Usage in controller
if (Gate::allows('access-admin-dashboard')) {
    // Allow access
}

// Or with authorize helper
$this->authorize('access-admin-dashboard');
```

In middleware:
```php
Route::middleware('can:access-admin-dashboard')->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});
```

---

## 3. Data Protection

### 3.1 Encryption

Encrypt sensitive data at rest.

**Bad:**
```php
class User extends Model
{
    // Sensitive data stored in plain text
}

$user->ssn = $request->ssn;
$user->save();
```

**Good:**
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'ssn' => 'encrypted',
            'credit_card' => 'encrypted',
            'medical_info' => 'encrypted:array',
        ];
    }
}

// Automatically encrypted when saving
$user->ssn = $request->ssn;
$user->save();

// Automatically decrypted when accessing
echo $user->ssn;
```

For manual encryption:
```php
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString($sensitiveData);

// Decrypt
$decrypted = Crypt::decryptString($encrypted);
```

Important security practices:
- Never log sensitive data
- Use HTTPS in production
- Rotate APP_KEY periodically
- Use environment-specific keys

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| security-xss | CRITICAL | Always escape output with `{{ }}` |
| security-mass-assignment | CRITICAL | Define `$fillable` or `$guarded` |
| security-policies | HIGH | Use policies for model authorization |
| security-gates | HIGH | Use gates for action authorization |
| security-encryption | HIGH | Encrypt sensitive data with casts |
