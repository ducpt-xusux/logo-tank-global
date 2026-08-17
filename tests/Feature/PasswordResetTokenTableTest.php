<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PasswordResetTokenTableTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_the_password_reset_token_table_used_by_the_password_broker(): void
    {
        $this->assertTrue(Schema::hasTable('password_reset_tokens'));
        $this->assertTrue(Schema::hasColumns('password_reset_tokens', [
            'email',
            'token',
            'created_at',
        ]));
    }
}
