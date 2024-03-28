import { getSession } from "@/actions"
import RegisterForm from "@/components/registerForm"
import { redirect } from "next/navigation"

const RegisterPage = async () => {  
  const session = await getSession()

  if(session.isLoggedIn){
    redirect("/")
  }
  return (
    <div className="login">
      <h1>Welcome to the Register Page</h1>
      <RegisterForm/>
    </div>
  )
}

export default RegisterPage