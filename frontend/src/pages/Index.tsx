import { useState } from "react";
import SplashScreen from "@/components/screens/SplashScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import QuickAccessScreen from "@/components/screens/QuickAccessScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import BottomNav from "@/components/navigation/BottomNav";

type Screen = "splash" | "chat" | "quick-access" | "profile";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleGetStarted = () => {
    setCurrentScreen("chat");
  };

  const handleBack = () => {
    setCurrentScreen("chat");
  };

  return (
    <div className="relative max-w-md mx-auto min-h-screen bg-background shadow-xl">
      {/* Screen Content */}
      <main className={currentScreen !== "splash" ? "pb-20" : ""}>
        {currentScreen === "splash" && (
          <SplashScreen onGetStarted={handleGetStarted} />
        )}
        
        {currentScreen === "chat" && (
          <ChatScreen onBack={() => setCurrentScreen("splash")} />
        )}
        
        {currentScreen === "quick-access" && (
          <QuickAccessScreen 
            onBack={handleBack} 
            onStartChat={() => setCurrentScreen("chat")} 
          />
        )}
        
        {currentScreen === "profile" && (
          <ProfileScreen onBack={handleBack} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
