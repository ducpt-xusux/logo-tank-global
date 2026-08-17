---
title: Use conditional validation rules
impact: MEDIUM
impactDescription: cleaner conditional logic
tags: validation, conditional, rules
---

## Use conditional validation rules

Use Laravel's built-in conditional rules instead of manual if statements.

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

For complex conditions use `sometimes`:
```php
public function withValidator(Validator $validator): void
{
    $validator->sometimes('reason', 'required|max:500', function ($input) {
        return $input->status === 'rejected';
    });
}
```

Available conditional rules:
- `required_if`, `required_unless`
- `required_with`, `required_without`
- `exclude_if`, `exclude_unless`
- `prohibited_if`, `prohibited_unless`
