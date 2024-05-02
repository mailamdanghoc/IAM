import React from 'react';

function ApproveSignupRequests() {
  const signupRequests = [
    {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      createdAt: '2024-05-01T10:30:00Z',
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john@example.com',
      createdAt: '2024-05-01T11:45:00Z',
    },
  ];

  const acceptRequest = (id) => {
  };

  const rejectRequest = (id) => {
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Approve Signup Requests</h2>
      <ul>
        {signupRequests.map(request => (
          <li key={request.id} className="mb-4 p-2 border rounded">
            <div>
              <p>{request.name}</p>
              <p>{request.email}</p>
              <p>{request.createdAt}</p>
              <button onClick={() => acceptRequest(request.id)} className="bg-gray-600 text-green-500 m-2 ml-0 px-2 py-1 rounded mr-2">Accept</button>
              <button onClick={() => rejectRequest(request.id)} className="bg-gray-600 text-red-300 m-2 ml-0 px-2 py-1 rounded">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManageGroups() {
  const groups = [
    {
      id: 1,
      name: 'Group 1',
      description: 'Description of Group 1',
      members: ['Member 1', 'Member 2', 'Member 3'],
    },
    {
      id: 2,
      name: 'Group 2',
      description: 'Description of Group 2',
      members: ['Member 4', 'Member 5', 'Member 6'],
    },
  ];

  const deleteGroup = (id) => {
  };
  const acceptGroup = (id) => {
};

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Manage Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group.id} className="mb-4 p-2 border rounded">
            <div>
              <p>{group.name}</p>
              <p>{group.description}</p>
              <ul>
                {group.members.map(member => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
              <button onClick={() => acceptGroup(groups.id)} className="bg-gray-600 text-green-500 m-2 ml-0 px-2 py-1 rounded mr-2">Accept</button>
              <button onClick={() => deleteGroup(groups.id)} className="bg-gray-600 text-red-300 m-2 ml-0 px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Peding() {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      <div className="mb-8">
        <ApproveSignupRequests />
      </div>

      <div>
        <ManageGroups />
      </div>
    </div>
  );
}
