import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  User, 
  Globe, 
  Bell, 
  Moon, 
  HelpCircle, 
  Shield, 
  Heart,
  ChevronRight,
  Check
} from "lucide-react";

interface ProfileScreenProps {
  onBack: () => void;
}

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

const ProfileScreen = ({ onBack }: ProfileScreenProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Prayer times & reminders",
      toggle: true,
      value: notifications,
      onChange: () => setNotifications(!notifications),
    },
    {
      icon: Moon,
      label: "Dark Mode",
      description: "Adjust app appearance",
      toggle: true,
      value: darkMode,
      onChange: () => setDarkMode(!darkMode),
    },
    {
      icon: Shield,
      label: "Privacy",
      description: "Manage your data",
      link: true,
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs and contact us",
      link: true,
    },
    {
      icon: Heart,
      label: "Rate App",
      description: "Share your feedback",
      link: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="iconSm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl text-foreground">Profile & Settings</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <section className="animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-card p-6">
            <div className="absolute top-0 right-0 w-24 h-24 gradient-islamic opacity-30 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl gradient-islamic flex items-center justify-center">
                <User className="w-10 h-10 text-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-foreground">Guest User</h2>
                <p className="text-sm text-muted-foreground">Tap to create profile</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-2xl text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Duas Saved</p>
              </div>
              <div>
                <p className="font-display text-2xl text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div>
                <p className="font-display text-2xl text-gold-accent">New</p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>
          </div>
        </section>

        {/* Language Selection */}
        <section 
          className="animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">Language</h2>
          </div>
          
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-medium">{lang.name}</span>
                  <span className="text-muted-foreground text-sm">{lang.native}</span>
                </div>
                {selectedLanguage === lang.code && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section 
          className="animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="font-semibold text-foreground mb-4">Settings</h2>
          
          <div className="space-y-2">
            {settingsItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onChange}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-card hover:shadow-soft transition-all"
                style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                
                {item.toggle ? (
                  <div 
                    className={`w-12 h-7 rounded-full transition-colors ${
                      item.value ? "bg-primary" : "bg-muted"
                    } relative`}
                  >
                    <div 
                      className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${
                        item.value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* App Version */}
        <section 
          className="text-center pt-4 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-xs text-muted-foreground">
            ZiyaulHarmayn v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Made with ❤️ for the Ummah
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProfileScreen;
