import React, { useState } from 'react';

export default function MyGroup() {
  const [groups, setGroups] = useState([
    'Group 1',
    'Group 2',
    'Group 3',
  ]);

  const [newGroup, setNewGroup] = useState('');

  const handleAddGroup = () => {
    if (newGroup.trim() !== '') {
      setGroups([...groups, newGroup]);
      setNewGroup('');
    }
  };

  const handleDeleteGroup = (index) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Your Groups</h1>

      <ul>
        {groups.map((group, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <span>{group}</span>
            <button onClick={() => handleDeleteGroup(index)} className="ml-2 text-red-500 hover:text-red-700">Delete</button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Enter group name"
          className="border border-gray-300 rounded-md px-3 py-1 mr-2"
        />
        <button onClick={handleAddGroup} className="bg-gray-600 text-white rounded-md px-4 py-1">Add Group</button>
      </div>
    </div>
  );
}
