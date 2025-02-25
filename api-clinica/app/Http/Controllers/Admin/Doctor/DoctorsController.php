<?php

namespace App\Http\Controllers\Admin\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserCollection;
use App\Http\Resources\User\UserResource;
use App\Models\Doctor\DoctorScheduleDay;
use App\Models\Doctor\DoctorScheduleHour;
use App\Models\Doctor\DoctorScheduleJoinHour;
use App\Models\Doctor\Specialitie;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class DoctorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = trim($request->search);

        $users = User::
            where( DB::raw("CONCAT(users.name,' ', IFNULL(users.surname, ''),' ',users.email)"), "LIKE", "%$search%" )
            ->whereHas("roles", function($q) {
                $q->where("name", "LIKE", "%doctor%");
            })
            ->orderBy("id", "DESC")
            ->get();

        return response()->json([
            "users" => UserCollection::make($users),
        ]);
    }

    public function config()
    {
        $roles = Role::where("name", "LIKE", "%doctor%")->get();
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
        // :118 formData.append("schedule_hours"... add-doctor..ts
        $schedule_hours = json_decode($request->schedule_hours, 1);

        $valid_user = User::where("email", trim($request->email))->first();
        if ($valid_user) {
            return response()->json([
                "message" => 403,
                "text" => "El usuario con ese email ya existe."
            ]);
        }

        if ($request->hasFile('imagen')) {
            $path = Storage::putFile("staffs", $request->file("imagen"));
            $request->request->add(["avatar" => $path]);
        }

        if ($request->password)
            $request->request->add(["password" => bcrypt($request->password)]);

        $request->request->add(["birthdate" => Carbon::parse(trim($request->birthdate))->format("Y-m-d") ]);

        $user = User::create($request->all());

        $role = Role::findOrFail($request->role_id);
        $user->assignRole($role);

        //~ almacenar disponibilidad de horario del doctor
        foreach($schedule_hours as $key => $schedule_hour) {
            if (sizeof($schedule_hour["children"]) > 0) {

                $schedule_day = DoctorScheduleDay::create([
                    "user_id" => $user->id,
                    // :112 HOUR_SCHEDULES.push({day_name...
                    "day"     => $schedule_hour["day_name"]
                ]);
                foreach($schedule_hour["children"] as $children) {
                    DoctorScheduleJoinHour::create([
                        "doctor_schedule_day_id"         => $schedule_day->id,
                        "doctor_schedule_hour_id"       => $children["item"]["id"], // "id" => $hour_time->id, @config
                    ]);
                }

            }
        }

        return response()->json([
            "message" => 200,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return response()->json(["doctor"=> UserResource::make($user) ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $schedule_hours = json_decode($request->schedule_hours, 1);

        $valid_user = User::where("id", "<>", $id)
                            ->where("email", trim($request->email))
                            ->first();
        if ($valid_user) {
            return response()->json([
                "message" => 403,
                "text" => "El usuario con ese email ya existe."
            ]);
        }

        $user = User::findOrFail($id);

        if ($request->hasFile('imagen')) {
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile("staffs", $request->file("imagen"));
            $request->request->add(["avatar" => $path]);
        }

        if ($request->password) {
            $request->request->add(["password" => bcrypt($request->password)]);
        }

        $request->request->add(["birthdate" => Carbon::parse(trim($request->birthdate))->format("Y-m-d") ]);
        $user->update($request->all());

        $hasRoles = $user?->roles()?->first()?->id ? true : false;

        if ($hasRoles && $request->role_id != $user->roles()->first()->id) {
            $role_old = Role::findOrFail($user->roles()->first()->id); // el role que tiene asignado
            $user->removeRole($role_old);

            $role_new = Role::findOrFail($request->role_id);
            $user->assignRole($role_new);
        }

        //~ limpiamos los permisos en CASCADE para posterior almacenar los nuevos dias/...
        if (!is_null($user->schedule_days)) {
            foreach ($user->schedule_days as $key => $schedule_day) {
                $schedule_day->delete();
            }
        }

        foreach($schedule_hours as $key => $schedule_hour) {
            if (sizeof($schedule_hour["children"]) > 0) {

                $schedule_day = DoctorScheduleDay::create([
                    "user_id" => $user->id,
                    "day"     => $schedule_hour["day_name"]
                ]);
                foreach($schedule_hour["children"] as $children) {
                    DoctorScheduleJoinHour::create([
                        "doctor_schedule_day_id"         => $schedule_day->id,
                        "doctor_schedule_hour_id"       => $children["item"]["id"],
                    ]);
                }

            }
        }


        return response()->json([
            "message" => 200
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            "message" => 200
        ]);
    }
}
