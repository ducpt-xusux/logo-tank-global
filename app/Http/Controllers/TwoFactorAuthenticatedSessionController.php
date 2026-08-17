<?php

namespace App\Http\Controllers;

use App\Models\EmailTwoFactorToken;
use Laravel\Fortify\Contracts\FailedTwoFactorLoginResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse;
use Laravel\Fortify\Events\RecoveryCodeReplaced;
use Laravel\Fortify\Events\TwoFactorAuthenticationFailed;
use Laravel\Fortify\Events\ValidTwoFactorAuthenticationCodeProvided;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController as Base;
use Laravel\Fortify\Http\Requests\TwoFactorLoginRequest;

class TwoFactorAuthenticatedSessionController extends Base
{
    /**
     * Attempt to authenticate a new session using the two factor authentication code.
     */
    public function store(TwoFactorLoginRequest $request): mixed
    {
        $user = $request->challengedUser();

        if ($user->two_factor_type === config('fortify.two_factor_type.email')) {
            if (! $this->hasValidEmailCode($request)) {
                return app(FailedTwoFactorLoginResponse::class)->toResponse($request);
            }
        } else {
            if ($code = $request->validRecoveryCode()) {
                $user->replaceRecoveryCode($code);

                event(new RecoveryCodeReplaced($user, $code));
            } elseif (! $request->hasValidCode()) {
                event(new TwoFactorAuthenticationFailed($user));

                return app(FailedTwoFactorLoginResponse::class)->toResponse($request);
            }
        }

        event(new ValidTwoFactorAuthenticationCodeProvided($user));

        $this->guard->login($user, $request->remember());

        $request->session()->regenerate();

        return app(TwoFactorLoginResponse::class);
    }

    protected function hasValidEmailCode(TwoFactorLoginRequest $request): bool
    {
        $user = $request->challengedUser();
        $record = EmailTwoFactorToken::query()->where([
            'user_id' => $user->id,
            'token' => $request->code,
        ])->where('expires_at', '>', now())->first();

        if (! empty($record)) {
            EmailTwoFactorToken::query()->where('user_id', $user->id)->delete();
            $request->session()->forget('login.id');

            return true;
        }

        return false;
    }
}
