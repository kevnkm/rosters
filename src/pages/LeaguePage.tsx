import '../App.css';

interface LeaguePageProps {
  leagueName: string;
}

function LeaguePage({ leagueName }: LeaguePageProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">
        {leagueName.toUpperCase()}
      </h1>
    </div>
  );
}

export default LeaguePage;
