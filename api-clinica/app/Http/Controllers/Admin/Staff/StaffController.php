<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserCollection;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = trim($request->search);

        $users = User::where("name", "LIKE", "%$search%")
            ->orWhere("surname", "LIKE", "%$search%")
            ->orWhere("email", "LIKE", "%$search%")
            ->orderBy("id", "DESC")
            ->get();

        return response()->json([
            "users" => UserCollection::make($users),
        ]);
    }

    /**
     * config
    */
    public function config()
    {
        $roles = Role::all();

        return response()->json([
            "roles" => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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

        if ($request->password) {
            $request->request->add(["password" => bcrypt($request->password)]);
        }

        //? es por recibir la fecha de parte de js
        $request->request->add(["birthdate" => Carbon::parse(trim($request->birthdate))->format("Y-m-d") ]);

        $user = User::create($request->all());

        $role = Role::findOrFail($request->role_id);
        $user->assignRole($role);

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

        return response()->json(["user"=> UserResource::make($user) ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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

        if ($request->role_id != $user->roles()->first()->id) {
            $role_old = Role::findOrFail($user->roles()->first()->id); // el role que tiene asignado
            $user->removeRole($role_old);

            $role_new = Role::findOrFail($request->role_id);
            $user->assignRole($role_new);
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
        if ($user->avatar) {
            Storage::delete($user->avatar);
        }
        $user->delete();

        return response()->json(["message" => 200]);
    }
}
