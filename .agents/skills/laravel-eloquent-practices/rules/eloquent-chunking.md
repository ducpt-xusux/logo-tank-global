---
title: Process large datasets in chunks
impact: MEDIUM
impactDescription: prevents memory exhaustion
tags: eloquent, performance, memory
---

## Process large datasets in chunks

Use chunking to process large datasets without loading everything into memory.

**Bad:**
```php
// Loads all records into memory at once
$users = User::all();
foreach ($users as $user) {
    $user->sendNewsletter();
}
```

**Good:**
```php
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        $user->sendNewsletter();
    }
});
```

When updating records during chunking, use `chunkById`:
```php
User::where('active', true)->chunkById(100, function ($users) {
    foreach ($users as $user) {
        $user->update(['notified_at' => now()]);
    }
});
```

For lazy collections:
```php
User::lazy()->each(fn($user) => $user->processData());
```
