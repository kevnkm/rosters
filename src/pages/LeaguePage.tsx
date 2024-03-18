import '../App.css';
import RosterGraph from '../component/RosterGraph';

interface LeaguePageProps {
  leagueName: string;
}

function LeaguePage({ leagueName }: LeaguePageProps) {
  return (
    <div className="bg-blue">
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-xl font-bold text-gray-800">
          {leagueName.toUpperCase()}
        </h1>
      </div>
      <RosterGraph leagueName={leagueName} />
    </div>
  );
}

export default LeaguePage;