import { QueryClient } from "@tanstack/query-core"

const getQueryClient = () => {
  return new QueryClient()
}

export default getQueryClient
