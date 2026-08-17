<?php

namespace App\Listeners;

use Laravel\Fortify\Events\TwoFactorAuthenticationConfirmed;

class TwoFactorConfirmed
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TwoFactorAuthenticationConfirmed $event): void
    {
        $user = $event->user;
        $user->forceFill([
            'two_factor_type' => config('fortify.two_factor_type.app'),
        ])->save();
    }
}
