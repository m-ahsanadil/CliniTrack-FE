import React from 'react';

// 1. Dashboard Loading - Full Page
export const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Medical Cross Animation */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-x-3 inset-y-0 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="absolute inset-y-3 inset-x-0 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">Preparing your personalized healthcare dashboard...</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
          
          {/* Loading Steps */}
          <div className="text-left space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Authentication verified
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Loading user permissions
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              Fetching dashboard data...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Skeleton Loading - Content Areas
const SkeletonLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded-lg w-80 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-60 animate-pulse"></div>
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded-lg w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Minimal Elegant Loading
const MinimalLoading = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          {/* Rotating Ring */}
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Pulsing Dot */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading</h3>
        <p className="text-gray-600 text-sm">Please wait a moment...</p>
      </div>
    </div>
  );
};

// 4. Dots Loading Animation
const DotsLoading = ({ text = "Loading" }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

// 5. Button Loading State
// const ButtonLoading = ({ children, loading = false, ...props }) => {
//   return (
//     <button
//       className={`
//         relative px-6 py-3 rounded-lg font-medium transition-all duration-200
//         ${loading 
//           ? 'bg-gray-400 cursor-not-allowed' 
//           : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
//         }
//         text-white
//       `}
//       disabled={loading}
//       {...props}
//     >
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}
//       <span className={loading ? 'opacity-0' : 'opacity-100'}>
//         {children}
//       </span>
//     </button>
//   );
// };

// 6. Card Loading State
const CardLoading = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

// 7. Table Loading State
const TableLoading = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 8. Medical Theme Loading
const MedicalLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Medical Cross with Heartbeat */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-2 bg-white rounded-full border-4 border-teal-500 flex items-center justify-center">
                <div className="text-teal-500 text-2xl font-bold">+</div>
              </div>
            </div>
            
            {/* Heartbeat Line */}
            <div className="mt-4 flex justify-center">
              <svg width="80" height="20" viewBox="0 0 80 20" className="text-teal-500">
                <polyline
                  points="0,10 20,10 25,5 30,15 35,0 40,20 45,10 80,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">Accessing Medical Records</h2>
          <p className="text-gray-600 text-sm mb-6">Securing your healthcare data...</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
