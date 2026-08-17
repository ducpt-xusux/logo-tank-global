---
name: laravel-testing-patterns
description: Best practices for Laravel testing with Pest - feature tests, unit tests, and mocking patterns
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Testing Patterns

Guidelines for writing effective tests in Laravel applications using Pest.

## When to apply

- Writing feature or unit tests
- Testing API endpoints
- Testing Eloquent models
- Mocking dependencies
- Testing with factories

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Test Structure | HIGH | `testing-pest-syntax`, `testing-factories` |
| 2 | HTTP Testing | HIGH | `testing-http`, `testing-assertions` |
| 3 | Advanced Patterns | MEDIUM | `testing-mocking` |

## Quick reference

### Priority 1 - Test Structure (HIGH impact)
- **testing-pest-syntax**: Use Pest syntax consistently
- **testing-factories**: Use factories for model creation

### Priority 2 - HTTP Testing (HIGH impact)
- **testing-http**: Test HTTP endpoints thoroughly
- **testing-assertions**: Use specific assertion methods

### Priority 3 - Advanced Patterns (MEDIUM impact)
- **testing-mocking**: Mock external dependencies properly

## How to use

Reference individual rules in `.Codex/skills/laravel-testing-patterns/rules/`
