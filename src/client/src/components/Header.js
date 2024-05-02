import React from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

const Header = ({ isAuth, isAdmin }) => {
  const cookies = new Cookies();

  const handleLogout = async () => {
    // Remove the cookies that were previously set
    try {
      // Add your form submission logic here
      await axios.post("http://localhost:9000/api/auth/logout",{},{
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }

      });
      cookies.remove("isAuth", { path: "/" });
      cookies.remove("isAdmin", { path: "/" });
      window.location.href = "http://localhost:3000/login";
    } catch (error) {
      console.error("Failed to login user:", error);
    }

    
  };

  const customStyle = {
    addBorder: {
      border: "1px solid #013034",
      padding: "5px 20px 5px 20px",
      marginLeft: "15px",
    },
    header: {
      margin: "20px 0px 20px 40px",
    },
  };

  return (
    <header style={customStyle.header} className="border-b">
      <nav className="flex justify-end mb-2">
        <ul className="flex">
          {/* If user is authenticated */}
          {isAuth ? (
            <>
              {/* If user is admin */}
              {isAdmin ? (
                <>
                  <li>
                    <button className="border-15 bg-white text-darkblue font-bold py-2 px-4 rounded">
                      <Link to="/admin/profile">Profile</Link>
                    </button>
                  </li>
                  <li>
                    <button className="border-15 bg-white text-darkblue font-bold py-2 px-4 rounded">
                      <Link to="/admin/manage-requests">Manage Request</Link>
                    </button>
                  </li>
                  <li>
                    <button className="border-15 bg-white text-darkblue font-bold py-2 px-4 rounded">
                      <Link to="/admin/manage-groups">Manage Group</Link>
                    </button>
                  </li>
                  <li>
                    <button className="border-15 bg-white text-darkblue font-bold py-2 px-4 rounded">
                      <Link to="/admin/manage-log">Log</Link>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button className="border-15 bg-white text-darkblue font-bold py-2 px-4 rounded">
                      <Link to="/profile">Profile</Link>
                    </button>
                  </li>
                  <li>
                    <button className="border-15 bg-white text-darkblue font-bold py-2 px-4 rounded">
                      <Link to="/resources">Resources</Link>
                    </button>
                  </li>
                </>
              )}
              {/* Logout button */}
              <li>
                <button
                  className="border-15 border-darkblue bg-white text-darkblue font-bold py-2 px-4 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            (!isAuth) &&
            <>
              <li>
                <button className="border-15 border-darkblue hover:bg-medium hover:text-white bg-white text-darkblue font-bold py-2 px-4 rounded addborder" style={customStyle.addBorder}>
                  <Link to="/signup">Sign Up</Link>
                </button>
              </li>
              <li>
                <button className="border-15 border-darkblue hover:bg-medium hover:text-white bg-white text-darkblue font-bold py-2 px-4 rounded addborder" style={customStyle.addBorder}>
                  <Link to="/login">Log In</Link>
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
