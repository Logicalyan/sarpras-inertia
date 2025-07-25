<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('users/export', [UserController::class, 'export'])->name('users.export');
    Route::post('users/import', [UserController::class, 'import'])->name('users.import');
    Route::get('users/template', [UserController::class, 'template'])->name('users.template');


    Route::resource('users', UserController::class)->except(['show']);
    Route::delete('users', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
