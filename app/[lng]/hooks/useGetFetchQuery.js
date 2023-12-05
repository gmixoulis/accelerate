import { QueryClient } from "@tanstack/react-query"

export const useGetFetchQuery = (name) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  })

  return queryClient.getQueryData(name)
}
