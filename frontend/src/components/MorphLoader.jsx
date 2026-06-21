import React from "react";

const MorphLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 bg-indigo-600 rounded-lg animate-[spin_3s_linear_infinite] cubic-bezier(0.4,_0,_0.2,_1) hover:scale-115 dynamic-morph">
        <style>{`
          @keyframes morph {
            0%, 100% { border-radius: 8px; transform: rotate(0deg); }
            50% { border-radius: 50%; transform: rotate(180deg); }
          }
          .dynamic-morph { animation: morph 2s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
};

export default MorphLoader;
