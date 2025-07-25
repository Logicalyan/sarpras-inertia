import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { UserForm } from '@/components/users/UserForm'

type User = {
  id: number
  name: string
  email: string
  role: string
}

type PageProps = {
  user: User
  errors: Record<string, string>
}

export default function Edit() {
  const { props } = usePage<PageProps>()
  const { user, errors } = props

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
    { title: `Edit #${user.id}`, href: `/users/${user.id}/edit` },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit User #${user.id}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <h1 className="text-2xl font-bold">Edit User</h1>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-background md:min-h-min">
          <UserForm
            mode="update"
            id={user.id}
            defaultValues={{
              name: user.name,
              email: user.email,
              role: user.role,
              password: '',
              password_confirmation: '',
            }}
            errors={errors}
            onSuccessRedirect="/users"
          />
        </div>
      </div>
    </AppLayout>
  )
}
