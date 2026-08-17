---
name: laravel-eloquent-practices
description: Best practices for Laravel Eloquent ORM - query optimization, relationships, and model patterns
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Eloquent Best Practices

Guidelines for writing efficient, maintainable Eloquent code in Laravel applications.

## When to apply

- Building or refactoring Eloquent models
- Writing database queries with Eloquent
- Defining model relationships
- Optimizing query performance
- Working with large datasets

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Structure | HIGH | `eloquent-prefer-models`, `eloquent-eager-loading` |
| 2 | Relationships | HIGH | `eloquent-relations`, `eloquent-scopes` |
| 3 | Data Volume | MEDIUM | `eloquent-chunking`, `eloquent-date-casts` |

## Quick reference

### Priority 1 - Query Structure (HIGH impact)
- **eloquent-prefer-models**: Use `Model::query()` over `DB::` facade
- **eloquent-eager-loading**: Prevent N+1 with `with()` and `load()`

### Priority 2 - Relationships (HIGH impact)
- **eloquent-relations**: Define typed relationship methods
- **eloquent-scopes**: Extract reusable query logic into scopes

### Priority 3 - Data Volume (MEDIUM impact)
- **eloquent-chunking**: Process large datasets in chunks
- **eloquent-date-casts**: Use proper date casting for datetime columns

## How to use

Reference individual rules in `.Codex/skills/laravel-eloquent-practices/rules/`
