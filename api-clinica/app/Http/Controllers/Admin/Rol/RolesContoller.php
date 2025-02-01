<?php

namespace App\Http\Controllers\Admin\Rol;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolesContoller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //! filter by role name
        $name = $request->search;

        $roles = Role::where("name", "LIKE", "%".trim($name)."%")->orderBy('id', 'DESC')->get();

        return response()->json([
           "roles" => $roles->map(function($rol) {
            return [
                "id" => $rol->id,
                "name" => $rol->name,
                "permission" => $rol->permissions,
                "permission_pluck" => $rol->permissions->pluck('name'),
                "created_at" => $rol->created_at->format("Y-m-d h:i:s"),
            ];
           }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_role = Role::where("name", trim($request->name))->first();
        if ($is_role) return response()->json(["message" => 403, "text" => "Nombre de rol ya existe"]);

        $role = Role::create([
            'guard_name' => 'api',
            'name' => trim($request->name)
        ]);

        // ["register_rol", "edit_rol", "register_paciente"]
        foreach($request->permissions as $key => $permission) {
            $role->givePermissionTo($permission);
        }

        return response()->json([
            "message" => 200
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $rol = Role::findOrFail($id);

        return response()->json([
            "id" => $rol->id,
            "name" => $rol->name,
            "permission" => $rol->permissions,
            "permission_pluck" => $rol->permissions->pluck('name'),
            "created_at" => $rol->created_at->format("Y-m-d h:i:s"),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_role = Role::where("id", "<>", $id)->where("name", $request->name)->first();
        if ($is_role) return response()->json(["message" => 403, "text" => "Nombre de rol ya existe"]);

        $role = Role::findOrFail($id);
        $role->update($request->all());
        $role->syncPermissions($request->permissions);

        return response()->json([
            "message" => 200
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        //* check if the role has a user related
        if ($role->users->count() > 0) {
            return response()->json([
                "message" => 403,
                "text"    => "El rol seleccionado no se puede eliminar ya que cuenta con usuarios asignados"
            ]);
        }
        $role->delete();
        return response()->json([
            "message" => 200
        ]);
    }
}
