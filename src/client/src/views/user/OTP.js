import axios from 'axios';
import React, { useState } from 'react';
import Cookies from "universal-cookie"

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOTP] = useState(new Array(length).fill(''));
    
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!isNaN(value) && value !== '') {
      const updatedOTP = [...otp];
      updatedOTP[index] = value;
      setOTP(updatedOTP);

      // If all input fields are filled, call onComplete callback
      if (updatedOTP.every((val) => !isNaN(val) && val !== '')) {
        onComplete(updatedOTP.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    if (pastedData.length === length && !isNaN(pastedData)) {
      setOTP(pastedData.split(''));
      onComplete(pastedData);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      const updatedOTP = [...otp];
      updatedOTP[index - 1] = '';
      setOTP(updatedOTP);
    }
  };

  return (
    <div className="flex justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          className="mx-1 w-12 h-12 text-2xl text-center border rounded focus:outline-none focus:border-blue-500"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleBackspace(e, index)}
        />
      ))}
    </div>
  );
};


const OTP = () => {
    const [otp, setOTP] = useState('');
    const [err,setErr] = useState('');

    const handleOTPComplete = async (value) => {
        setOTP(value);
        try {
            const response = await axios.post("http://localhost:9000/api/auth/verify-otp",{
              otp: value
            },{
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.status >=200 && response.status<400) {
                const cookies = new Cookies();
                cookies.set('isAuth', true, { path: '/' });
                cookies.set('isAdmin', response.data.isAdmin, { path: '/' });
                console.log("User login successfully");
                setErr('');
                window.location.href = "http://localhost:3000/profile"
            
            }
        } catch (error) {
            setErr(error.response.data.message)
            console.error("Error during form submission:", error);
        }
        
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {err!=='' && <div className="text-red font-bold">
                    Error: {err}
                </div>}
            <h1 className="text-3xl font-bold mb-4">Enter OTP</h1>
            <OTPInput onComplete={handleOTPComplete} />
            <p className="mt-4">Entered OTP: {otp}</p>
        </div>
    );
}

export default OTP;
