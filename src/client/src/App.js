// src/App.js
import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Hello from React.js!</h1>
        {data && <p className="text-lg">Data from server: {data.message}</p>}
      </div>
    </div>
  );
};

export default App;
