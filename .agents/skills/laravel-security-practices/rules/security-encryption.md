---
title: Encrypt sensitive data properly
impact: HIGH
impactDescription: protects sensitive data at rest
tags: security, encryption, data-protection
---

## Encrypt sensitive data properly

Use Laravel's encryption for sensitive data.

**Bad:**
```php
class User extends Model
{
    // Sensitive data stored in plain text
}

$user->ssn = $request->ssn;
$user->save();
```

**Good:**
```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'ssn' => 'encrypted',
            'credit_card' => 'encrypted',
            'medical_info' => 'encrypted:array',
        ];
    }
}

// Automatically encrypted/decrypted
$user->ssn = $request->ssn;
$user->save();

echo $user->ssn; // Decrypted automatically
```

For manual encryption:
```php
use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($sensitiveData);
$decrypted = Crypt::decryptString($encrypted);
```

Important:
- Never log sensitive data
- Use HTTPS in production
- Rotate APP_KEY periodically
