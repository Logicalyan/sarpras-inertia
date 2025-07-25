<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Exports\UsersTemplateExport;
use App\Models\User;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Imports\UsersImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function template()
    {
        return Excel::download(new UsersTemplateExport, 'users_template.xlsx');
    }
    public function export()
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        Excel::import(new UsersImport, $request->file('file'));

        return back()->with('success', 'Users imported successfully.');
    }

    public function index(Request $request)
    {
        $search  = $request->string('search');
        $sort    = $request->string('sort'); // "column:asc|desc"
        $perPage = (int) $request->integer('per_page', 10);
        $page    = (int) $request->integer('page', 1);

        $query = User::query();

        // Search
        if ($search->isNotEmpty()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%");
            });
        }

        // Sorting
        if ($sort->isNotEmpty()) {
            [$column, $direction] = explode(':', $sort, 2);
            $allowed = ['id', 'name', 'email', 'role', 'created_at'];
            if (in_array($column, $allowed, true)) {
                $query->orderBy($column, $direction === 'desc' ? 'desc' : 'asc');
            }
        } else {
            $query->latest('id');
        }

        // Pastikan paginator mempertahankan seluruh query string (search, sort, per_page, page, dst)
        $users = $query
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        // (Opsional) Jika user mengakses page > last_page, redirect halus ke last_page
        if ($users->currentPage() > $users->lastPage() && $users->lastPage() > 0) {
            return redirect()->to(
                $request->fullUrlWithQuery(['page' => $users->lastPage()])
            );
        }

        return Inertia::render('users/Index', [
            'users' => [
                'data' => $users->items(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'per_page'     => $users->perPage(),
                    'total'        => $users->total(),
                    'last_page'    => $users->lastPage(),
                ],
            ],
            'filters' => [
                'search'   => $search->toString(),
                'sort'     => $sort->toString() ?: null,
                'per_page' => $perPage,
                'page'     => $users->currentPage(), // <- penting supaya frontend tahu current page
            ],
        ]);
    }


    public function create()
    {
        return Inertia::render('users/Create');
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return to_route('users.index')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        return Inertia::render('users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return to_route('users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) {
            return back()->with('error', 'No user selected.');
        }

        User::whereIn('id', $ids)->delete();

        return back()->with('success', 'Selected users deleted.');
    }
}
