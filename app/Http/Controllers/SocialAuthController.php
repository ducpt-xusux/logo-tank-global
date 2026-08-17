<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\AdminAreaAccess;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Description: This function will redirect to the specified provider.
     *
     * @param  string  $provider
     * @return void
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Description: This function will handle the provider callback.
     *
     * @param  string  $provider
     * @return void
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            $user = User::where('email', $socialUser->getEmail())->first();

            if (! $user) {
                $user = User::create([
                    'name' => $socialUser->getName() ?? 'User',
                    'first_name' => $socialUser->user['given_name'] ?? $socialUser->user['first_name'] ?? $socialUser->getName(),
                    'last_name' => $socialUser->user['family_name'] ?? $socialUser->user['last_name'] ?? '',
                    'email' => $socialUser->getEmail(),
                    'password' => bcrypt(Str::random(16)),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'email_verified_at' => now(),
                ]);
            } elseif ($this->isAdminAreaUser($user)) {
                return redirect()
                    ->route('login')
                    ->with('error', 'このアカウントではソーシャルログインを使用できません。管理者ログインをご利用ください。');
            } else {
                // Cập nhật provider nếu chưa có
                if (! $user->provider_id) {
                    $user->update([
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                    ]);
                }
            }

            Auth::login($user);

            // Trở về trang trước đó hoặc về trang chủ /
            return response(
                '<script>
                    window.opener.location.reload(); 
                    window.close();
                </script>'
            );

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', ucfirst($provider).'でのログイン中にエラーが発生しました。'.$e->getMessage());
        }
    }

    private function isAdminAreaUser(User $user): bool
    {
        return AdminAreaAccess::allows($user->role);
    }
}
