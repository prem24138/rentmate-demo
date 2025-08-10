import { useState } from 'react';

function Testimonials() {
  const [testimonials] = useState([
    {
      id: 1,
      name: 'Emily Johnson',
      role: 'Frequent Renter',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'RentMate has been a game-changer for me. I was able to furnish my entire apartment temporarily without breaking the bank. The verification process made me feel secure about who I was renting from.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mark Wilson',
      role: 'Product Owner',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'As someone with extra equipment lying around, RentMate has helped me earn passive income while helping others. The platform handles all the booking and payment details, making it hassle-free.',
      rating: 4
    },
    {
      id: 3,
      name: 'Sarah Chen',
      role: 'Student',
      image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Being a student with a limited budget, RentMate allowed me to rent a high-quality camera for my photography project. The booking process was seamless and the QR verification made pickup easy.',
      rating: 5
    }
  ]);

  const Star = ({ filled }) => (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.963c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.286-3.963a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z" />
    </svg>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">What Our Users Say</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Don't just take our word for it – hear from our satisfied community
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-8 shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="mb-6 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < testimonial.rating} />
                ))}
              </div>

              <blockquote>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
