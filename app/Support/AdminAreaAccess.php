<?php

namespace App\Support;

final class AdminAreaAccess
{
    public const ROLES = ['admin', 'designer'];

    public static function allows(?string $role): bool
    {
        return in_array($role, self::ROLES, true);
    }
}
