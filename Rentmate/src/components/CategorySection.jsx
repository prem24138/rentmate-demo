import { Link } from 'react-router-dom';

function CategorySection() {
  const categories = [
    {
      id: 1,
      name: 'Vehicles',
      description: 'Cars, bikes, and more',
      icon: 'fas fa-car',
      link: '/products/vehicles',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Home Appliances',
      description: 'Refrigerators, ACs, washing machines',
      icon: 'fas fa-home',
      link: '/products/appliances',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Furniture',
      description: 'Tables, chairs, beds, and more',
      icon: 'fas fa-couch',
      link: '/products/furniture',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Electronics',
      description: 'Cameras, laptops, speakers',
      icon: 'fas fa-laptop',
      link: '/products/electronics',
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Browse by Category</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find exactly what you need from our wide range of rental options
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={category.link}
              className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`${category.color} text-white p-3 rounded-full mb-4`}>
                <i className={`${category.icon} text-xl`}></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">{category.description}</p>
              <div className="mt-4 text-blue-600 group-hover:text-blue-800">
                Browse Category <i className="fas fa-arrow-right ml-1"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;