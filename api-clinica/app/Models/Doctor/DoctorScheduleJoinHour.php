<?php

namespace App\Models\Doctor;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DoctorScheduleJoinHour extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'doctor_schedule_join_hours';

    protected $fillable = [
        "doctor_schedule_day_id",
        "doctor_schedule_hour_id",
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

    public function doctor_schedule_day() {
        return $this->belongsTo(DoctorScheduleDay::class);
    }

    public function doctor_schedule_hour() {
        return $this->belongsTo(DoctorScheduleHour::class);
    }

}
