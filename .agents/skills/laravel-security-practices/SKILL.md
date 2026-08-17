---
name: laravel-security-practices
description: Security best practices for Laravel - XSS prevention, CSRF, mass assignment, and authorization
license: MIT
metadata:
  author: Codex
  version: "1.0.0"
---

# Laravel Security Practices

Guidelines for building secure Laravel applications.

## When to apply

- Handling user input
- Rendering user-generated content
- Implementing authentication and authorization
- Working with sensitive data
- Building APIs

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Input Security | CRITICAL | `security-xss`, `security-mass-assignment` |
| 2 | Authorization | HIGH | `security-policies`, `security-gates` |
| 3 | Data Protection | HIGH | `security-encryption` |

## Quick reference

### Priority 1 - Input Security (CRITICAL impact)
- **security-xss**: Prevent XSS with proper escaping
- **security-mass-assignment**: Protect against mass assignment

### Priority 2 - Authorization (HIGH impact)
- **security-policies**: Use policies for model authorization
- **security-gates**: Define gates for action-based authorization

### Priority 3 - Data Protection (HIGH impact)
- **security-encryption**: Encrypt sensitive data properly

## How to use

Reference individual rules in `.Codex/skills/laravel-security-practices/rules/`
