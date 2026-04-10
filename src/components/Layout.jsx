import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="w-full min-h-screen flex justify-center bg-black">
            {/* The mobile-app constraint wrapper for desktop */}
            <div className="w-full md:max-w-md min-h-screen bg-navy-900 shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-x-hidden flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default Layout;
