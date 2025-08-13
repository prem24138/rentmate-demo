import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ListItemPage from './pages/ListItemPage';
import  PaymentPage  from './pages/PaymentPage';
import { useState, useEffect } from 'react';


function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="mt-4 text-xl font-medium text-blue-600">Loading RentMate...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:category" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<AuthPage isLogin={true} />} />
            <Route path="/register" element={<AuthPage isLogin={false} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/list-item" element={<ListItemPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-700 mb-6">Page Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <a href="/" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                  Go Back Home
                </a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;