---
name: laravel-performance-practices
description: Performance optimization for Laravel - caching, query optimization, and resource management
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Performance Practices

Guidelines for optimizing Laravel application performance.

## When to apply

- Optimizing database queries
- Implementing caching strategies
- Reducing memory usage
- Improving response times
- Handling high traffic

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Optimization | HIGH | `performance-eager-loading`, `performance-select` |
| 2 | Caching | HIGH | `performance-cache`, `performance-config-cache` |
| 3 | Resource Management | MEDIUM | `performance-queues` |

## Quick reference

### Priority 1 - Query Optimization (HIGH impact)
- **performance-eager-loading**: Prevent N+1 with eager loading
- **performance-select**: Select only needed columns

### Priority 2 - Caching (HIGH impact)
- **performance-cache**: Cache expensive operations
- **performance-config-cache**: Cache config in production

### Priority 3 - Resource Management (MEDIUM impact)
- **performance-queues**: Offload work to queues

## How to use

Reference individual rules in `.Codex/skills/laravel-performance-practices/rules/`
