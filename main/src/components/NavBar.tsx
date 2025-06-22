import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo192.png";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-white shadow-sm p-4 h-16">
            <div className="container mx-auto flex justify-between items-center h-full px-4">
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-6 w-auto"
                        draggable="false"
                    />
                    <span className="text-xl text-black font-bold font-dot-gothic-16 sm:inline ml-2">
                        Roster Tracker
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
