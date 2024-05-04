import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [groups, setGroups] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPass: "",
    phoneNumber: null,
    firstName: "",
    lastName: "",
  });

  const [err,setErr] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roles = [];
    for (const gn of groups){
      if (gn.selected) roles.push(gn.name)
    }
    try {
        // Add your form submission logic here
        const response = await axios.post("http://localhost:9000/api/auth/register", {
          email: formData.email,
          password: formData.password,
          confirmPass: formData.confirmPass,
          phoneNumber: formData.phoneNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roles: roles
        }, {
          withCredentials: true,
          headers: {
              "Content-Type": "application/json"
          }
        });
  
        if (response.status >=200 && response.status<400) {
            alert(response.data.message)
            console.log("User register successfully");
            setErr('');
            window.location.href = "http://localhost:3000/login"
          
        }
      } catch (error) {
        console.error("Failed to register user:", error);
        setErr(error.response.data.message)
        console.error("Error during form submission:", error);
      }
  };
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/auth/register`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      
      if (response.status >=200 && response.status<400) {
        const roles = []
        for (const idx in response.data.data.roles){
          if (response.data.data.roles[idx]!='Administrator')
            roles.push({
              id: idx,
              name: response.data.data.roles[idx],
              selected: false
            })
        }
        setGroups(roles)
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGroupSelection = (groupId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, selected: !group.selected };
      }
      return group;
    }));
  };


  if (!groups) return <div>Loading...</div>;
  

  return (
    <section className="bg-gray-50 pb-20">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            {err!=='' && <div className="text-red font-bold">
                Error: {err}
            </div>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input type="email" name="email" id="email" 
                value={formData.email} onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                <input type="text" name="firstName" id="firstName" 
                value={formData.firstName} onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" placeholder="Your first name" required />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                <input type="text" name="lastName" id="lastName" 
                value={formData.lastName} onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" placeholder="Your last name" required />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
                <input type="tel" name="phoneNumber" id="phoneNumber" 
                value={formData.phoneNumber} onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" placeholder="Your phone number" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" name="password" id="password" 
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" required />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                <input type="password" name="confirmPass" id="confirmPass" 
                value={formData.confirmPass} onChange={handleChange}
                placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Select Groups</label>
                {groups.map(group => (
                  <div key={group.id} className="flex items-center">
                    <input
                      id={`group-${group.id}`}
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-300"
                      checked={group.selected}
                      onChange={() => handleGroupSelection(group.id)}
                    />
                    <label htmlFor={`group-${group.id}`} className="ml-2 text-sm text-gray-900">{group.name}</label>
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create an account</button>
              <p className="text-sm font-light text-gray-500">
                Already have an account? <a href="/login" className="font-medium text-gray-600 hover:underline">Login here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
