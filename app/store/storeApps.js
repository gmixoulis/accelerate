import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

const useStore = (set) => ({
  personalInformation: [],
  setInformation: (personalInformation) => set(() => ({ personalInformation })),
})

const usePersonalStore = create()(
  devtools(
    persist(useStore, {
      name: "personalInformation",
    })
  )
)
export default usePersonalStore
