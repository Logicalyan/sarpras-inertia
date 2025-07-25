// resources/js/components/users/UserForm.tsx
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { router } from '@inertiajs/react'
import { useEffect } from 'react'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  role: z.string().min(1, 'Role is required'),
  password: z.string().min(8, 'Min 8 chars'),
  password_confirmation: z.string().min(8, 'Min 8 chars'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  role: z.string().min(1, 'Role is required'),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
}).refine((data) => {
  if (!data.password && !data.password_confirmation) return true
  return data.password === data.password_confirmation
}, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

type CreateValues = z.infer<typeof createUserSchema>
type UpdateValues = z.infer<typeof updateUserSchema>

type Props =
  | {
      mode: 'create'
      defaultValues?: Partial<CreateValues>
      errors?: Record<string, string>
      onSuccessRedirect?: string
    }
  | {
      mode: 'update'
      id: number
      defaultValues: Partial<UpdateValues>
      errors?: Record<string, string>
      onSuccessRedirect?: string
    }

export function UserForm(props: Props) {
  const isCreate = props.mode === 'create'

  const form = useForm<CreateValues | UpdateValues>({
    resolver: zodResolver(isCreate ? createUserSchema : updateUserSchema),
    defaultValues: props.defaultValues as any,
  })

  // Map server-side validation errors from Inertia to RHF
  useEffect(() => {
    if (!props.errors) return
    Object.entries(props.errors).forEach(([field, message]) => {
      form.setError(field as any, { type: 'server', message })
    })
  }, [props.errors]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (values: any) => {
    if (isCreate) {
      router.post(route('users.store'), values, {
        onSuccess: () => {
          if (props.onSuccessRedirect) {
            router.visit(props.onSuccessRedirect)
          } else {
          form.reset()
          }
        },
        onError: (errors) => {
          // already mapped in useEffect if you pass it from page props
        },
      })
    } else {
      router.put(route('users.update', props.id), values, {
        onSuccess: () => {
          if (props.onSuccessRedirect) {
            router.visit(props.onSuccessRedirect)
          }
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
        />

        {/* Passwords */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password {isCreate ? '' : '(optional)'}
              </FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation {isCreate ? '' : '(optional)'}</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">
            {isCreate ? 'Create' : 'Update'}
          </Button>
          <Button type="button" variant="outline" onClick={() => history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
