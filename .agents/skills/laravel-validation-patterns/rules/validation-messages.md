---
title: Define clear custom error messages
impact: HIGH
impactDescription: better user experience
tags: validation, messages, ux
---

## Define clear custom error messages

Provide user-friendly validation messages instead of defaults.

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

Good messages are:
- Written in plain language
- Actionable (tell users what to do)
- Context-aware (reference specific fields)
