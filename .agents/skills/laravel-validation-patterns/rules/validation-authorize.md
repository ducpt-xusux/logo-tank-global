---
title: Implement authorization in Form Requests
impact: HIGH
impactDescription: centralized authorization logic
tags: validation, authorization, form-requests
---

## Implement authorization in Form Requests

Use the `authorize()` method in Form Requests instead of checking in controllers.

**Bad:**
```php
class PostController extends Controller
{
    public function update(UpdatePostRequest $request, Post $post)
    {
        if ($request->user()->cannot('update', $post)) {
            abort(403);
        }

        $post->update($request->validated());
    }
}
```

**Good:**
```php
class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('post'));
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ];
    }
}

// Controller is clean and focused
class PostController extends Controller
{
    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->validated());
    }
}
```
