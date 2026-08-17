<?php

use App\Http\Controllers\AddressSearchController;
use App\Http\Controllers\Admin\LogoController as AdminLogoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\IndustryController;
use App\Http\Controllers\KeywordController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\LogoImageController;
use App\Http\Controllers\LogoZipController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TasteController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\LogoController as UserLogoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'admin.area'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashBoardController::class, 'index'])->name(
            'dashboard',
        );

        Route::get('/logo', [AdminLogoController::class, 'show'])->name('logo');
        Route::post('/logo', [AdminLogoController::class, 'storeDetail'])->name(
            'logo.store',
        );
        Route::get('/logo/{logo}', [AdminLogoController::class, 'detail'])->name(
            'logo.detail',
        );
        Route::patch('/logo/{logo}', [AdminLogoController::class, 'updateDetail'])
            ->name('logo.update');
        Route::post('/logo/{logo}/categories', [
            AdminLogoController::class,
            'updateCategories',
        ])->name('logo.update-categories');

        Route::post('/logo/{logoId}/update-state', [
            AdminLogoController::class,
            'updateState',
        ])->name('logo.update-state');

        Route::resource('color', ColorController::class);

        Route::resource('industry', IndustryController::class);

        Route::resource('log', LogController::class);

        Route::resource('order', OrderController::class);

        Route::post('/order/{order}/update-status', [
            OrderController::class,
            'updateStatusOrder',
        ])->name('order.update-status');

        Route::get('/order/{order}/status', [OrderController::class, 'status'])
            ->name('order.status');

        Route::post('/order/{order}/status', [OrderController::class, 'storeStatus'])
            ->name('order.store-status');

        Route::resource('logo-zip', LogoZipController::class);

        Route::resource('taste', TasteController::class);

        Route::resource('address-search', AddressSearchController::class);

        Route::resource('keyword', KeywordController::class);

        Route::resource('user', UserController::class);

        Route::get('/profile', [AuthController::class, 'profile'])->name(
            'profile',
        );
        Route::patch('/profile', [
            AuthController::class,
            'updateProfile',
        ])->name('profile.update');
        Route::get('/security', [AuthController::class, 'security'])->name(
            'security',
        );

        // Handle Logo Image
        Route::post('logo/{logoId}/image', [LogoImageController::class, 'updateImages'])->name('logo.update-images');
        Route::delete('logo/{logoId}/image/{sorter}', [LogoImageController::class, 'deleteImage'])->name('logo.delete-image');
    });

Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => 'en|vi|ja'],
    'middleware' => 'setlocale',
], function () {

    Route::name('public.')->group(
        function () {
            Route::get('/', [HomeController::class, 'index'])->name('home');
            Route::get('/logo/detail/{logo}', [UserLogoController::class, 'publicDetail'])->name('logo.detail');
            Route::get('/explore', [UserLogoController::class, 'explore'])->name('explore');
            Route::get('/my-page/cart', [OrderController::class, 'publicCart'])->name('my-page.cart');
            Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('contact-us');

            Route::get('/my-page/package-cart', [OrderController::class, 'packageCart'])->name('my-page.package-cart');

            Route::get('/motion-logo', [HomeController::class, 'motionLogo'])->name('motion-logo');
        }
    );

    Route::middleware('guest')->group(function () {
        Route::post('/forgot-password', [AuthController::class, 'generateLinkForgot'])->name('password.email');
        Route::get('/reset-password', function () {
            return inertia('auth/reset-password', [
                'token' => request('token'),
                'email' => request('email') ?? request('amp;email'),
            ]);
        })->name('password.reset');
        Route::post('/reset-password', [AuthController::class, 'passwordReset'])->name('password.update');
    });

    Route::middleware(['auth'])->group(
        function () {
            Route::get('/user-information', [HomeController::class, 'userInformation'])->name('user-information');
            Route::get('/my-page/customer-info', [UserController::class, 'customerInfo'])->name('my-page.customer-info');
            Route::get('/my-page/checkout', [OrderController::class, 'checkOut'])->name('my-page.checkout');
            Route::get('/my-page/package-checkout', [OrderController::class, 'packageCheckout'])->name('my-page.package-checkout');
            Route::get('/my-page/order-status/{order}', [OrderController::class, 'orderStatus'])->name('my-page.order-status');

            // submit cart data and calculate checkout summary on server
            Route::post('/checkout/process', [OrderController::class, 'processCheckout'])->name('checkout.process');
            Route::post('/checkout/process-package', [OrderController::class, 'processPackageCheckout'])->name('checkout.process-package');
            Route::post('/checkout/payment-intent', [UserController::class, 'createPaymentIntent'])->name('checkout.payment-intent');
            Route::post('/checkout/submit', [OrderController::class, 'submitCheckout'])->name('checkout.submit');
        }
    );

});

Route::get('/', function () {
    return redirect('/en');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/logo/{logo}/favorite', [UserLogoController::class, 'toggleFavorite'])->name('public.logo.favorite');
});
Route::get('/404', fn () => Inertia::render('not-found'))->name('404');

require __DIR__.'/auth.php';
