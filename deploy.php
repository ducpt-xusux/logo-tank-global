<?php

namespace Deployer;

require 'recipe/laravel.php';

// Config

set('repository', 'git@github.com:Xusux/base.git');
set('branch', 'master');

add('shared_files', ['.env']);
add('shared_dirs', ['storage']);
add('writable_dirs', [
    'storage',
    'storage/app',
    'storage/framework',
    'storage/logs',
    'bootstrap/cache',
]);

set('writable_mode', 'chmod');

// Hosts

host('production')
    ->setHostname('162.43.47.163')
    ->set('remote_user', 'ubuntu')
    ->set('deploy_path', '~/xusux/base');

set('keep_releases', 5);

task('build:frontend', function () {
    // Chạy trong thư mục release hiện tại
    run('cd {{release_path}} && yarn install --frozen-lockfile');
    run('cd {{release_path}} && yarn build');
});
after('deploy:vendors', 'build:frontend');

// ---------------------------------------------
// 5. OPTIMIZE + STORAGE LINK
// ---------------------------------------------
after('deploy:vendors', 'artisan:storage:link');
after('deploy:vendors', 'artisan:view:cache');
after('deploy:vendors', 'artisan:config:cache');

after('deploy:publish', 'artisan:migrate');
// Hooks

after('deploy:failed', 'deploy:unlock');
