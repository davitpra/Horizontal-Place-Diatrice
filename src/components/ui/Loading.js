"use client";

import React from "react";

export const Loading = ({ 
  message = "Cargando...", 
  size = "md",
  showSpinner = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="text-center">
        {showSpinner && (
          <div 
            className={`animate-spin rounded-full border-b-2 border-indigo-600 mx-auto ${sizeClasses[size]}`}
            role="status"
            aria-label="Cargando"
          />
        )}
        <p className={`mt-4 text-gray-600 ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;
