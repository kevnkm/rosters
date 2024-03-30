import '../App.css';
import RosterGraph from '../component/RosterGraph';

interface LeaguePageProps {
  leagueName: string;
}

const LeaguePage: React.FC<LeaguePageProps> = ({ leagueName }) => {
  return (
    <div className="bg-blue">
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-xl font-bold text-gray-800">
          {leagueName.toUpperCase()}
        </h1>
      </div>
      <div className="h-200" style={{ height: 500 }}>
        <RosterGraph leagueName={leagueName} />
      </div>
    </div>
  );
}

export default LeaguePage;