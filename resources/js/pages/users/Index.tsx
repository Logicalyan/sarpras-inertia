import { Head, router } from '@inertiajs/react'
import { DataTable } from '@/components/data-table/data-table'
import { useServerTable } from '@/lib/use-server-table'
import { columns, User } from './columns'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { ExcelActionsDropdown } from '@/components/common/ExcelActionsDropdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
    users: {
        data: User[]
        meta: {
            current_page: number
            per_page: number
            total: number
            last_page: number
        }
    }
    filters: {
        page: number
        search?: string
        sort?: string | null
        per_page?: number
        role?: string
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
]

export default function UsersIndex({ users, filters }: Props) {
    const { go, current, setPage, setPerPage, setSearch, setSort } = useServerTable(
        {
            page: filters.page ?? users.meta.current_page,
            per_page: users.meta.per_page,
            search: filters.search ?? '',
            sort: filters.sort ?? '',
            role: filters.role ?? '',
        },
        {
            resetPageOn: ['search', 'sort', 'per_page'],
        }
    )

    const roleValue = current.role ?? undefined


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-4 gap-2">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <div className="flex gap-2">
                        <ExcelActionsDropdown
                            templateUrl={route('users.template')}
                            exportUrl={route('users.export')}
                            importUrl={route('users.import')}
                            onImported={() => {
                                // optional: refresh halaman setelah import
                                router.reload({ only: ['users'] })
                            }}
                        />

                        <Button onClick={() => router.get(route('users.create'))}>
                            Create User
                        </Button>
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-background">
                    <DataTable<User>
                        columns={columns}
                        data={users.data}
                        meta={users.meta}
                        server={{
                            search: current.search ?? '',
                            sort: current.sort ?? null,
                            onSearch: (v) => setSearch(v),
                            onPageChange: (p) => setPage(p),
                            onPerPageChange: (pp) => setPerPage(pp),
                            onSortChange: (s) => setSort(s),
                        }}
                        toolbarExtra={

                            <Select
                                value={roleValue}
                                onValueChange={(v) => {
                                    const role = v === 'all' ? null : v
                                    go({ role, page: 1 })
                                }}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>   {/* <-- tidak kosong */}
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>

                        }
                    />
                </div>
            </div>
        </AppLayout>
    )
}
