<?php

namespace App\Http\Resources\User;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //~ the ->resource-> is that we pass as parameter, ex. a user
        // $this->resource : model
        $HOUR_SCHEDULES = collect([]);
        $days_week = [];
        $days_week["Lunes"] = "table-primary";
        $days_week["Martes"] = "table-secondary";
        $days_week["Miercoles"] = "table-success";
        $days_week["Jueves"] = "table-warning";
        $days_week["Viernes"] = "table-info";


        foreach ($this->resource->shedule_days as $key => $shedule_day) {
            foreach ($shedule_day->schedules_hours as $schedules_hour) { // relationship
                $HOUR_SCHEDULES->push([
                    "day" => [
                        "day"   => $shedule_day->day,
                        "class" => $days_week[$shedule_day->day]
                    ],
                    "day_name" => $shedule_day->day,
                    "hours_day" => [
                        "hour" => $schedules_hour->doctor_schedule_hour->hour, // doctor_schedule_hours table
                        "format_hour" => Carbon::parse(date("Y-m-d") . "{$schedules_hour->doctor_schedule_hour->hour}:00:00")->format("h:i A"),
                        "items" => []
                    ],
                    "hour" => $schedules_hour->doctor_schedule_hour->hour,
                    "grupo" => "all",
                    "item" => [
                        "id" => $schedules_hour->doctor_schedule_hour->id,
                        "hour_start" => $schedules_hour->doctor_schedule_hour->hour_start,
                        "hour_end" => $schedules_hour->doctor_schedule_hour->hour_end,
                        "format_hour_start" => Carbon::parse(date("Y-m-d") .' '. $schedules_hour->doctor_schedule_hour->hour_start)->format('h:i A'),
                        "format_hour_end" => Carbon::parse(date("Y-m-d") .' '. $schedules_hour->doctor_schedule_hour->hour_end)->format('h:i A'),
                        "hour" => $schedules_hour->doctor_schedule_hour->hour,
                    ],
                ]);
            }
        }


        return [
            "id" => $this->resource->id,
            "name" => $this->resource->name,
            "surname" => $this->resource->surname,
            "email" => $this->resource->email,
            "mobile" => $this->resource->mobile,
            "birthdate" => $this->resource->birthdate ? Carbon::parse($this->resource->birthdate)->format("Y/m/d") : NULL,
            "gender" => $this->resource->gender,
            "education" => $this->resource->education,
            "designation" => $this->resource->designation,
            "address" => $this->resource->address,
            "role" => $this->resource->roles->first() ?? NULL,
            "especilidad_id" => $this->resource->speciality_id,
            "especilidad" => $this->resource->especilidad ? [ // relationship
               "id" => $this->resource->especilidad->id,
               "name" => $this->resource->especilidad->name,
            ] : NULL,
            "created_at" => $this->resource->created_at ? $this->resource->created_at->format("Y/m/d") : NULL,
            "avatar" => env("APP_URL") . "storage/" . $this->resource->avatar, // absolute path
            "schedule_selecteds" => $HOUR_SCHEDULES,
        ];
    }
}
