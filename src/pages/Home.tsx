import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <NavBar />
            <div className="flex flex-1 justify-center items-center space-x-8">
                <div className="flex flex-col space-y-4">
                    <Link to="/league/nfl" className="hover:underline text-blue-500 text-lg text-center">
                        NFL
                    </Link>
                    <Link to="/league/nba" className="hover:underline text-blue-500 text-lg text-center">
                        NBA
                    </Link>
                    <Link to="/league/mlb" className="hover:underline text-blue-500 text-lg text-center">
                        MLB
                    </Link>
                    <Link to="/league/nhl" className="hover:underline text-blue-500 text-lg text-center">
                        NHL
                    </Link>
                    <Link to="/league/epl" className="hover:underline text-blue-500 text-lg text-center">
                        EPL
                    </Link>
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
