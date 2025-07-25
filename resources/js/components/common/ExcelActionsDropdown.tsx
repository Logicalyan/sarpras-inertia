// resources/js/components/common/ExcelActionsDropdown.tsx
import * as React from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, FileDown, FileSpreadsheet, FileUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

type ExcelActionsDropdownProps = {
    /** URL untuk download template (GET). Optional */
    templateUrl?: string
    /** URL untuk export excel (GET). Optional */
    exportUrl?: string
    /** URL untuk import excel (POST). Optional */
    importUrl?: string
    /** MIME accept untuk input file */
    accept?: string
    /** Label tombol trigger */
    triggerLabel?: string
    /** ClassName untuk tombol trigger */
    className?: string
    /** Data tambahan yang ingin ikut dipost saat import */
    extraImportData?: Record<string, any>
    /** Callback ketika import sukses */
    onImported?: () => void
    /** Query params yang ingin dibawa saat export/template */
    exportParams?: Record<string, any>
    templateParams?: Record<string, any>
}

export function ExcelActionsDropdown({
    templateUrl,
    exportUrl,
    importUrl,
    accept = '.xlsx,.xls',
    triggerLabel = 'Actions',
    className,
    extraImportData,
    onImported,
    exportParams,
    templateParams,
}: ExcelActionsDropdownProps) {
    const fileRef = React.useRef<HTMLInputElement>(null)

    const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !importUrl) return

        const formData = new FormData()
        formData.append('file', file)

        if (extraImportData) {
            Object.entries(extraImportData).forEach(([k, v]) => {
                formData.append(k, String(v))
            })
        }

        router.post(importUrl, formData, {
            onFinish: () => {
                if (fileRef.current) fileRef.current.value = ''
            },
            onSuccess: () => {
                onImported?.()
            },
        })
    }

    const buildUrl = (base?: string, params?: Record<string, any>) => {
        if (!base) return ''
        if (!params || Object.keys(params).length === 0) return base
        const qs = new URLSearchParams()
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                qs.append(k, String(v))
            }
        })
        return `${base}?${qs.toString()}`
    }

    const download = (url?: string, params?: Record<string, any>) => {
        if (!url) return
        const full = buildUrl(url, params)
        // Gunakan window.location (atau window.open) agar file langsung ter-download
        window.location.href = full
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={cn('flex items-center gap-1', className)}>
                        {triggerLabel} <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Excel Actions</DropdownMenuLabel>

                    {templateUrl && (
                        <DropdownMenuItem onClick={() => download(templateUrl, templateParams)}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Download Template
                        </DropdownMenuItem>
                    )}

                    {exportUrl && (
                        <DropdownMenuItem onClick={() => download(exportUrl, exportParams)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Export Excel
                        </DropdownMenuItem>
                    )}

                    {importUrl && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                                <FileUp className="mr-2 h-4 w-4" />
                                Import Excel
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {importUrl && (
                <Input
                    ref={fileRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleImportChange}
                />
            )}
        </>
    )
}
