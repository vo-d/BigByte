import { SessionOptions } from "iron-session";

export interface SessionData {
  userid?:string;
  username?:string;
  isPro?:boolean
  isLoggedIn:boolean
}

export const defaultSession:SessionData = {
  isLoggedIn:false
}

export const sessionOptions: SessionOptions ={
  password: process.env.SECRET_KEY!,
  cookieName: "user-session",
  cookieOptions:{
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    path:"/"
  }
}

export interface User{
  username:string;
  password:string;
  salt:string;
  ispro:boolean;
}