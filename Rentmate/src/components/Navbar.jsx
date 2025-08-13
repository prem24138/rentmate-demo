import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // adjust path
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  // Track auth state and fetch name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setFirstName(userDoc.data().firstName || "");
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      } else {
        setFirstName("");
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              RentMate
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link to="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
              Browse
            </Link>
            <Link to="/products/vehicles" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
              Vehicles
            </Link>
            <Link to="/products/electronics" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
              Electronics
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex sm:items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 p-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {firstName && <span className="ml-1 text-sm font-medium">{firstName}</span>}
                </Link>
              </div>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-3 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-blue-600 text-base font-medium">
            Home
          </Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-blue-600 text-base font-medium">
            Browse
          </Link>
          <Link to="/products/vehicles" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-blue-600 text-base font-medium">
            Vehicles
          </Link>
          <Link to="/products/electronics" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-blue-600 text-base font-medium">
            Electronics
          </Link>
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {firstName && <span className="ml-2 text-sm font-medium">{firstName}</span>}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
