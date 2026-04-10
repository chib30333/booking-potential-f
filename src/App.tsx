import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/index";
import Explore from "./pages/Explore.tsx";
import Calendar from "./pages/Calendar.tsx";
import Profile from "./pages/Profile.tsx";
import Corporate from "./pages/Corporate.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
