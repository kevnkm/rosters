import React from "react";
import logo from "../images/logo192.png";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="bg-white p-4 h-16">
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

            <div className="flex flex-1 justify-center items-center space-x-8">
                <div className="flex flex-col space-y-4">
                    <a
                        href="https://www.nfl.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-500 text-lg text-center"
                    >
                        Football
                    </a>
                    <a
                        href="https://www.nba.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-500 text-lg text-center"
                    >
                        Basketball
                    </a>
                    <a
                        href="https://www.mlb.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-500 text-lg text-center"
                    >
                        Baseball
                    </a>
                    <a
                        href="https://www.nhl.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-500 text-lg text-center"
                    >
                        Hockey
                    </a>
                    <a
                        href="https://www.premierleague.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-500 text-lg text-center"
                    >
                        Soccer
                    </a>
                </div>
            </div>

            <footer className="bg-gray-100 text-center text-gray-500 text-sm py-4">
                <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://kevinkmkim.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-500"
                        >
                            ball = life
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
