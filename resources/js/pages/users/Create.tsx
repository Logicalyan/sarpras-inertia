import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { UserForm } from '@/components/users/UserForm'

type PageProps = {
  errors: Record<string, string>
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '/users' },
  { title: 'Create', href: '/users/create' },
]

export default function Create() {
  const { props } = usePage<PageProps>()

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <h1 className="text-2xl font-bold">Create User</h1>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-background md:min-h-min">
          <UserForm
            mode="create"
            defaultValues={{ name: '', email: '', role: '', password: '', password_confirmation: '' }}
            errors={props.errors}
            onSuccessRedirect="/users"
          />
        </div>
      </div>
    </AppLayout>
  )
}
