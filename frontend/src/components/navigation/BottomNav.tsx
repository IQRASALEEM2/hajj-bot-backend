import { Home, MessageCircle, BookOpen, User } from "lucide-react";

type Screen = "splash" | "chat" | "quick-access" | "profile";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems = [
  { id: "splash" as Screen, icon: Home, label: "Home" },
  { id: "chat" as Screen, icon: MessageCircle, label: "Chat" },
  { id: "quick-access" as Screen, icon: BookOpen, label: "Guidance" },
  { id: "profile" as Screen, icon: User, label: "Profile" },
];

const BottomNav = ({ currentScreen, onNavigate }: BottomNavProps) => {
  if (currentScreen === "splash") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border shadow-soft">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-8 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
};

export default BottomNav;
