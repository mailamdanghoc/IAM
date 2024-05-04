import axios from 'axios';
import React, { useState, useEffect } from 'react';

const GetLog = ({filename}) => {
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Fetch log data from server
      const response = await axios.get(`http://localhost:9000/api/admin/getlog?filename=${filename}`,{
        withCredentials: true,
            headers: {
            "Content-Type": "application/json",
            },
      });
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch log data');
    //   }
      // Read response as text
      const data = await response.data.logdata.trim().split('\n').map(line => JSON.parse(line));
      console.log(data)
      // Update state with log data
      setLogData(data);
      // Update loading state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleDeleteLog = async () => {
    try {
        const response = await axios.post(`http://localhost:9000/api/admin/deletelog`,{filename: filename},{
            withCredentials: true,
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch log data');
        }
        setLogData('Log is clear')
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
  }

  if (!logData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Log Viewer</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
            {
                logData.map((entry, index) => (
                    <pre key={index}>{entry.message}</pre>
                ))
            }
            <button
              onClick={() => handleDeleteLog()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Log
            </button>
        </>
      )}
    </div>
  );
};

const LogViewer = () => {
    const options = [
      { id: 1, label: 'Authentication Log' },
      { id: 2, label: 'Account Log' },
    ];
  
    const [selectedOption, setSelectedOption] = useState(options[0]);
  
    const handleOptionChange = (option) => {
      setSelectedOption(option);
    };
  
    return (
      <div className="container  max-w-screen-xl mx-auto my-8">
        <h1 className='text-4xl font-bold mb-8'>Log Management</h1>
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
          {selectedOption.id === 1 && <GetLog  filename={'authentication'}/>}
          {selectedOption.id === 2 && <GetLog  filename={'account'} />}
        </div>
      </div>
    );
};

export default LogViewer;
