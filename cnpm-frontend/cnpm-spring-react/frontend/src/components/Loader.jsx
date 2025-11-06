// src/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">
         <p className="text-center mt-10">Đang kiểm tra đăng nhập...</p>
      </div>
    </div>
  );
};

export default Loader;
