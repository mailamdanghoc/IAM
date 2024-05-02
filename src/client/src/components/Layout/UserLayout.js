import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Cookies from "universal-cookie"

export default function UserLayout() {
  const cookies = new Cookies()
  const [isAuth,setIsAuth] = useState()
  const [isAdmin,setIsAdmin] = useState()

  useEffect(() => {
    setIsAuth(cookies.get('isAuth'))
    setIsAdmin(cookies.get('isAdmin'))


  }, []);

  return (
    <div className="container mx-auto max-w-4xl mb-16">
      <Header isAuth={isAuth} isAdmin={isAdmin}/>
      <div className="flex-grow flex">
        <Outlet/>
      </div>
    </div>
  );
}