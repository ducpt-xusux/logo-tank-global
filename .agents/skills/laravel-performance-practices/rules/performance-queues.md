---
title: Offload heavy tasks to queues
impact: MEDIUM
impactDescription: faster response times
tags: performance, queues, jobs
---

## Offload heavy tasks to queues

Move time-consuming operations to background queues.

**Bad:**
```php
public function register(RegisterRequest $request)
{
    $user = User::create($request->validated());

    // Blocks the response
    Mail::to($user)->send(new WelcomeEmail($user));
    $this->generateAvatar($user);

    return redirect('/dashboard');
}
```

**Good:**
```php
public function register(RegisterRequest $request)
{
    $user = User::create($request->validated());

    // Dispatched to queue - non-blocking
    SendWelcomeEmail::dispatch($user);
    GenerateAvatar::dispatch($user);

    return redirect('/dashboard');
}
```

Create queued job:
```php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function handle(): void
    {
        Mail::to($this->user)->send(new WelcomeEmail($this->user));
    }
}
```

Create with: `php artisan make:job SendWelcomeEmail`
