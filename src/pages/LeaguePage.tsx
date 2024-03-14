import React from 'react';
import { Link } from "react-router-dom";
import '../App.css';


interface LeaguePageProps {
  leagueName: string;
}


function LeaguePage({ leagueName }: LeaguePageProps) {
  return (
    <div>
      <h1>
        {leagueName}
      </h1>
    </div>
  );
}

export default LeaguePage;
