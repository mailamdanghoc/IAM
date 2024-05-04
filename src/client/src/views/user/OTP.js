import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'universal-cookie';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOTP] = useState(new Array(length).fill(''));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef(null);

  const handleOnChange = (e, index) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(index - 1);
    else setActiveOTPIndex(index + 1);

    if (index === length - 1 && value !== '') {
      onComplete(newOTP.join(''));
    }

    setOTP(newOTP);
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === 'Backspace') 
      {
        const newOTP = [...otp];
        newOTP[index] = '';
        setOTP(newOTP);
        setActiveOTPIndex(index - 1);
      }
  };

  useEffect(() => {
    if (activeOTPIndex < length && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeOTPIndex]);

  return (
    <div className="flex justify-center">
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <input
            ref={activeOTPIndex === index ? inputRef : null}
            type="number"
            maxLength="1"
            className="mx-1 w-12 h-12 text-2xl text-center border rounded focus:outline-none focus:border-blue-500"
            value={digit}
            onChange={(e) => handleOnChange(e, index)}
            onKeyDown={(e) => handleOnKeyDown(e, index)}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const OTP = () => {
  const [otp, setOTP] = useState('');
  const [err, setErr] = useState('');

  const handleOTPComplete = async (value) => {
    setOTP(value);
    try {
      const response = await axios.post(
        'http://localhost:9000/api/auth/verify-otp',
        { otp: value },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status >= 200 && response.status < 400) {
        const cookies = new Cookies();
        cookies.set('isAuth', true, { path: '/' });
        cookies.set('isAdmin', response.data.isAdmin, { path: '/' });
        console.log('User login successfully');
        setErr('');
        window.location.href = 'http://localhost:3000/profile';
      }
    } catch (error) {
      setErr(error.response.data.message);
      console.error('Error during form submission:', error);
    }
  };

  return (
    <section className="bg-gray-50 mx-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {err !== '' && (
              <div className="text-red font-bold">
                Error: {err}
              </div>
            )}
            <h1 className="text-3xl font-bold mb-4">Enter OTP</h1>
            <OTPInput onComplete={handleOTPComplete} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTP;
