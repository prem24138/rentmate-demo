import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function ProductsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = location.pathname.split('/')[2] || '';
  const searchQuery = queryParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: categoryParam,
    minPrice: '',
    maxPrice: '',
    location: '',
    rating: ''
  });

  // Dummy product data (could be replaced with API)
  const [allProducts] = useState([
  ]);

  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.minPrice !== '') {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.location) {
      filtered = filtered.filter(p =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.rating) {
      filtered = filtered.filter(p => p.rating >= Number(filters.rating));
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProducts(filtered);
  }, [filters, searchQuery, allProducts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      rating: ''
    });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'appliances', label: 'Home Appliances' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
              Clear all
            </button>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range (Rs/day)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Any location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-1">Minimum Rating</label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Any</option>
                <option value="4.5">4.5+</option>
                <option value="4">4.0+</option>
                <option value="3.5">3.5+</option>
                <option value="3">3.0+</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products */}
        <section className="w-full md:w-3/4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : filters.category
                  ? categories.find(c => c.value === filters.category)?.label
                  : 'All Products'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{products.length} items found</p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          ${product.price}/day
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-yellow-500">
                        {'⭐'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))}
                        <span className="text-gray-600 ml-2">({product.reviews})</span>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>📍 {product.location}</div>
                        <div>
                          {product.owner.verified && <span className="text-green-500 mr-1">✔️</span>}
                          {product.owner.name}
                        </div>
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="block text-center mt-3 bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium">No products found</h3>
              <p className="mb-4">Try adjusting your filters or search query.</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductsPage;
