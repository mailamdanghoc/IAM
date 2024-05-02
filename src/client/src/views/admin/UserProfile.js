import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import Cookies from "universal-cookie";

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


export default function UserProfile() {
  const {uid} = useParams();
  const [userData,setUserData] = useState(null)

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = async () => {
    // const cookies = new Cookies();
    // try {
    //   await axios.post('http://localhost:9000/api/user/deleteAccount',{},{
    //       withCredentials: true,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //   })
    //   cookies.remove("isAuth", { path: "/" });
    //   cookies.remove("isAdmin", { path: "/" });
    //   window.location.href = "http://localhost:3000/login";
    // }catch (error){
    //   console.error("Error delete user account:", error);
    // }
    
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };



  const fetchData = async () => {
    try {
        const response = await axios.get(`http://localhost:9000/api/admin/groupinfor/detail/${uid}`,
            {
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                },
            }
        )
      
        if (response.status >=200 && response.status<400) {
            const ud = response.data.data.user;
            console.log(ud)
            setUserData({
                mail: ud.mail,
                firstname:ud.cn,
                lastname:ud.sn,
                phoneNumber:ud.telephoneNumber,
                groups: ud.groups,
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  
  return (
    <section className="mx-auto w-50vw">
      <div className="p-10">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">User Information</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">{userData.firstname}</p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name
              </label>
              <div className="mt-2">
                <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">{userData.lastname}</p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">{userData.mail}</p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">{userData.phoneNumber}</p>
              </div>
            </div>


          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Groups</h2>
          <div className="mt-2">
            <ul className="list-disc list-inside">
              {userData.groups.map((group, index) => (
                <li key={index} className="text-sm text-gray-900">{group}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
        <Link to={`/admin/manage-groups/detail/${uid}/request-role`}>
          <div className="button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >Add Role For User</div>
        </Link>
        <Link to={`/admin/manage-groups/detail/${uid}/delete-role`}>
          <div className="button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >Remove User Role</div>
        </Link>
          


          <div>
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete User Account
            </button>
            {showConfirmation && (
              <ConfirmationPopup
                message="Do you want to delete your account?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

  
