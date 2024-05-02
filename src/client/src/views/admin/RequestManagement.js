import React, { useEffect, useState } from "react";
import axios from "axios";

const RegisterRequest = () => {
    // Mock data
    // const borrowRequests = [
    //     { id: 1, studentId: '123', studentName: 'John Doe', bookName: 'React Mastery', createDate: '2023-01-01' },
    //     // Add more data as needed
    // ];
    const [registerRequest, setRegisterRequest] = useState(null)
    const fetchRequest = async () =>{
        try{
            const response = await axios.get("http://localhost:9000/api/admin/pendingRegisterRequest",{
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
            });
            if (response.status>=200 && response.status<400){
                console.log(response.data.data.users)
                setRegisterRequest(response.data.data.users)
            }

        }catch (error){
            console.error("Error fetching register request:", error);
        }

    }
    useEffect(() => {
        fetchRequest();
    }, []);

    const handleRequest = async (uid, accept) => {
        try {
            await axios.post("http://localhost:9000/api/admin/handleRegisterRequest", {
                accept: accept,
                uid: uid,
            },{
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchRequest()
        } catch (error) {
            console.error("Error handling request:", error);
        }
    };
  
    if (!registerRequest) return <div>Loading...</div>;
    return (
        <div>
        <table className="min-w-full border border-gray-300 text-center">
            <thead>
            <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone number</th>
                <th className="border px-4 py-2">Request Groups</th>
                <th className="border px-4 py-2">Decision</th>
            </tr>
            </thead>
            <tbody>
            {registerRequest.map((request, index) => (
                <tr key={request.uid}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{request.cn}</td>
                <td className="border px-4 py-2">{request.sn}</td>
                <td className="border px-4 py-2">{request.mail}</td>
                <td className="border px-4 py-2">{request.telephoneNumber}</td>
                <td className="border px-4 py-2">{request.groups.join(', ')}</td>
                <td className="border px-4 py-2">
                    <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={()=>handleRequest(request.uid,true)}>Accept</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={()=>handleRequest(request.uid,false)}>Decline</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

const UpdateRequest = () => {
    const [updateRequest, setUpdateRequest] = useState(null)

    const fetchRequest = async () =>{
        try{
            const response = await axios.get("http://localhost:9000/api/admin/pendingUpdateRequest",{
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
            });
            if (response.status>=200 && response.status<400){
                console.log(response.data.data.users)
                setUpdateRequest(response.data.data.users)
            }

        }catch (error){
            console.error("Error fetching register request:", error);
        }

    }
    useEffect(() => {
        fetchRequest();
    }, []);

    const handleRequest = async (uid, accept) => {
        try {
            await axios.post("http://localhost:9000/api/admin/handleUpdateRequest", {
                accept: accept,
                uid: uid,
            },{
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchRequest()
        } catch (error) {
            console.error("Error handling request:", error);
        }
    };
  
    if (!updateRequest) return <div>Loading...</div>;
    return (
        <div>
        <table className="min-w-full border border-gray-300 text-center">
            <thead>
            <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Request Groups</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Decision</th>
            </tr>
            </thead>
            <tbody>
            {updateRequest.map((request, index) => (
                <tr key={request.uid}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{request.uid}</td>
                <td className="border px-4 py-2">{request.groups.join(', ')}</td>
                <td className="border px-4 py-2">{request.description}</td>
                <td className="border px-4 py-2">
                    <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={()=>handleRequest(request.uid,true)}>Accept</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={()=>handleRequest(request.uid,false)}>Decline</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};


const RequestManagement = () => {
    const options = [
      { id: 1, label: 'Request for new account' },
      { id: 2, label: 'Request for new role' },
    ];
  
    const [selectedOption, setSelectedOption] = useState(options[0]);
  
    const handleOptionChange = (option) => {
      setSelectedOption(option);
    };
  
    return (
      <div className="container  max-w-screen-xl mx-auto my-8">
        <h1 className='text-4xl font-bold mb-8'>User Management</h1>
        <div className="flex space-x-4">
          {options.map((option) => (
            <button
              key={option.id}
              className={`${
                selectedOption.id === option.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-700'
              } px-4 py-2 rounded`}
              onClick={() => handleOptionChange(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
  
        <div className="mt-8">
          {selectedOption.id === 1 && <RegisterRequest />}
          {selectedOption.id === 2 && <UpdateRequest />}
        </div>
      </div>
    );
};
  
export default RequestManagement;


