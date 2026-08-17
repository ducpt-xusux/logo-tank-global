---
name: laravel-api-contract-practices
description: Laravel API contract practices using resources and pagination based on community guidance.
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel API Contract Practices

Guidelines for building consistent and maintainable API contracts in Laravel applications.

## When to apply

- Creating API endpoints or resources
- Standardizing response shapes
- Adding pagination for collections
- Versioning API outputs
- Building RESTful APIs

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Response Structure | HIGH | `api-resources`, `api-response-shape` |
| 2 | Pagination | HIGH | `api-pagination` |
| 3 | Consistency | MEDIUM | `api-resource-collections`, `api-errors` |

## Quick reference

### Priority 1 - Response Structure (HIGH impact)
- **api-resources**: Transform models with API resources
- **api-response-shape**: Keep consistent response envelopes

### Priority 2 - Pagination (HIGH impact)
- **api-pagination**: Paginate collection endpoints

### Priority 3 - Consistency (MEDIUM impact)
- **api-resource-collections**: Use resource collections for lists
- **api-errors**: Standardize validation errors

## How to use

Reference individual rules in `.Codex/skills/laravel-api-contract-practices/rules/`
