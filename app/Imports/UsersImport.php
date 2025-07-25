<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Normalisasi key agar aman terhadap kapital / spasi
        $row = collect($row)
            ->keyBy(fn ($v, $k) => strtolower(trim($k)))
            ->all();

        // Optional: early return kalau header wajib tidak ada
        if (!isset($row['name']) || !isset($row['email'])) {
            // Bisa throw ValidationException atau skip
            return null;
        }

        return new User([
            'name'     => $row['name'],
            'email'    => $row['email'],
            'role'     => $row['role'] ?? 'user',
            'password' => Hash::make($row['password'] ?? 'password123'),
        ]);
    }

    public function headingRow(): int
    {
        return 1; // default, tapi eksplisitkan saja
    }
}
