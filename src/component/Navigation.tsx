import { Link } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="text-white text-xl font-bold hover:text-gray-500">RosterTracker</Link>
                    <Link to="/nfl" className="text-white hover:text-gray-500">NFL</Link>
                    <Link to="/nba" className="text-white hover:text-gray-500">NBA</Link>
                    <Link to="/wnba" className="text-white hover:text-gray-500">WNBA</Link>
                    <Link to="/nhl" className="text-white hover:text-gray-500">NHL</Link>
                    <Link to="/mlb" className="text-white hover:text-gray-500">MLB</Link>
                    <Link to="/mls" className="text-white hover:text-gray-500">MLS</Link>
                    <Link to="/epl" className="text-white hover:text-gray-500">EPL</Link>
                </div>
                <Link to="/about" className="text-white hover:text-gray-500 ml-auto">About</Link>
            </div>
        </nav>
    );
}