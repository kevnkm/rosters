import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import Navigation from '../component/Navigation';
import LeaguePage from '../pages/LeaguePage';

export default function Router() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/nfl" element={<LeaguePage leagueName="nfl" />} />
                <Route path="/nba" element={<LeaguePage leagueName="nba" />} />
                <Route path="/wnba" element={<LeaguePage leagueName="wnba" />} />
                <Route path="/nhl" element={<LeaguePage leagueName="nhl" />} />
                <Route path="/mlb" element={<LeaguePage leagueName="mlb" />} />
                <Route path="/mls" element={<LeaguePage leagueName="mls" />} />
                <Route path="/epl" element={<LeaguePage leagueName="epl" />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/" element={<Navigate replace to="/home" />} />
            </Routes>
        </BrowserRouter>
    );
}