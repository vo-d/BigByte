"use server";

import { sessionOptions, SessionData, defaultSession, User } from "@/lib";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as mongoDB from "mongodb";
import bcrypt from "bcrypt"

let username = "john";
let isPro = true;
let isBlocked = true;

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  // CHECK THE USER IN THE DB
  session.isPro = isPro;

  return session;
};

export const register = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;
  const formConfirm = formData.get("confirm") as string;


  
  // CHECK USER IN THE DB
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(String(process.env.MONGODB_URI));
  const user = await client.db('BigByteData').collection('users').findOne({username:formUsername})
  console.log(user);

  if (user) {
    return{error: 'Username already existed'}
  }
  if (formUsername.length < 4 || formUsername.length > 25){
    return{error: 'username is must be between 4-25 character'}
  }
  if (formPassword.length < 8) {
    return{error: 'Password must be at least 8 characters long'}
  }
  const containCapital = /[A-Z]/
  if (!containCapital.test(formPassword)) {
    return{error: 'Password contain at least one capital character'}
  }
  const containNum = /[0-9]/
  if (!containNum.test(formPassword)) {
    return{error: 'Password contain at least on number'}
  }
  if (formPassword !== formConfirm) {
    return{error: 'Passwords do not match'}
  }
  var hashedPass
  const saltRounds = 10
  var usersalt = ""

  bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    console.log('Salt: ', salt)
    usersalt = salt
    return bcrypt.hash(formPassword, salt)
  })
  .then(hash => {
    console.log('Hash: ', hash)
    client.db('BigByteData').collection('users').insertOne({username: formUsername, password: hash, salt: usersalt, ispro: false})
  })
  .catch(err => console.error(err.message))

  redirect("/");
};

export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;
  
  var loggedIn = false

  // CHECK USER IN THE DB
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(String(process.env.MONGODB_URI));
  const user = await client.db('BigByteData').collection('users').findOne({username:formUsername})
  if (user) {
    const match = await bcrypt.compare(formPassword, user.password);
    if(match) { 
      console.log("result" + user._id.toString());
      session.userid = user._id.toString();
      session.username = formUsername;
      session.isPro = user.ispro
      session.isLoggedIn = true;
      await session.save()

    } else {
      return { error: "Wrong username or password!" };
    }
  
  redirect("/");
  }
  else {
    return { error: "Wrong username or password!" }; 
  }
  

};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const changePremium = async () => {
  const session = await getSession();

  isPro = !session.isPro;
  session.isPro = isPro;
  await session.save();
  revalidatePath("/profile");
};

export const changeUsername = async (formData: FormData) => {
  const session = await getSession();

  const newUsername = formData.get("username") as string;

  username = newUsername;

  session.username = username;
  await session.save();
  revalidatePath("/profile");
};
