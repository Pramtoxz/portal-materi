<?php

namespace App\Http\Controllers;

use App\Models\Matakuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatakuliahController extends Controller
{
    public function index()
    {
        $matakuliah = Matakuliah::paginate(10);
        return Inertia::render('Matakuliah/Index', [
            'matakuliah' => $matakuliah
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kodematakuliah' => 'required|unique:matakuliah',
            'namamatakuliah' => 'required',
            'sks' => 'required|numeric',
            'semester' => 'required|in:Ganjil,Genap'
        ]);

        Matakuliah::create($request->all());
        return redirect()->route('matakuliah.index')->with('success', 'Matakuliah berhasil ditambahkan');
    }

    public function update(Request $request, Matakuliah $matakuliah)
    {
        $request->validate([
            'kodematakuliah' => 'required|unique:matakuliah,kodematakuliah,'.$matakuliah->kodematakuliah.',kodematakuliah',
            'namamatakuliah' => 'required',
            'sks' => 'required|numeric',
            'semester' => 'required|in:Ganjil,Genap'
        ]);

        $matakuliah->update($request->all());
        return redirect()->route('matakuliah.index')->with('success', 'Matakuliah berhasil diperbarui');
    }

    public function destroy(Matakuliah $matakuliah)
    {
        $matakuliah->delete();
        return redirect()->route('matakuliah.index')->with('success', 'Matakuliah berhasil dihapus');
    }
}
