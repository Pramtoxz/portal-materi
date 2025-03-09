<?php

namespace App\Http\Controllers;

use App\Models\Materi;
use App\Models\Matakuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MateriController extends Controller
{
    public function index()
    {
        return Inertia::render('Materi/SelectMatakuliah', [
            'matakuliah' => Matakuliah::all()
        ]);
    }

    public function show($kodematakuliah)
    {
        $matakuliah = Matakuliah::where('kodematakuliah', $kodematakuliah)->firstOrFail();
        $materi = Materi::where('kodematakuliah', $kodematakuliah)
            ->paginate(10);

        return Inertia::render('Materi/Index', [
            'matakuliah' => $matakuliah,
            'materi' => $materi
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kodematakuliah' => 'required|exists:matakuliah,kodematakuliah',
            'namamateri' => 'required|string|max:255',
            'filemateri' => 'nullable|file|max:10240', // Max 10MB
            'linkmateri' => 'nullable|url',
            'keterangan' => 'nullable|string'
        ]);

        if ($request->hasFile('filemateri')) {
            // Gunakan nama file asli dari klien
            $filename = $request->file('filemateri')->getClientOriginalName();
            $path = $request->file('filemateri')->storeAs('public/materi', $filename);
            $validated['filemateri'] = str_replace('public/', '', $path);
        }

        Materi::create($validated);

        return redirect()->back()->with('success', 'Materi berhasil ditambahkan');
    }

    public function update(Request $request, Materi $materi)
    {
        $validated = $request->validate([
            'namamateri' => 'required|string|max:255',
            'filemateri' => 'nullable|file|max:10240',
            'linkmateri' => 'nullable|url',
            'keterangan' => 'nullable|string'
        ]);

        if ($request->hasFile('filemateri')) {
            // Hapus file lama jika ada
            if ($materi->filemateri) {
                Storage::delete('public/' . $materi->filemateri);
            }
            
            // Gunakan nama file asli dari klien
            $filename = $request->file('filemateri')->getClientOriginalName();
            $path = $request->file('filemateri')->storeAs('public/materi', $filename);
            $validated['filemateri'] = str_replace('public/', '', $path);
        }

        $materi->update($validated);

        return redirect()->back()->with('success', 'Materi berhasil diperbarui');
    }

    public function destroy(Materi $materi)
    {
        if ($materi->filemateri) {
            Storage::delete($materi->filemateri);
        }
        
        $materi->delete();

        return redirect()->back()->with('success', 'Materi berhasil dihapus');
    }

    public function download(Materi $materi)
    {
        $path = storage_path('app/public/' . $materi->filemateri);
        
        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan');
        }
        
        return response()->download($path);
    }

    public function preview(Materi $materi)
    {
        return Inertia::render('Materi/Preview', [
            'materi' => $materi->load('matakuliah'),
        ])->withViewData([
            'headers' => [
                'Content-Security-Policy' => "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *; frame-src 'self' blob: data: *"
            ]
        ]);
    }

    public function previewPdf(Materi $materi)
    {
        if (!$materi->filemateri) {
            abort(404);
        }
        
        $path = storage_path('app/public/' . $materi->filemateri);
        
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$materi->namamateri.'.pdf"'
        ]);
    }

    public function view(Materi $materi)
    {
        $path = storage_path('app/public/' . $materi->filemateri);
        return response()->file($path);
    }
}
