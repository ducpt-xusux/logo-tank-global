# Laravel Validation Patterns - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive validation patterns for Laravel applications. It covers Form Requests, custom Rule objects, error messages, and conditional validation.

---

## Table of Contents

1. [Form Requests](#1-form-requests)
   - 1.1 [Always Use Form Requests](#11-always-use-form-requests) (HIGH)
   - 1.2 [Authorization in Requests](#12-authorization-in-requests) (HIGH)
2. [Custom Rules](#2-custom-rules)
   - 2.1 [Rule Objects](#21-rule-objects) (HIGH)
   - 2.2 [Custom Messages](#22-custom-messages) (HIGH)
3. [Advanced Patterns](#3-advanced-patterns)
   - 3.1 [Conditional Validation](#31-conditional-validation) (MEDIUM)

---

## 1. Form Requests

### 1.1 Always Use Form Requests

Extract validation logic into dedicated Form Request classes.

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

// Controller
class UserController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());
    }
}
```

Create Form Requests with Artisan:
```bash
php artisan make:request StoreUserRequest
```

### 1.2 Authorization in Requests

Implement authorization logic within Form Requests.

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

// Controller - clean and focused
class PostController extends Controller
{
    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->validated());
    }
}
```

---

## 2. Custom Rules

### 2.1 Rule Objects

Create Rule objects for complex validation logic.

**Bad:**
```php
public function rules(): array
{
    return [
        'phone' => ['required', 'regex:/^(\+84|0)[0-9]{9,10}$/'],
    ];
}
```

**Good:**
```php
// app/Rules/PhoneNumber.php
class PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!preg_match('/^(\+84|0)[0-9]{9,10}$/', $value)) {
            $fail('The :attribute must be a valid Vietnamese phone number.');
        }
    }
}

// Usage in Form Request
public function rules(): array
{
    return [
        'phone' => ['required', new PhoneNumber],
    ];
}
```

Create Rule with Artisan:
```bash
php artisan make:rule PhoneNumber
```

### 2.2 Custom Messages

Define clear, user-friendly error messages.

**Bad:**
```php
public function rules(): array
{
    return [
        'email' => ['required', 'email', 'unique:users'],
    ];
}
// Uses default Laravel messages
```

**Good:**
```php
public function rules(): array
{
    return [
        'email' => ['required', 'email', 'unique:users'],
    ];
}

public function messages(): array
{
    return [
        'email.required' => 'We need your email address to create your account.',
        'email.email' => 'Please enter a valid email address.',
        'email.unique' => 'This email is already registered. Try logging in instead.',
    ];
}

public function attributes(): array
{
    return [
        'email' => 'email address',
        'dob' => 'date of birth',
    ];
}
```

---

## 3. Advanced Patterns

### 3.1 Conditional Validation

Apply validation rules based on conditions.

**Bad:**
```php
public function rules(): array
{
    $rules = [
        'name' => ['required', 'string'],
    ];

    if ($this->input('is_company')) {
        $rules['company_name'] = ['required', 'string'];
        $rules['tax_id'] = ['required', 'string'];
    }

    return $rules;
}
```

**Good:**
```php
public function rules(): array
{
    return [
        'name' => ['required', 'string'],
        'is_company' => ['required', 'boolean'],
        'company_name' => ['required_if:is_company,true', 'string', 'max:255'],
        'tax_id' => ['required_if:is_company,true', 'string', 'max:50'],
    ];
}
```

Using `sometimes` for complex conditions:
```php
use Illuminate\Validation\Validator;

public function withValidator(Validator $validator): void
{
    $validator->sometimes('reason', 'required|max:500', function ($input) {
        return $input->status === 'rejected';
    });
}
```

Using `exclude_if` and `exclude_unless`:
```php
public function rules(): array
{
    return [
        'payment_type' => ['required', 'in:credit_card,bank_transfer'],
        'card_number' => ['exclude_unless:payment_type,credit_card', 'required', 'string'],
        'bank_account' => ['exclude_unless:payment_type,bank_transfer', 'required', 'string'],
    ];
}
```

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| validation-form-requests | HIGH | Always use Form Request classes |
| validation-authorize | HIGH | Implement authorization in requests |
| validation-rule-objects | HIGH | Create Rule objects for complex logic |
| validation-messages | HIGH | Define clear custom error messages |
| validation-conditional | MEDIUM | Use built-in conditional rules |
