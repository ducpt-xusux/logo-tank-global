<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Mail\SendForgotPasswordMail;
use App\Models\EmailTwoFactorToken;
use App\Models\User;
use App\Notifications\Email2FA;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Fortify;

class AuthController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('admin/login');
    }

    /**
     * @throws ValidationException
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function profile()
    {
        return Inertia::render('admin/profile', []);
    }

    public function security()
    {
        return Inertia::render('admin/security');
    }

    /**
     * @throws ValidationException
     */
    public function confirmEmail2FA(): JsonResponse|RedirectResponse
    {
        $code = request()->input('code');
        $user = Auth::user();

        $record = EmailTwoFactorToken::query()
            ->where([
                'user_id' => $user->id,
                'token' => $code,
            ])
            ->where('expires_at', '>', now())
            ->first();

        if (empty($record)) {
            throw ValidationException::withMessages([
                'code' => [
                    __(
                        'The provided two factor authentication code was invalid.',
                    ),
                ],
            ]);
        }

        EmailTwoFactorToken::query()->where('user_id', $user->id)->delete();
        $user
            ->forceFill([
                'two_factor_confirmed_at' => now(),
                'two_factor_type' => config('fortify.two_factor_type.email'),
            ])
            ->save();

        return request()->wantsJson()
            ? new JsonResponse('', 200)
            : back()->with(
                'status',
                Fortify::TWO_FACTOR_AUTHENTICATION_CONFIRMED,
            );
    }

    public function sendEmail2FA(): JsonResponse
    {
        $user = Auth::user();
        EmailTwoFactorToken::query()->where('user_id', $user->id)->delete();

        $otp = rand(100000, 999999);

        EmailTwoFactorToken::create([
            'user_id' => $user->id,
            'token' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        $user->notify(new Email2FA($otp));

        return response()->json([
            'status' => 'OK',
        ]);
    }

    public function updateProfile()
    {
        $input = request()->all();
        $user = Auth::user();
        Validator::make(request()->all(), [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ])->validate();

        $user
            ->forceFill([
                'name' => $input['name'],
                'email' => $input['email'],
            ])
            ->save();

        return request()->wantsJson()
            ? new JsonResponse('', 200)
            : back()->with('status', Fortify::PROFILE_INFORMATION_UPDATED);
    }

    /**
     * Generate a link and send mail with link to user.
     */
    public function generateLinkForgot(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => __('We could not find a user with that email address.'),
        ]);

        User::where('email', $request->email)->firstOrFail();

        // Generate Token
        $token = Str::random(60);

        // Save Token to DB
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => $token,
                'created_at' => Carbon::now(),
            ]
        );

        // Generate Link
        $locale = $this->resolvePasswordResetLocale($request);
        app()->setLocale($locale);

        $resetLink = route('password.reset', [
            'locale' => $locale,
            'token' => $token,
            'email' => $request->email,
        ]);

        // Send Email
        Mail::to($request->email)
            ->locale($locale)
            ->send(new SendForgotPasswordMail($resetLink));

        return back()->with('status', __('We have emailed your password reset link!'));
    }

    private function resolvePasswordResetLocale(Request $request): string
    {
        $supportedLocales = ['en', 'ja', 'vi'];
        $requestLocale = $request->input('locale');

        if (is_string($requestLocale) && in_array($requestLocale, $supportedLocales, true)) {
            return $requestLocale;
        }

        $referer = $request->headers->get('referer');
        $refererPath = is_string($referer) ? parse_url($referer, PHP_URL_PATH) : null;
        $refererLocale = is_string($refererPath) ? explode('/', trim($refererPath, '/'))[0] ?? null : null;

        if (is_string($refererLocale) && in_array($refererLocale, $supportedLocales, true)) {
            return $refererLocale;
        }

        $routeLocale = $request->route('locale');

        if (is_string($routeLocale) && in_array($routeLocale, $supportedLocales, true)) {
            return $routeLocale;
        }

        return in_array(app()->getLocale(), $supportedLocales, true) ? app()->getLocale() : 'en';
    }

    public function passwordReset(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (! $resetRecord) {
            return back()->withErrors(['email' => __('This password reset token is invalid.')]);
        }

        // Check if token is expired (720 minutes = 12 hours)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(Carbon::now()) > 720) {
            DB::table('password_resets')->where('email', $request->email)->delete();

            return back()->withErrors(['email' => __('This password reset token is invalid.')]);
        }

        // Update password
        $user = User::where('email', $request->email)->firstOrFail();
        $user->forceFill([
            'password' => Hash::make($request->password),
        ]);

        $user->save();
        // Delete reset record
        DB::table('password_resets')->where('email', $request->email)->delete();

        $locale = $this->resolvePasswordResetLocale($request);

        return redirect()
            ->route('public.home', [
                'locale' => $locale,
                'show_login' => 'true',
            ])
            ->with('success', 'パスワードが再設定されました。ログインしてください。');
    }
}
