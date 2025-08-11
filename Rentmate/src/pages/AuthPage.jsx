import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // adjust import path as necessary


// The main App component that manages the view state
export default function App() {
  // State to manage which component is currently visible
  const [currentView, setCurrentView] = useState('login');

  // A component to display the login and registration forms
const AuthPage = ({ view, onViewChange }) => {
  const isLogin = view === "login";

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setApiMessage("");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid 10-digit phone";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      // REGISTER
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await setDoc(doc(db, "users", user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString()
        });

        setApiMessage("Registration successful! Please check your email to verify your account.");
      } catch (err) {
        setApiMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // LOGIN
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          setApiMessage("Please verify your email before logging in.");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          console.log("User data:", userDoc.data());
        }

        setApiMessage("Login successful!");
      } catch (err) {
        setApiMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:max-w-md w-full">
        <button
          onClick={() => onViewChange("home")}
          className="flex justify-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          RentMate
        </button>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Or{" "}
              <button
                onClick={() => onViewChange("register")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => onViewChange("login")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:max-w-md w-full">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {apiMessage && (
            <div
              className={`mb-4 p-3 text-center rounded-md text-sm font-medium ${
                apiMessage.toLowerCase().includes("successful")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {apiMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full border rounded-md py-2 px-3 pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-400"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                    errors.agreeToTerms ? "border-red-500" : ""
                  }`}
                />
                <label className="ml-2 text-sm text-gray-900">
                  I agree to the{" "}
                  <button type="button" onClick={() => onViewChange("terms")} className="text-blue-600">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" onClick={() => onViewChange("privacy")} className="text-blue-600">
                    Privacy Policy
                  </button>
                </label>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
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
