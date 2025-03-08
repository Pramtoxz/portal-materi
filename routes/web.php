<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\MatakuliahController;
use App\Http\Controllers\MateriController;

// Redirect root ke login
Route::get('/', function () {
    return Redirect::route('logout');
});

// Route untuk pengguna yang sudah login
Route::middleware(['auth', 'verified'])->group(function () {
    // Route untuk semua user
    Route::get('home', function () {
        return Inertia::render('welcome');
    })->name('home');
    
    // Route untuk akademis
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware(['auth', 'akademis']);

    // Route untuk mahasiswa
    Route::get('mahasiswa', function () {
        return Inertia::render('mahasiswa');
    })->name('mahasiswa');

    // Route untuk akademis
    Route::middleware(['akademis'])->group(function () {
        Route::resource('matakuliah', MatakuliahController::class);
        Route::resource('materi', MateriController::class);
    });
});

// Include file route lainnya
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';