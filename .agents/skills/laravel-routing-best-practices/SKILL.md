---
name: laravel-routing-best-practices
description: Laravel routing best practices for grouping, naming, and API versioning.
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Routing Best Practices

Guidelines for writing clean, maintainable routes in Laravel applications.

## When to apply

- Creating new routes or route files
- Refactoring route groups or middleware usage
- Designing versioned APIs
- Standardizing route names
- Implementing RESTful routes

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Route Structure | HIGH | `route-grouping`, `route-controller-only` |
| 2 | Naming & Versioning | HIGH | `route-naming`, `route-api-versioning` |
| 3 | Model Binding | MEDIUM | `route-model-binding` |

## Quick reference

### Priority 1 - Route Structure (HIGH impact)
- **route-grouping**: Group routes by prefix, name, and middleware
- **route-controller-only**: Keep routes files thin, use controllers

### Priority 2 - Naming & Versioning (HIGH impact)
- **route-naming**: Use consistent named routes
- **route-api-versioning**: Version APIs with route groups

### Priority 3 - Model Binding (MEDIUM impact)
- **route-model-binding**: Prefer implicit route model binding

## How to use

Reference individual rules in `.Codex/skills/laravel-routing-best-practices/rules/`
