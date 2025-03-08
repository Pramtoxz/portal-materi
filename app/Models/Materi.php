<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    protected $table = 'materi';
    protected $primaryKey = 'id';
    protected $fillable = ['kodematakuliah', 'namamateri', 'filemateri', 'linkmateri', 'keterangan'];

    public function matakuliah()
    {
        return $this->belongsTo(Matakuliah::class, 'kodematakuliah', 'kodematakuliah');
    }
}
