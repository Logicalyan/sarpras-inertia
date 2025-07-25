<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;

class UsersTemplateExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect([
            ['John Doe', 'john@example.com', 'admin', 'password123'],
        ]);

    }

    public function headings(): array
    {
        return ['name', 'email', 'role', 'password'];
    }
}
