---
name: laravel-migration-patterns
description: Best practices for Laravel database migrations - schema design, safe operations, and rollback strategies
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Migration Patterns

Guidelines for writing safe and maintainable database migrations.

## When to apply

- Creating new database tables
- Modifying existing schema
- Adding indexes and constraints
- Handling data migrations
- Planning rollback strategies

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Schema Safety | CRITICAL | `migration-safe-changes`, `migration-nullable` |
| 2 | Performance | HIGH | `migration-indexes`, `migration-foreign-keys` |
| 3 | Best Practices | MEDIUM | `migration-naming` |

## Quick reference

### Priority 1 - Schema Safety (CRITICAL impact)
- **migration-safe-changes**: Make non-breaking schema changes
- **migration-nullable**: Handle nullable columns properly

### Priority 2 - Performance (HIGH impact)
- **migration-indexes**: Add indexes for query optimization
- **migration-foreign-keys**: Define foreign key constraints

### Priority 3 - Best Practices (MEDIUM impact)
- **migration-naming**: Follow naming conventions

## How to use

Reference individual rules in `.Codex/skills/laravel-migration-patterns/rules/`
