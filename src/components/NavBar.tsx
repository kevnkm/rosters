import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/clipboard-svgrepo-com.svg";

const NavBar: React.FC = () => {
    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-5 w-5"
                            draggable="false"
                        />
                    </div>
                    <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Roster Tracker
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
