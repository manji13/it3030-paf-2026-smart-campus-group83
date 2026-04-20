import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* p-5: Padding of 1.25rem (20px)
          max-w-4xl: Limits content width for better readability
          mx-auto: Centers the container
      */}
      <div className="p-5 max-w-4xl mx-auto mt-10">
        <p className="text-lg text-gray-700 font-medium bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          Select an option from the navigation menu to get started.
        </p>
      </div>
    </div>
  );
}

export default Home;