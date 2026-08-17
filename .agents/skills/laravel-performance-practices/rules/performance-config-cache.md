---
title: Cache config and routes in production
impact: HIGH
impactDescription: faster bootstrap time
tags: performance, caching, deployment
---

## Cache config and routes in production

Cache configuration and routes for faster boot times.

**For production deployment:**
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Cache events
php artisan event:cache
```

**Clear when needed:**
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

Add to deployment scripts:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

Note: Never use `config:cache` in development - it prevents `.env` changes from taking effect.
