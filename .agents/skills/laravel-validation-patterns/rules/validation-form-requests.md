---
title: Always use Form Request classes for validation
impact: HIGH
impactDescription: cleaner controllers and reusable validation
tags: validation, form-requests, controllers
---

## Always use Form Request classes for validation

Extract validation logic into dedicated Form Request classes instead of inline validation.

**Bad:**
```php
class UserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        User::create($validated);
    }
}
```

**Good:**
```php
// app/Http/Requests/StoreUserRequest.php
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }
}

// Controller stays clean
class UserController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());
    }
}
```

Create with: `php artisan make:request StoreUserRequest`
