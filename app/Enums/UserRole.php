<?php

namespace App\Enums;

enum UserRole: int
{
    case User = 1;
    case Manager = 2;
    case Admin = 6;

    public function label(): string
    {
        return match ($this) {
            self::User => 'ユーザー',
            self::Manager => 'マネジャー',
            self::Admin => 'アドミン',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function options(): array
    {
        return array_map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], self::cases());
    }

    public static function labelFromValue(int $value): ?string
    {
        foreach (self::cases() as $case) {
            if ($case->value === $value) {
                return $case->label();
            }
        }

        return null;
    }
}
