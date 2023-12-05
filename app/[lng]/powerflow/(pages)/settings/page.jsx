'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

export default function Page({params}) {
  const router = useRouter();

  useEffect(() => {
    router.push(`/${params.lng}/powerflow/settings/llm-models`);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <IconLoader2 className="animate-spin h-16 w-16 text-gray-700 dark:text-gray-400" />
    </div>
  )
}