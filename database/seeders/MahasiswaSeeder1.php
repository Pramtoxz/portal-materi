<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder1 extends Seeder
{
    public function run()
    {
        $mahasiswa = [
            ['username' => '2000335', 'name' => 'DANI MUKHLIS'],
            ['username' => '2400007', 'name' => 'NADIA TERESA'],
            ['username' => '2300013', 'name' => 'HARISKI SAPUTRA'],
            ['username' => '2200012', 'name' => 'FADLI ANSYARI'],
            ['username' => '2400008', 'name' => 'NURFADYLLAH'],
            ['username' => '2300008', 'name' => 'RINA SILVIA'],
            ['username' => '2300006', 'name' => 'Muhamad Yunus'],
            ['username' => '2400004', 'name' => 'ZAFRAN ALFARRAS'],
            ['username' => '2200016', 'name' => 'NADIA OKTAVINDA'],
            ['username' => '2200001', 'name' => 'DINI ULANDARI'],
            ['username' => '2300009', 'name' => 'ROJI PALENIA PUTRI'],
            ['username' => '2300005', 'name' => 'Dirgha Caprio Sandes'],
            ['username' => '2200017', 'name' => 'NESRI YULIARTI MARKIS'],
            ['username' => '2300016', 'name' => 'Ratih Syafarti Hotri'],
            ['username' => '2400014', 'name' => 'ANNISA AFRIOLA'],
            ['username' => '2400006', 'name' => 'SITI SALSA ANJELINA'],
            ['username' => '2400009', 'name' => 'M. VADILAH ICHSAN VERNANDO'],
            ['username' => '2200020', 'name' => 'RAHMAT ARDIAN'],
            ['username' => '2300010', 'name' => 'Terik Bakar Buana'],
            ['username' => '2200018', 'name' => 'NUR AZIZAH'],
            ['username' => '2200008', 'name' => 'DEA AMANDA'],
            ['username' => '2200026', 'name' => 'M. HUSAIN FARRAS'],
            ['username' => '2200023', 'name' => 'HAYATUL FAUZI'],
            ['username' => '2200004', 'name' => 'MUHAMMAD ILHAM'],
            ['username' => '2200011', 'name' => 'DINDA GUSTI KHAIRANI'],
        ];

        foreach ($mahasiswa as $data) {
            User::create([
                'username' => $data['username'],
                'name' => $data['name'],
                'password' => Hash::make('jayanusa'),
                'email' => $data['username'] . '@jayanusa.ac.id',
                'role' => 'mahasiswa'
            ]);
        }
    }
} 