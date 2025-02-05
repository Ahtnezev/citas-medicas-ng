<?php

use App\Http\Controllers\Admin\Doctor\SpecialityController;
use App\Http\Controllers\Admin\Rol\RolesContoller;
use App\Http\Controllers\Admin\Staff\StaffController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    // 'middleware' => 'auth:api',
    'prefix' => 'auth',
    /**
     *~ specific guard
     * role:manager,api
     * permission:
     * role_or_permission:publish articles
    */
    //! rutas login, register revisar doc de spatie porque da "error", !! auth:api ¡¡
    // 'middleware' => ['role_or_permission:Super-Admin|delete articles'],
    // 'middleware' => ['role:admin', 'permission:publish articles'], -> &&
    // 'middleware' => ['role_or_permission:Super-Admin|delete articles'],
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');

    Route::post('/list', [AuthController::class, 'list']);
    Route::post('/reg', [AuthController::class, 'reg']);
});


Route::group([
    'middleware' => 'auth:api'
], function ($router) {
    Route::resource("roles", RolesContoller::class);

    Route::get("staffs/config", [StaffController::class, 'config']);
    Route::post("staffs/{id}", [StaffController::class, "update"]);
    Route::resource("staffs", StaffController::class); // debe ser la misma ruta `staffs` que en `staff.service.ts`

    Route::resource("specialities", SpecialityController::class);
});
