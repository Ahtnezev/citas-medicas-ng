<?php

namespace Database\Seeders;

use App\Models\Doctor\Specialitie;
use Illuminate\Database\Seeder;

class SpecialitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ["name" => "Anestesiologías", "state" => 1 ],
            ["name" => "Anatomía Patológica", "state" => 1 ],
            ["name" => "Cardiología Intervencionista", "state" => 1 ],
            ["name" => "Cirugía Pediátrica", "state" => 1 ],
            ["name" => "Cirugía General", "state" => 1 ],
            ["name" => "Dermatología", "state" => 1 ],
            ["name" => "Gastroenterología", "state" => 1 ],
            ["name" => "Ginegología y Obstetricia", "state" => 2 ],
        ];

        foreach($data as $item) {
            Specialitie::create($item);
        }
    }
}
