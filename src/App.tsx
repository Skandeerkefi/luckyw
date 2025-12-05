import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RoobetPage from "@/pages/RoobetPage";
import OffersPage from "@/pages/OffersPage";
import RulesPage from "@/pages/RulesPage";
import SocialsPage from "@/pages/SocialsPage";

import PreviousLeaderboardPage from "@/pages/PreviousLeaderboardPage";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (user?.role === "admin") {
      console.log("User is admin, do admin stuff");
    } else {
      console.log("User is not admin");
    }
  }, [user]);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />

          {/* Navbar pages */}
          <Route path='/offers' element={<OffersPage />} />
          <Route path='/rules' element={<RulesPage />} />
          <Route path='/socials' element={<SocialsPage />} />
          
          <Route path='/previous' element={<PreviousLeaderboardPage />} />

          {/* Roobet page */}
          <Route path='/Leaderboard' element={<RoobetPage />} />
          <Route path='/RoobetPage' element={<RoobetPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
