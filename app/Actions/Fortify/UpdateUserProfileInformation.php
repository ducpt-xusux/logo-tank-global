<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array<string, string>  $input
     *
     * @throws ValidationException
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ])->validate();

        $name = trim(($input['first_name'] ?? '') . ' ' . ($input['last_name'] ?? ''));

        if ($input['email'] !== $user->email &&
            $user instanceof MustVerifyEmail) {
            $this->updateVerifiedUser($user, $input, $name);
        } else {
            $user->forceFill([
                'name' => $name,
                'first_name' => $input['first_name'] ?? null,
                'last_name' => $input['last_name'] ?? null,
                'company_name' => $input['company_name'] ?? null,
                'address_line_1' => $input['address_line_1'] ?? null,
                'address_line_2' => $input['address_line_2'] ?? null,
                'postal_code' => $input['postal_code'] ?? null,
                'phone' => $input['phone'] ?? null,
                'email' => $input['email'],
            ])->save();
        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  array<string, string>  $input
     */
    protected function updateVerifiedUser(User $user, array $input, string $name): void
    {
        $user->forceFill([
            'name' => $name,
            'first_name' => $input['first_name'] ?? null,
            'last_name' => $input['last_name'] ?? null,
            'company_name' => $input['company_name'] ?? null,
            'address_line_1' => $input['address_line_1'] ?? null,
            'address_line_2' => $input['address_line_2'] ?? null,
            'postal_code' => $input['postal_code'] ?? null,
            'phone' => $input['phone'] ?? null,
            'email' => $input['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}
