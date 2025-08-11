import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('my-rentals');
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        await fetchUserItems(currentUser.uid);
      }
    });

    return () => unsub();
  }, [navigate]);

  const fetchUserItems = async (uid) => {
    try {
      const q = query(collection(db, "items"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(data);
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  }
  // Mock user data
  // const user = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   joinDate: "January 2023",
  //   verified: true,
  //   wallet: 250,
  //   avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  // };

  // Mock rentals data
  const myRentals = [
    {
      id: "1",
      title: "Canon EOS R5 Camera",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      status: "active",
      startDate: "2023-07-15",
      endDate: "2023-07-20",
      price: 45,
      owner: "Sarah Johnson"
    },
    {
      id: "2",
      title: "Mountain Bike",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      status: "completed",
      startDate: "2023-06-10",
      endDate: "2023-06-17",
      price: 25,
      owner: "Mike Williams"
    }
  ];

  // Mock listed items data
  const myListings = [
    {
      id: "3",
      title: "MacBook Pro 16-inch",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      status: "active",
      price: 65,
      rentals: 4,
      rating: 4.8,
      views: 156
    },
    {
      id: "4",
      title: "Drone DJI Mavic Air 2",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      status: "active",
      price: 55,
      rentals: 2,
      rating: 4.5,
      views: 98
    }
  ];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Welcome to your dashboard. Here you can manage your rentals, listings, and account settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            {/* User profile card */}
            {/* <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    {user.name}
                    {user.verified && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Wallet Balance</span>
                  <span className="text-lg font-semibold text-green-600">${user.wallet}</span>
                </div>
                <button className="w-full py-2 px-4 border border-blue-600 rounded-md text-blue-600 text-sm font-medium hover:bg-blue-50">
                  Add Funds
                </button>
              </div>
            </div> */}

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveTab('my-rentals')}
                className={`w-full text-left px-6 py-3 flex items-center ${activeTab === 'my-rentals' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Rentals
              </button>
              <button
                onClick={() => setActiveTab('my-listings')}
                className={`w-full text-left px-6 py-3 flex items-center ${activeTab === 'my-listings' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                My Listings
              </button>
              <Link to="/list-item" className="w-full bg-blue-600 text-white text-center py-3 font-medium block hover:bg-blue-700">
                List a New Item
              </Link>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:w-3/4">
            {/* My Rentals Tab */}
            {activeTab === 'my-rentals' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Rentals</h2>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      Filter
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      Sort
                    </button>
                  </div>
                </div>

                {myRentals.length > 0 ? (
                  <div className="space-y-4">
                    {myRentals.map(rental => (
                      <div key={rental.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                        <div className="sm:w-1/4">
                          <img src={rental.image} alt={rental.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-4 sm:p-6 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm text-gray-500">{rental.category}</span>
                              <h3 className="text-lg font-semibold mb-1">{rental.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">From {rental.owner}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${rental.status === 'active' ? 'bg-green-100 text-green-800' :
                                rental.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Start Date</p>
                              <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">End Date</p>
                              <p className="font-medium">{new Date(rental.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Price/Day</p>
                              <p className="font-medium">${rental.price}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="font-medium">${rental.price * Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <Link to={`/product/${rental.id}`} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                              View Details
                            </Link>
                            {rental.status === 'active' && (
                              <button className="px-4 py-2 border border-red-500 text-red-500 text-sm font-medium rounded-md hover:bg-red-50">
                                Cancel
                              </button>
                            )}
                            {rental.status === 'completed' && (
                              <button className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50">
                                Write Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Rentals Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't rented any items yet.</p>
                    <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* My Listings Tab */}
            {activeTab === 'my-listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Listings</h2>
                  <Link to="/list-item" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    Add New Listing
                  </Link>
                </div>

                {items && items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map(listing => (
                      <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                        <div className="sm:w-1/4">
                          <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-4 sm:p-6 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm text-gray-500">{listing.category}</span>
                              <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                              <div className="flex items-center">
                                <div className="flex text-yellow-400 mr-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-medium">{listing.rating}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-800' :
                                listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {/* {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)} */}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Price/Day</p>
                              <p className="font-medium">${listing.price}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Rentals</p>
                              <p className="font-medium">{listing.rentals}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Views</p>
                              <p className="font-medium">{listing.views}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <Link to={`/product/${listing.id}`} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                              View Listing
                            </Link>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50">
                              Edit
                            </button>
                            {listing.status === 'active' ? (
                              <button className="px-4 py-2 border border-yellow-500 text-yellow-600 text-sm font-medium rounded-md hover:bg-yellow-50">
                                Disable
                              </button>
                            ) : (
                              <button className="px-4 py-2 border border-green-500 text-green-600 text-sm font-medium rounded-md hover:bg-green-50">
                                Enable
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Listings Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't listed any items for rent yet.</p>
                    <Link to="/list-item" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      List an Item
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;