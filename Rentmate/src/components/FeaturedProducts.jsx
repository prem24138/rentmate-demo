import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path
import { useNavigate } from 'react-router-dom';

// Featured Products Component (your existing component)

function FeaturedProducts({ onProductSelect }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const itemsSnapshot = await getDocs(collection(db, 'items'));

        const productsWithOwners = await Promise.all(
          itemsSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Fetch owner info
            let ownerData = { name: 'Unknown', verified: false };
            if (data.userId) {
              const ownerRef = doc(db, 'users', data.userId);
              const ownerSnap = await getDoc(ownerRef);
              if (ownerSnap.exists()) {
                ownerData = ownerSnap.data();
              }
            }

            return {
              id: docSnap.id,
              title: data.title,
              category: data.category,
              price: Number(data.price),
              location: data.location,
              description: data.description,
              features: data.features || [],
              ratings: Number(data.ratings) || 0,
              reviews: data.reviews || 0,
              rules: data.rules || [],
              image: data.images?.[0] || '/placeholder.jpg',
              owner: ownerData
            };
          })
        );

        setProducts(productsWithOwners);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    onProductSelect(product);
  };

  if (loading) {
    return (
      <section className="py-12 bg-white text-center">
        <p>Loading featured products...</p>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover our most popular rental items chosen by our community
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <button
                onClick={() => handleProductClick(product)}
                className="block h-48 w-full overflow-hidden border-none bg-transparent p-0 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={product.image}
                  alt={product.name}
                />
              </button>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                    ₹{product.price}/day
                  </span>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 fill-current ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.955L10 0l2.947 5.955 6.562.955-4.755 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-600">{product.reviews} reviews</p>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    📍 {product.location}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1 text-gray-600">Owner:</span>
                    <span className="font-medium">{product.owner.name}</span>
                    {product.owner.verified && <span className="text-green-500 ml-1">✔️</span>}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// export default FeaturedProducts;


// Product Details Component (simplified version of the previous component)
function ProductDetails({ productData, onBack }) {
    const navigate = useNavigate();

  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setShowBookingForm(false);
    navigate('/payment', {
      state: {
        product: productData,
        type: 'rental',
        bookingDetails: {
          ...bookingDates,
        }
      }
    });
  };

  // Calculate total when dates change
  useEffect(() => {
    if (bookingDates.startDate && bookingDates.endDate) {
      const start = new Date(bookingDates.startDate);
      const end = new Date(bookingDates.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalDays(diffDays);
      setTotalPrice(diffDays * productData.price);
    }
  }, [bookingDates, productData]);

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Product Selected</h2>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 cursor-pointer bg-transparent border-none text-base"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-600">
            <button
              onClick={onBack}
              className="hover:text-blue-600 cursor-pointer bg-transparent border-none text-sm text-gray-600"
            >
              Products
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={productData.image}
              alt={productData.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
              <p className="text-lg text-gray-600 mt-2">{productData.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 fill-current ${
                        i < Math.floor(productData.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.955L10 0l2.947 5.955 6.562.955-4.755 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({productData.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
                {productData.location}
              </div>
            </div>

            <div className="border-t border-b py-6">
              <div className="text-3xl font-bold text-gray-900">
                ₹{productData.price}/day
              </div>
              <p className="text-gray-600 mt-2">
                Status: <span className="text-green-600 font-medium">Available</span>
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Owner Information</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {productData.owner?.firstName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{productData.owner?.firstName}</span>
                    {productData.owner?.verified && (
                      <svg className="w-5 h-5 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Book {productData.name}</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDates.startDate}
                  onChange={(e) => setBookingDates(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDates.endDate}
                  onChange={(e) => setBookingDates(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {totalDays > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price per day:</span>
                    <span>₹{productData.price}</span>
                  </div>
                  <div className="border-t mt-2 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component that manages the state and navigation
function App() {
  const [currentView, setCurrentView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentView('details');
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'products' && (
        <FeaturedProducts onProductSelect={handleProductSelect} />
      )}
      
      {currentView === 'details' && (
        <ProductDetails
          productData={selectedProduct}
          onBack={handleBackToProducts}
        />
      )}
    </div>
  );
}

export default App;