<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matakuliah extends Model
{
    protected $table = 'matakuliah';
    protected $primaryKey = 'kodematakuliah';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['kodematakuliah', 'namamatakuliah', 'sks', 'semester'];

    public function materi()
    {
        return $this->hasMany(Materi::class, 'kodematakuliah', 'kodematakuliah');
    }
}
