<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Controllers\MatakuliahController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\DashboardController;
use App\Models\Matakuliah;
use App\Http\Controllers\Mahasiswa\MateriMahasiswaController;

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
    // Dashboard untuk akademis dan dosen
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('akademis')
        ->name('dashboard');

    // Route untuk semua user (termasuk mahasiswa)
    Route::get('home', function () {
        return Inertia::render('welcome', [
            'matakuliah' => Matakuliah::with(['materi'])->get()
        ]);
    })->name('home');
    
    // Route untuk melihat dan download materi (untuk semua role)
    Route::get('materi/{kodematakuliah}/show', [MateriController::class, 'show'])
        ->name('materi.show');
    Route::get('materi/{materi}/preview', [MateriController::class, 'preview'])
        ->name('materi.preview');
    Route::get('download/materi/{materi}', [MateriController::class, 'download'])
        ->name('download.materi');
    Route::get('materi/{materi}/preview-pdf', [MateriController::class, 'previewPdf'])
        ->name('materi.preview-pdf');

    // Route untuk view materi harus didefinisikan SEBELUM resource route
    Route::get('materi/matakuliah/{kodematakuliah}', [MateriController::class, 'show'])
        ->name('materi.matakuliah');

    // Kemudian resource route
    Route::middleware(['akademis'])->group(function () {
        Route::resource('materi', MateriController::class)->except(['show']);
        Route::resource('user', UserController::class);
        Route::resource('matakuliah', MatakuliahController::class);
    });

    Route::get('/materi/{materi}/view', [MateriController::class, 'view'])->name('view.materi');
});

// Route khusus untuk mahasiswa
Route::middleware(['auth', 'role:mahasiswa'])->group(function () {
    Route::controller(MateriMahasiswaController::class)->group(function () {
        Route::get('mahasiswa/materi/{kodematakuliah}', 'show')->name('mahasiswa.materi.list');
        Route::get('mahasiswa/materi/{materi}/preview', 'preview')->name('mahasiswa.materi.preview');
        Route::get('mahasiswa/materi/{materi}/view', 'view')->name('mahasiswa.materi.view');
        Route::get('mahasiswa/materi/{materi}/download', 'download')->name('mahasiswa.materi.download');
        Route::get('mahasiswa/materi/{materi}/play', 'play')->name('mahasiswa.materi.play');
    });
});

// Include file route lainnya
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';