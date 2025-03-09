<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\MatakuliahController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Storage;

// Redirect root ke login
Route::get('/', function () {
    return Redirect::route('login');
});

// Route untuk download (hanya untuk mahasiswa dan akademis)
Route::middleware(['auth', 'role:mahasiswa,akademis,dosen'])->group(function () {
    Route::get('materi/{materi}/preview', [MateriController::class, 'preview'])
        ->name('materi.preview');
    Route::get('download/materi/{materi}', [MateriController::class, 'download'])
        ->name('download.materi');
    Route::get('materi/{materi}/preview-pdf', [MateriController::class, 'previewPdf'])
        ->name('materi.preview-pdf');
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
        Route::resource('user', UserController::class);
    });

    // Route CRUD (hanya untuk dosen dan akademis)
    Route::middleware(['auth', 'role:dosen,akademis'])->group(function () {
        Route::resource('materi', MateriController::class);
        Route::get('materi/matakuliah/{kodematakuliah}', [MateriController::class, 'show'])
            ->name('materi.matakuliah');
    });

    Route::get('/materi/{materi}/view', [MateriController::class, 'view'])->name('view.materi');
});

// Include file route lainnya
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';