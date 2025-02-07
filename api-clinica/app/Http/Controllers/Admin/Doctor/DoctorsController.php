<?php

namespace App\Http\Controllers\Admin\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Doctor\DoctorScheduleHour;
use App\Models\Doctor\Specialitie;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class DoctorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function config()
    {
        $roles = Role::all();
        $specialities = Specialitie::where("state", 1)->get();

        $hours_days = collect([]);

        $doctor_schedule_hours = DoctorScheduleHour::all();
        // dd(
        //     $doctor_schedule_hours->groupBy("hour")
        // );
        foreach($doctor_schedule_hours->groupBy("hour") as $key => $schedule_hour) {
            $hours_days->push([
                "hour" => $key,
                "format_hour" => Carbon::parse(date("Y-m-d") . "$key:00:00")->format("h:i A"),
                // el map no es necesario, ya las horas se mostraban correctamente :u
                "items" => $schedule_hour->map(function($hour_time) {
                    return [
                        "id" => $hour_time->id,
                        "hour_start" => $hour_time->hour_start,
                        "hour_end" => $hour_time->hour_end,
                        "format_hour_start" => Carbon::parse(date("Y-m-d") .' '. $hour_time->hour_start)->format('h:i A'),
                        "format_hour_end" => Carbon::parse(date("Y-m-d") .' '. $hour_time->hour_end)->format('h:i A'),
                        "hour" => $hour_time->hour,
                    ];
                })
            ]);
        }

        return response()->json([
            "roles" => $roles,
            "specialities" => $specialities,
            "hours_days" => $hours_days,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
