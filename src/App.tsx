import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RoobetPage from "@/pages/RoobetPage";
import OffersPage from "@/pages/OffersPage";
import RulesPage from "@/pages/RulesPage";
import SocialsPage from "@/pages/SocialsPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import SlotCallsPage from "@/pages/SlotCallsPage";
import TournamentsPage from "@/pages/TournamentsPage";
import TournamentDetailsPage from "@/pages/TournamentDetailsPage";
import TournamentHistoryPage from "@/pages/TournamentHistoryPage";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import GiveawaysPage from "./pages/GiveawaysPage";
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
          
          {/* Roobet page */}
          <Route path='/Leaderboard' element={<RoobetPage />} />
          <Route path='/PreviousLeaderboard' element={<Navigate to='/Leaderboard' replace />} />
          <Route path='/RoobetPage' element={<RoobetPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/slot' element={<SlotCallsPage />} />
          <Route path='/giveaways' element={<GiveawaysPage />} />
          <Route path='/tournaments' element={<TournamentsPage />} />
          <Route path='/tournaments/:id' element={<TournamentDetailsPage />} />
          <Route path='/tournaments/history' element={<TournamentHistoryPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
