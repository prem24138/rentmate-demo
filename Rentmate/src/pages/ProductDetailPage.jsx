// Modern and polished version using TailwindCSS with modal booking and visible pricing (toast removed)
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Star, MapPin } from 'lucide-react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust the path

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentDates, setRentDates] = useState({ startDate: '', endDate: '' });
  const [bookingTime, setBookingTime] = useState({ startTime: '', endTime: '' });
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [owner, setOwner] = useState(null); // NEW

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "items", id); // assumes "products" collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.id ? { id: docSnap.id, ...docSnap.data() } : null;
          setProduct(productData);

           // Fetch owner details
          if (productData.userId) {
            const ownerRef = doc(db, "users", productData.userId);
            const ownerSnap = await getDoc(ownerRef);
            if (ownerSnap.exists()) {
              setOwner(ownerSnap.data());
            }
          }
        } else {
          setProduct(null); // not found
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (rentDates.startDate && rentDates.endDate && product) {
      const start = new Date(rentDates.startDate);
      const end = new Date(rentDates.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0) {
        setTotalDays(diff);
        setTotalPrice(diff * product.price);
      }
    }
  }, [rentDates, product]);

  const handleBookNow = (e) => {
    e.preventDefault();
    setShowModal(false);
    navigate('/payment', {
      state: {
        product,
        type: 'rental',
        bookingDetails: {
          ...rentDates,
          ...bookingTime
        }
      }
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-900">Home</Link> / <Link to="/products" className="hover:text-gray-900">Products</Link> / <span className="text-gray-800">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Images */}
        <div>
          <div className="relative pb-[75%] rounded overflow-hidden">
            <img src={product.images[selectedImage]} alt={product.title} className="absolute inset-0 w-full h-full object-cover rounded" />
          </div>
          <div className="flex mt-3 gap-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`h-20 w-24 object-cover rounded cursor-pointer border ${selectedImage === i ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
            ))}
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>

          <p className="text-gray-700 mt-4 mb-6">{product.description}</p>

          <div className="mb-4">
            <h3 className="font-semibold">Features</h3>
            <ul className="list-disc list-inside text-gray-600">
              {product.features?.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Rules</h3>
            <ul className="list-disc list-inside text-gray-600">
              {product.rules?.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Pricing + Modal Trigger */}
          <div className="mt-6 bg-gray-100 p-4 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-gray-800">Rs {product.price} <span className="text-sm font-normal text-gray-600">/ day</span></p>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">Book Now</button>
            </div>
          </div>

          {/* Owner */}
          <div className="mt-8 flex items-center gap-4 border-t pt-4">
            {/* <img src={product.owner.avatar} alt={product.owner.name} className="w-14 h-14 rounded-full object-cover" /> */}
            <div>
              <h4 className="font-semibold text-gray-800 flex items-center gap-1">{owner.firstName} {owner.verified && <CheckCircle className="text-green-500 w-4 h-4" />}</h4>
              <p className="text-sm text-gray-600">Rating: {owner.rating} | {owner.response_rate} response rate</p>
              <p className="text-sm text-gray-600">Joined: {owner.createdAt}</p>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Reviews</h3>
            {/* {product.reviews.map((r) => (
              <div key={r.id} className="flex gap-3 mb-4">
                <img src={r.avatar} alt={r.user} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-800">{r.user} <span className="text-gray-500 text-sm">{r.date}</span></p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{r.comment}</p>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Book {product.name}</h2>
            <form onSubmit={handleBookNow} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="startDate" value={rentDates.startDate} onChange={e => setRentDates({ ...rentDates, startDate: e.target.value })} required className="border px-3 py-2 rounded w-full" />
                <input type="date" name="endDate" value={rentDates.endDate} onChange={e => setRentDates({ ...rentDates, endDate: e.target.value })} required className="border px-3 py-2 rounded w-full" />
                <input type="time" name="startTime" value={bookingTime.startTime} onChange={e => setBookingTime({ ...bookingTime, startTime: e.target.value })} className="border px-3 py-2 rounded w-full" />
                <input type="time" name="endTime" value={bookingTime.endTime} onChange={e => setBookingTime({ ...bookingTime, endTime: e.target.value })} className="border px-3 py-2 rounded w-full" />
              </div>
              {totalDays > 0 && <p className="text-sm text-gray-700 font-medium">Total: {totalDays} day(s) — Rs {totalPrice}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border text-gray-700">Cancel</button>
                <button type="submit" disabled={totalDays <= 0} className={`px-4 py-2 rounded text-white font-semibold ${totalDays > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
