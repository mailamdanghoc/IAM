import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DeleteRoleForm = () => {
  // State for form fields
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState(null);

  // Simulate fetching groups using useEffect
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Simulated Axios call to fetch groups

        const response = await axios.get(`http://localhost:9000/api/user/leavegroup`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        if (response.status >=200 && response.status<400) {
          const roles = []
          const newGroups = response.data.data.groups;
          for (const idx in newGroups){
            if (newGroups[idx]!=='Administrator')
              roles.push({
                id: idx,
                name: newGroups[idx],
                selected: false
              })
          }
          setGroups(roles)

        }
        
        
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Event handler for description input
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleGroupSelection = (groupId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, selected: !group.selected };
      }
      return group;
    }));
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roles = [];
    for (const gn of groups){
      if (gn.selected) roles.push(gn.name)
    }
    try {
      const response = await axios.post('http://localhost:9000/api/user/leavegroup',{
        groups: roles,
        description: description,
      },{
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
      })
      alert(response.data.message)
      window.location.href = "http://localhost:3000/profile";
    }catch (error){
      console.error("Error delete user account:", error);
    }
  };

  if (!groups) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Delete My Role</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
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
          <div className='flex justify-end'>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
            <Link to="/profile">
              Cancel
            </Link>
            </button>
          </div>
      </form>
    </div>
  );
};

export default DeleteRoleForm;
