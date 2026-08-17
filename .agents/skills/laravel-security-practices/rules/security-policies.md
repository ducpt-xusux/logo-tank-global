---
title: Use policies for model authorization
impact: HIGH
impactDescription: centralized and testable authorization
tags: security, authorization, policies
---

## Use policies for model authorization

Create policies for model-based authorization instead of inline checks.

**Bad:**
```php
public function update(Request $request, Post $post)
{
    if ($request->user()->id !== $post->user_id) {
        abort(403);
    }
    $post->update($request->validated());
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
}

// Controller
public function update(UpdatePostRequest $request, Post $post)
{
    $this->authorize('update', $post);
    $post->update($request->validated());
}
```

Create with: `php artisan make:policy PostPolicy --model=Post`

In Blade:
```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan
```
