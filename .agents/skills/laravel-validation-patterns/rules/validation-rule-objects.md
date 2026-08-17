---
title: Create Rule objects for complex validation logic
impact: HIGH
impactDescription: reusable and testable validation
tags: validation, rules, custom-rules
---

## Create Rule objects for complex validation logic

Encapsulate complex validation in dedicated Rule classes.

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

Create with: `php artisan make:rule PhoneNumber`

Rule objects can accept constructor parameters for flexibility:
```php
new MaxWords(limit: 100)
new UniqueForUser(userId: $this->user()->id)
```
