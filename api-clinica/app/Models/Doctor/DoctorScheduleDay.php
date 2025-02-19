<?php

namespace App\Models\Doctor;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DoctorScheduleDay extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'doctor_schedule_days';

    protected $fillable = [
        "user_id",
        "day",
    ];

    public function setCreatedAtAttribute($value)
    {
    	date_default_timezone_set('America/Mexico_City');
        $this->attributes["created_at"]= Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
    	date_default_timezone_set("America/Mexico_City");
        $this->attributes["updated_at"]= Carbon::now();
    }

    public function schedules_hours() {
        return $this->hasMany(DoctorScheduleJoinHour::class);
    }

}
