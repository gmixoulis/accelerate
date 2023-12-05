import "../global.css"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="h-full max-h-screen text-white resize-y bg-inherit">
        <div className="h-12 bg-gradient-to-t from-transparent to-neutral-800"></div>
        {children}
        <div id="page-bottom-spacer" className="h-16"></div>
        <Footer />
      </div>
    </>
  )
}
