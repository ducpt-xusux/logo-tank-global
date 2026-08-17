---
title: Prevent XSS with proper escaping
impact: CRITICAL
impactDescription: prevents script injection attacks
tags: security, xss, blade
---

## Prevent XSS with proper escaping

Always escape user-generated content when rendering in templates.

**Bad:**
```php
// Vulnerable to XSS attacks
<div>{!! $user->bio !!}</div>
<p>{!! $comment->content !!}</p>
```

**Good:**
```php
// Properly escaped - safe from XSS
<div>{{ $user->bio }}</div>
<p>{{ $comment->content }}</p>
```

For JavaScript contexts, use @json:
```php
// Bad
<script>var data = {!! json_encode($userData) !!};</script>

// Good
<script>var data = @json($userData);</script>
```

If HTML is required, sanitize first:
```php
$post->content = Purify::clean($request->content);

// Then safe to use {!! !!}
<div>{!! $post->content !!}</div>
```
