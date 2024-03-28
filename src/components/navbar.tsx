import Link from "next/link"
import LogoutForm from "./logoutForm"
import { getSession } from "@/actions"

const Navbar = async () => {
  const session = await getSession()
  console.log(session.isLoggedIn)

  return (
    <nav>
      <Link href="/">Homepage</Link>
      <Link href="/premium">Premium</Link>
      <Link href="/profile">Profile</Link>
      {session.isLoggedIn == false &&  <Link href="/register">Register</Link>}
      
      {session.isLoggedIn == false && <Link href="/login">Login</Link>}
      {session.isLoggedIn && <LogoutForm/>}
    </nav>
  )
}

export default Navbar