<?php

namespace App\Providers;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\UserProvider as UserProviderContract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class UserProvider extends EloquentUserProvider implements UserProviderContract
{
    /**
     * Retrieve a user by the given credentials.
     *
     * @return Builder|Model|object|void|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        // Make changes
        if (empty($credentials)) {
            return;
        }
        $a = 1;

        // First we will add each credential element to the query as a where clause.
        // Then we can execute the query and, if we found a user, return it in a
        // Eloquent User "model" that will be utilized by the Guard instances.
        $query = $this->createModel()->newQuery();

        foreach ($credentials as $key => $value) {
            if (! Str::contains($key, 'password')) {
                $query->where($key, $value);
            }
        }
        $query->whereNotNull('email_verified_at');

        return $query->first();
    }
}
