"use client"
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import { UseTranslation } from '@/app/i18n/client';


export default function SettingsLayout({children}) {
    const pathname = usePathname()
    const { lng } = useParams()
    const { t } = UseTranslation(lng, "powerflow");

    const links = [
        {href: `/${lng}/powerflow/settings/llm-models`, label: t("llm-models")},
    ]

    return (
        <section className="flex flex-col gap-2 lg:flex-row lg:gap-8">
        <div className="flex flex-col">
        <aside className="w-48 mt-10 rounded-md border-2 dark:bg-darkslategray-100 border-gray-200 dark:border-gray-700 py-4">
        <div className="flex flex-col">
        {links.map(({ href, label }) => (
            <Link key={href} href={href}>
                <div className={`border-b-gray-700 p-3 ${pathname === href ? 'bg-gainsboro-100 dark:bg-darkslategray-200 border-l-4 border-unicred-400 font-medium' : 'hover:bg-gray-100 dark:hover:bg-darkslategray-200'}
                `}>
                    {label}
                </div>
            </Link>
        ))}            
        </div>   
        </aside>
        </div>
        {children}
        </section>
    )
           

}