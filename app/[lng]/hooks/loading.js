import Image from "next/image"
import logo from "public/images/group-196.svg"
import { Oval } from "react-loader-spinner"

export default function Loading() {
  return (
    <div>
      <div className="fixed inset-0  bg-gray-700 z-[10000] flex  flex-2 flex-wrap items-center justify-center">
        <Image src={logo} className="animate-pulse" alt="Loading" />
        <br />
      </div>
      {/* <div className="fixed bottom-47 !ml-[-20px] pt-11 !left-45  bg-transparent m-auto  z-[10000] flex  flex-2 flex-wrap items-center justify-center">
        <Oval
          height={70}
          width={70}
          color="#e60000"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#e60000"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div> */}
    </div>
  )
}
