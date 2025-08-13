import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // adjust path if needed

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, type, bookingDetails: initialBooking } = location.state || {};

  console.log(product);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: initialBooking?.startDate || '',
    endDate: initialBooking?.endDate || '',
    startTime: initialBooking?.startTime || '09:00',
    endTime: initialBooking?.endTime || '18:00',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No product selected</h2>
          <button
            onClick={() => navigate('/')}
            className="text-teal-600 hover:text-teal-700"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate) return 1;
    const start = new Date(bookingDetails.startDate);
    const end = new Date(bookingDetails.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const totalDays = calculateDays();
  const pricePerDay = Number(product?.price || 0);
  const subtotal = totalDays * pricePerDay;
  const serviceFee = Math.round(subtotal * 0.05);
  const securityDeposit = Math.round(pricePerDay * 0.5);
  const totalAmount = subtotal + serviceFee + securityDeposit;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_7ZnT8A3axVA7WT", // Public Key (safe)
      amount: totalAmount * 100, // Razorpay takes amount in paise
      currency: "INR",
      name: "Your Company Name",
      description: `Booking for ${product.title}`,
      handler: async function (response) {
        try {
          const user = auth.currentUser;
          if (!user) {
            alert("Please log in first.");
            setIsProcessing(false);
            return;
          }

          // Save booking in Firestore
          await setDoc(
            doc(db, "users", user.uid, "rentals", `${Date.now()}`),
            {
              productId: product.id,
              productTitle: product.title,
              productImage: product.images?.[0] || "",
              bookingDetails,
              totalAmount,
              paymentId: response.razorpay_payment_id,
              timestamp: new Date(),
            }
          );

          setPaymentComplete(true);
        } catch (error) {
          console.error("Error saving booking:", error);
          alert("Payment succeeded, but saving booking failed.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
        contact: "9999999999",
      },
      theme: {
        color: "#00897B",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ---------- PAYMENT SUCCESS VIEW ----------
  if (paymentComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your booking has been confirmed</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Product:</span>
                <p className="font-medium">{product.title}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-medium">{totalDays} days</p>
              </div>
              <div>
                <span className="text-gray-600">Start Date:</span>
                <p className="font-medium">{bookingDetails.startDate}</p>
              </div>
              <div>
                <span className="text-gray-600">End Date:</span>
                <p className="font-medium">{bookingDetails.endDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-6 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- MAIN PAYMENT PAGE ----------
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

          {/* Product Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
                <div className="text-lg font-bold text-teal-600">
                  ₹{product.price}/day
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time Pickers */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                required
                value={bookingDetails.startDate}
                onChange={(e) => setBookingDetails({ ...bookingDetails, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                required
                value={bookingDetails.endDate}
                onChange={(e) => setBookingDetails({ ...bookingDetails, endDate: e.target.value })}
                min={bookingDetails.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={bookingDetails.startTime}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  End Time
                </label>
                <input
                  type="time"
                  value={bookingDetails.endTime}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">₹{pricePerDay} × {totalDays} days</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">₹{serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security deposit (refundable)</span>
                <span className="font-medium">₹{securityDeposit}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Payment method selection */}
            {/* ... (keep your existing radio buttons) */}

            {/* Security Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Secure Payment</h4>
                  <p className="text-sm text-blue-800">
                    Your payment information is encrypted and secure. Security deposit will be refunded after item return.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing || !bookingDetails.startDate || !bookingDetails.endDate}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                isProcessing || !bookingDetails.startDate || !bookingDetails.endDate
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Pay ₹{totalAmount}</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
