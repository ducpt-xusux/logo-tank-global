<?php

return [
    'groups' => [
        'admin' => [
            'admin.*',
            'logout',
            'password.confirm.store',
            'password.confirmation',
            'two-factor.*',
            'two-factor-email.*',
            'user-password.update',
            'user-profile-information.update',
            'log.client-error',
        ],
        'public' => [
            'public.*',
            'my-page.*',
            'checkout.*',
            'login',
            'login.store',
            'logout',
            'auth.social',
            'auth.social.callback',
            'forgot-password',
            'password.email',
            'password.reset',
            'password.update',
            'two-factor.login',
            'two-factor.login.persist',
            'two-factor.login.store',
            'sanctum.csrf-cookie',
            '404',
            'log.client-error',
        ],
    ],
];
