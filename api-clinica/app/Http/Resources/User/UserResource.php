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
        // $this->resource : model
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
            "role" => $this->resource->roles->first(),
            "created_at" => $this->resource->created_at ? $this->resource->created_at->format("Y/m/d") : NULL,
            "avatar" => env("APP_URL") . "storage/" . $this->resource->avatar, // absolute path
        ];
    }
}
