function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Search & Find',
      description: 'Browse through thousands of verified rental listings across multiple categories.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Book & Pay',
      description: 'Securely book and pay for your chosen item using our integrated payment system.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0H3m0 0v10a2 2 0 002 2h10a2 2 0 002-2V9z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Verify & Collect',
      description: 'Use QR code verification to ensure smooth and secure item pickup.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm12 0h4v4h-4v-4zM9 4h6M4 9h16M9 20h6" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Use & Return',
      description: 'Enjoy your rented item and return it as per the agreed schedule.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5 9a7 7 0 0112.897-2.829M19 15a7 7 0 01-12.899 2.829" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How RentMate Works</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Renting has never been easier with our simple 4-step process
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* Connecting line (only visible on md+) */}
            <div className="hidden md:block absolute top-1/2 w-full h-1 bg-blue-200 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-4 relative z-10">
              {steps.map((step) => (
                <div key={step.id} className="relative flex flex-col items-center">
                  {/* Step icon */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-xl">
                    {step.icon}
                  </div>

                  {/* Step number badge */}
                  <div className="absolute top-0 -left-2 w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold">
                    {step.id}
                  </div>

                  {/* Step content */}
                  <div className="mt-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
