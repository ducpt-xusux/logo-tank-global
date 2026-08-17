<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class FortifyProfileInformationUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_profile_information_can_be_updated_through_fortify(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'current@example.com',
            'email_verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->put('/user/profile-information', [
                'first_name' => 'Taro',
                'last_name' => 'Yamada',
                'company_name' => 'Logo Tank',
                'address_line_1' => 'Tokyo 1-1',
                'address_line_2' => 'Building 2F',
                'postal_code' => '1000001',
                'phone' => '0312345678',
                'email' => 'updated@example.com',
            ]);

        $response->assertSessionHasNoErrors();

        $user->refresh();

        $this->assertSame('Taro Yamada', $user->name);
        $this->assertSame('Taro', $user->first_name);
        $this->assertSame('Yamada', $user->last_name);
        $this->assertSame('Logo Tank', $user->company_name);
        $this->assertSame('Tokyo 1-1', $user->address_line_1);
        $this->assertSame('Building 2F', $user->address_line_2);
        $this->assertSame(1000001, $user->postal_code);
        $this->assertSame('0312345678', $user->phone);
        $this->assertSame('updated@example.com', $user->email);
        $this->assertNull($user->email_verified_at);

        Notification::assertSentTo($user, VerifyEmail::class);
    }
}
