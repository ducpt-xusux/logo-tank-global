<?php

namespace App\Actions\Fortify;

use App\Models\EmailTwoFactorToken;
use App\Notifications\Email2FALogin;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable as FortifyRedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\TwoFactorAuthenticatable;

class RedirectIfTwoFactorAuthenticatable extends FortifyRedirectIfTwoFactorAuthenticatable
{
    public function handle($request, $next)
    {
        $user = $this->validateCredentials($request);

        if (Fortify::confirmsTwoFactorAuthentication()) {
            if (
                $user->two_factor_type === config('fortify.two_factor_type.email') &&
                ! is_null(optional($user)->two_factor_confirmed_at)
            ) {
                $this->_sendEmailTwoFactorAuthentication($user, $request);
            }

            if (
                optional($user)->two_factor_secret &&
                ! is_null(optional($user)->two_factor_confirmed_at) &&
                in_array(TwoFactorAuthenticatable::class, class_uses_recursive($user))
            ) {
                return $this->twoFactorChallengeResponse($request, $user);
            } else {
                return $next($request);
            }
        }

        if ($user->two_factor_type === config('fortify.two_factor_type.email')) {
            $this->_sendEmailTwoFactorAuthentication($user, $request);
        }

        if (
            optional($user)->two_factor_secret &&
            in_array(TwoFactorAuthenticatable::class, class_uses_recursive($user))
        ) {
            return $this->twoFactorChallengeResponse($request, $user);
        }

        return $next($request);
    }

    protected function _sendEmailTwoFactorAuthentication($user, $request)
    {
        EmailTwoFactorToken::query()->where('user_id', $user->id)->delete();

        $otp = rand(100000, 999999);

        EmailTwoFactorToken::create([
            'user_id' => $user->id,
            'token' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        $user->notify(new Email2FALogin($otp));

        return $this->twoFactorChallengeResponse($request, $user);
    }
}
