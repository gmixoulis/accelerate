import { useRouter } from "next/navigation";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect } from "react";

const RefreshBtn = ({isFetching, setIsFetching}) => {
    const router = useRouter();

    const handleRefresh = () => {
        setIsFetching(true);
        router.refresh();
    };

    useEffect(() => {
        if (isFetching) {
            setTimeout(() => {
                setIsFetching(false);
            }, 1000);
        }
    }, [isFetching, setIsFetching]);

    return (
        <button type="button" className="flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none custom-box" 
        onClick={handleRefresh}>
            <IconRefresh className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`} />
        </button>
    )
}

export default RefreshBtn