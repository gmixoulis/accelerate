import { IconLoader2 } from "@tabler/icons-react"
export default function PageLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <IconLoader2 className="animate-spin h-16 w-16 text-gray-700 dark:text-gray-400" />
        </div>
    )
}