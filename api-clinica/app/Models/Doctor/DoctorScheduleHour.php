<?php

namespace App\Models\Doctor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DoctorScheduleHour extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'doctor_schedule_hours';


}
