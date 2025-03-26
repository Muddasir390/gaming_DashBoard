import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";



const NavBar=()=>{
  const router = useRouter();

    const logOut = () => {
        Cookies.remove("token");
        router.push("/");
      };
      
    return(
        <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* <img
                src="/AppIconBlack.png"
                alt="Logo"
                className="h-8 w-auto mr-2"
              /> */}
              <h2 className="text-xl text-white font-bold">Zoaverse Analytics Dashboard</h2>
            </div>
            <Link
              href={'/'}
              onClick={()=> Cookies.remove("token")}
              className="px-4 py-2 border border-white  text-white rounded-lg transition-colors"
            >
              Log Out
            </Link>
          </div>
        </nav>
    )

}
export default NavBar