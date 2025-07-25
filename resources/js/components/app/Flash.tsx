// resources/js/components/app/Flash.tsx
import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner' // contoh gunakan sonner, atau shadcn toast

export default function Flash() {
  const { props } = usePage<{ flash?: { success?: string; error?: string } }>()
  useEffect(() => {
    if (props.flash?.success) toast.success(props.flash.success)
    if (props.flash?.error) toast.error(props.flash.error)
  }, [props.flash])

  return null
}
