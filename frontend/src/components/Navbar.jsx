import { useState } from "react"
import { Link } from "react-router-dom"
import { Search,LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '../store/authUser.js'
import { useContentStore } from "../store/content.js"
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState()
    const { user, logout } = useAuthStore()
    const {contentType, setContentType}= useContentStore()
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  return (
    <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
        <div className="flex items-center gap-10 z-50">
            <Link to="/">
                <img src="/netflix-logo.png" alt="Netflix logo" className="w-32 sm:w-40" />
            </Link>
            
        </div>

        {/* desktop navbar item*/}
        <div className="hidden sm:flex gap-2 items-center z-10">
            <Link to="/" className="hover:underline" onClick={()=>setContentType("movie")}>Movies</Link>
            <Link to="/" className="hover:underline" onClick={()=>setContentType("tv")}>TV Shows</Link>
            <Link to="/history" className="hover:underline">Search History</Link>
        </div>

        <div className="flex gap-8 items-center z-50">
            <Link to={"/search"}>
                <Search className="size-6 cursor-pointer"/>
            </Link>
            <img src={user.image} alt="Avatar" className="h-8 rounded cursor-pointer"/>
            <LogOut className="size-6 cursor-pointer" onClick={logout}/>
            <div className="sm:hidden">
                <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu}/>
            </div>
        </div>

        {/* mobile navbar item*/}
        {isMobileMenuOpen && (
            <div className="w-full sm:hideen mt-4 z-50 bg-black rounded border-gray-800">
                <Link to={"/"}
                    className="block hover:underline p-2"
                    onClick={()=>setContentType("movie")}
                >
                    Movie
                </Link>
                <Link to={"/"}
                    className="block hover:underline p-2"
                    onClick={()=>setContentType("tv")}
                >
                    TV Shows
                </Link>
                <Link to={"/history"}
                    className="block hover:underline p-2"
                >
                    Search History
                </Link>
               
            </div>
        )}
    </header>
  )
}

export default Navbar
