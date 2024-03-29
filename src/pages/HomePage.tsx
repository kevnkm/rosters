import { Link } from "react-router-dom";
import '../App.css';

const HomePage: React.FC = () => {
  return (
    <div>
      <Link to="/about">Home</Link>
    </div>
  );
}

export default HomePage;