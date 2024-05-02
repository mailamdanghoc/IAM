import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const imageUrl = 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'

export default function GroupManagement() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [usersData, setUsersData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/admin/groupinfo`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      
      if (response.status >=200 && response.status<400) {
        const ud = response.data.data.usersData;
        console.log(response.data.data.usersData)
        setUsersData(ud)
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!usersData ) return <div>Loading...</div>;

  return (
    <section className="p-10">
      <div className="flex items-center mb-4">
        <label htmlFor="groupSelect" className="mr-2">Select Group:</label>
        <select id="groupSelect" onChange={(e) => setSelectedGroup(e.target.value)} value={selectedGroup}>
          <option value="">All Groups</option>
          {usersData.map((group, index) => (
                <option value={group.group}>{group.group}</option>
              ))}
        </select>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {usersData.map((groupOfUser) => (
          <div key={groupOfUser.group}>
            {selectedGroup === '' || groupOfUser.group === selectedGroup ? (
              <ul>
                {groupOfUser.group}
                {groupOfUser.users.map((person) => (
                    <Link to={"detail/" + person.uid}>
                    <li key={person.mail} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={imageUrl} alt="" />
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{person.cn + person.sn}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.mail}</p>
                        </div>
                        </div>
                    </li>
                    </Link>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </ul>
    </section>
  );
}
