# Laravel API Contract Practices - Agent Guide

Version: 1.0.0 | Author: Claude Code

## Abstract

This guide provides comprehensive API contract best practices for Laravel applications. It covers resources, response shape consistency, pagination, and error handling.

---

## Table of Contents

1. [Response Structure](#1-response-structure) - HIGH
   - 1.1 [Use API resources for responses](#11-use-api-resources-for-responses)
   - 1.2 [Keep consistent response envelopes](#12-keep-consistent-response-envelopes)
2. [Pagination](#2-pagination) - HIGH
   - 2.1 [Paginate collections](#21-paginate-collections)
3. [Consistency](#3-consistency) - MEDIUM
   - 3.1 [Use resource collections for lists](#31-use-resource-collections-for-lists)
   - 3.2 [Standardize validation errors](#32-standardize-validation-errors)

---

## 1. Response Structure

### 1.1 Use API resources for responses

Transform models with API resources instead of returning raw models.

**Bad:**

```php
return User::query()->findOrFail($id);
```

**Good:**

```php
return new UserResource(User::query()->findOrFail($id));
```

### 1.2 Keep consistent response envelopes

Wrap data consistently so clients always know what to expect.

**Bad:**

```php
return [
    'id' => $user->id,
    'name' => $user->name,
];
```

**Good:**

```php
return [
    'data' => [
        'id' => $user->id,
        'name' => $user->name,
    ],
];
```

---

## 2. Pagination

### 2.1 Paginate collections

Use pagination for collection endpoints instead of returning all records.

**Bad:**

```php
return UserResource::collection(User::query()->latest()->get());
```

**Good:**

```php
return UserResource::collection(User::query()->latest()->paginate());
```

---

## 3. Consistency

### 3.1 Use resource collections for lists

Leverage resource collections to shape list responses.

**Bad:**

```php
return User::query()->latest()->paginate();
```

**Good:**

```php
return UserResource::collection(User::query()->latest()->paginate());
```

### 3.2 Standardize validation errors

Use Laravel's validation responses or a consistent error shape.

**Bad:**

```php
return response()->json(['error' => 'Invalid input'], 422);
```

**Good:**

```php
throw ValidationException::withMessages([
    'email' => ['Email is required.'],
]);
```

---

## Summary

| Rule | Impact | Key Action |
|------|--------|------------|
| api-resources | HIGH | Use API resources for responses |
| api-response-shape | HIGH | Keep consistent response envelopes |
| api-pagination | HIGH | Paginate collection endpoints |
| api-resource-collections | MEDIUM | Use resource collections for lists |
| api-errors | MEDIUM | Standardize validation errors |
