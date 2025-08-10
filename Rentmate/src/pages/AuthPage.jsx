import React, { useState } from 'react';

// The main App component that manages the view state
export default function App() {
  // State to manage which component is currently visible
  const [currentView, setCurrentView] = useState('login');

  // A component to display the login and registration forms
  const AuthPage = ({ view, onViewChange }) => {
    const isLogin = view === 'login';

    // State for form data
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeToTerms: false
    });
    // State for form errors
    const [errors, setErrors] = useState({});
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    // State to manage OTP sending and verification
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    // State for messages from mock API
    const [apiMessage, setApiMessage] = useState('');
    // State to show loading spinner on form submission
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes and clear related errors
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      // Clear specific error for the input field
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
      // Clear API message when user starts typing
      setApiMessage('');
    };

    // Validate the form fields
    const validateForm = () => {
      const newErrors = {};
      if (!isLogin) {
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6 && !isLogin) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Simulate API call with a promise
    const simulateApiCall = (data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (isLogin && data.email === 'test@example.com' && data.password === 'password123') {
            resolve({ message: "Login successful!" });
          } else if (!isLogin && data.email === 'newuser@example.com') {
            reject({ message: 'User already exists.' });
          } else if (isLogin && otpSent && otp === '123456') {
             resolve({ message: "OTP verification successful!" });
          } else if (isLogin && otpSent) {
             reject({ message: "Invalid OTP. Please try again." });
          } else if (!isLogin) {
            resolve({ message: "Registration successful!" });
          } else {
            reject({ message: 'Invalid credentials or user not found.' });
          }
        }, 1000); // 1-second delay to simulate network latency
      });
    };

    // Handle form submission for both login and registration
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      if (otpSent) {
        try {
          const res = await simulateApiCall({ otp });
          setApiMessage(res.message);
          setErrors({});
        } catch (err) {
          setApiMessage(err.message);
          setErrors({ otp: err.message });
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      if (validateForm()) {
        if (!isLogin) {
          // Registration logic
          try {
            const res = await simulateApiCall(formData);
            setApiMessage(res.message || "Registration successful!");
          } catch (err) {
            setApiMessage(err.message || "Registration failed. Please try again.");
          } finally {
            setIsLoading(false);
          }
        } else {
          // Login logic
          try {
            const res = await simulateApiCall(formData);
            setApiMessage(res.message || "Login successful!");
            // Simulate sending OTP on successful login form submission
            setOtpSent(true);
            setApiMessage(`OTP sent to ${formData.email}. The mock OTP is 123456.`);
          } catch (err) {
            setApiMessage(err.message || "Login failed. Please try again.");
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    const handleSocialLogin = (provider) => {
      setApiMessage(`Simulating login with ${provider}... (Mock successful)`);
    };
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="sm:mx-auto sm:max-w-md w-full">
          <button onClick={() => onViewChange('home')} className="flex justify-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RentMate
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Or{' '}
                <button onClick={() => onViewChange('register')} className="font-medium text-blue-600 hover:text-blue-500">
                  create a new account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => onViewChange('login')} className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:max-w-md w-full">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <i className="fab fa-google text-red-600 mr-2"></i>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <i className="fab fa-facebook text-blue-600 mr-2"></i>
                Continue with Facebook
              </button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {apiMessage && (
              <div className={`mt-4 p-3 text-center rounded-md text-sm font-medium ${
                  apiMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                  {apiMessage}
              </div>
            )}

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {!isLogin && !otpSent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              {!otpSent ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  
                  {!isLogin && (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`block w-full border rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>
                  
                  {!isLogin && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  )}
                  
                  {!isLogin && (
                    <div className="flex items-start">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                          errors.agreeToTerms ? 'border-red-500' : ''
                        }`}
                      />
                      <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                        I agree to the{' '}
                        <button type="button" onClick={() => onViewChange('terms')} className="text-blue-600 hover:text-blue-500">
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button type="button" onClick={() => onViewChange('privacy')} className="text-blue-600 hover:text-blue-500">
                          Privacy Policy
                        </button>
                      </label>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    A verification code has been sent to your {!isLogin ? 'email and phone' : 'email'}
                  </p>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                  {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
                  <button
                    type="button"
                    onClick={() => setApiMessage('OTP resent!')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              {isLogin && !otpSent && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button type="button" onClick={() => onViewChange('forgotPassword')} className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </button>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    otpSent ? 'Verify OTP' : (isLogin ? 'Sign in' : 'Sign up')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ForgotPasswordPage = ({ onViewChange }) => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="sm:mx-auto sm:max-w-md w-full">
          <button onClick={() => onViewChange('home')} className="flex justify-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RentMate
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a password reset link.
          </p>
          <form className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Password
              </button>
            </div>
            <div className="text-center text-sm">
              <button type="button" onClick={() => onViewChange('login')} className="font-medium text-blue-600 hover:text-blue-500">
                Back to Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TermsAndPrivacyPage = ({ onViewChange, title, content }) => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="sm:mx-auto sm:max-w-xl w-full">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => onViewChange('home')} className="flex justify-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RentMate
            </button>
            <button
              onClick={() => onViewChange('login')}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Sign in
            </button>
          </div>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              {title}
            </h2>
            <div className="text-gray-700 space-y-4">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HomePage = ({ onViewChange }) => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-inter text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome to RentMate</h1>
        <p className="mt-4 text-lg text-gray-600">This is a landing page for your application.</p>
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => onViewChange('login')}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
          <button
            onClick={() => onViewChange('register')}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>
        </div>
      </div>
    );
  };

  const termsContent = (
    <>
      <p>
        These terms and conditions outline the rules and regulations for the use of RentMate's Website.
      </p>
      <p>
        By accessing this website we assume you accept these terms and conditions. Do not continue to use RentMate if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <p>
        The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
      </p>
    </>
  );

  const privacyContent = (
    <>
      <p>
        At RentMate, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by RentMate and how we use it.
      </p>
      <p>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
      </p>
      <p>
        This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in RentMate. This policy is not applicable to any information collected offline or via channels other than this website.
      </p>
    </>
  );

  switch (currentView) {
    case 'login':
      return <AuthPage view="login" onViewChange={setCurrentView} />;
    case 'register':
      return <AuthPage view="register" onViewChange={setCurrentView} />;
    case 'forgotPassword':
      return <ForgotPasswordPage onViewChange={setCurrentView} />;
    case 'terms':
      return <TermsAndPrivacyPage onViewChange={setCurrentView} title="Terms of Service" content={termsContent} />;
    case 'privacy':
      return <TermsAndPrivacyPage onViewChange={setCurrentView} title="Privacy Policy" content={privacyContent} />;
    case 'home':
    default:
      return <HomePage onViewChange={setCurrentView} />;
  }
}
