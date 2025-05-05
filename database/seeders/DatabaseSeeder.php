<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        User::create([
            'name' => 'Akademis',
            'username' => 'akademis',
            'email' => 'akademis@jayanusa.ac.id',
            'password' => Hash::make('password'),
            'role' => 'akademis',
        ]);
    
        User::create([
            'name' => 'Mahasiswa',
            'username' => '2010036',
            'email' => '2010036@jayanusa.ac.id',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa',
        ]);
        $this->call([
            MahasiswaSeeder1::class,
            MahasiswaSeeder2::class,
            MahasiswaSeeder3::class,
            MahasiswaSeeder4::class,
            MahasiswaSeeder5::class,
            MahasiswaSeeder6::class,
            MahasiswaSeeder7::class,
            MahasiswaSeeder8::class,
            MahasiswaSeeder9::class,
            MahasiswaSeeder10::class,
            MahasiswaSeeder11::class,
        ]);
        
    }
}
