---
name: laravel-validation-patterns
description: Best practices for Laravel validation - Form Requests, custom rules, and error handling
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Validation Patterns

Guidelines for implementing robust validation in Laravel applications.

## When to apply

- Creating or updating Form Request classes
- Implementing custom validation rules
- Handling validation errors
- Building API validation responses
- Complex conditional validation

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Form Requests | HIGH | `validation-form-requests`, `validation-authorize` |
| 2 | Custom Rules | HIGH | `validation-rule-objects`, `validation-messages` |
| 3 | Advanced Patterns | MEDIUM | `validation-conditional` |

## Quick reference

### Priority 1 - Form Requests (HIGH impact)
- **validation-form-requests**: Always use Form Request classes
- **validation-authorize**: Implement authorization in requests

### Priority 2 - Custom Rules (HIGH impact)
- **validation-rule-objects**: Create Rule objects for complex logic
- **validation-messages**: Define clear custom error messages

### Priority 3 - Advanced Patterns (MEDIUM impact)
- **validation-conditional**: Use conditional validation rules

## How to use

Reference individual rules in `.Codex/skills/laravel-validation-patterns/rules/`
