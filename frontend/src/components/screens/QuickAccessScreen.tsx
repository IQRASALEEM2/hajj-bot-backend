import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BookOpen, 
  CheckSquare, 
  Map, 
  Heart, 
  Calendar, 
  Compass,
  Moon,
  Star,
  Clock
} from "lucide-react";

interface QuickAccessScreenProps {
  onBack: () => void;
  onStartChat: () => void;
}

const categories = [
  {
    title: "Hajj Steps",
    icon: Map,
    color: "bg-primary/10 text-primary",
    items: ["Ihram", "Tawaf", "Sa'i", "Mina", "Arafat", "Muzdalifah"],
  },
  {
    title: "Umrah Guide",
    icon: Compass,
    color: "bg-secondary/20 text-secondary-foreground",
    items: ["Preparation", "Miqat", "Tawaf", "Sa'i", "Halq/Taqsir"],
  },
  {
    title: "Common Duas",
    icon: Heart,
    color: "bg-gold-accent/20 text-amber-700",
    items: ["Talbiyah", "Tawaf Dua", "Sa'i Dua", "Arafat Dua", "General Duas"],
  },
  {
    title: "Checklist",
    icon: CheckSquare,
    color: "bg-sage-soft/40 text-teal-deep",
    items: ["Documents", "Clothing", "Medicine", "Essentials", "Electronics"],
  },
];

const quickActions = [
  { icon: Moon, label: "Prayer Times", color: "bg-primary" },
  { icon: BookOpen, label: "Qibla", color: "bg-secondary" },
  { icon: Calendar, label: "Itinerary", color: "bg-gold-accent" },
  { icon: Clock, label: "Reminders", color: "bg-sage-soft" },
];

const QuickAccessScreen = ({ onBack, onStartChat }: QuickAccessScreenProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="iconSm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-xl text-foreground">Guidance</h1>
          </div>
          <Button variant="golden" size="sm" onClick={onStartChat}>
            Ask Bot
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <section className="animate-fade-in">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border shadow-card hover:shadow-soft transition-all active:scale-95"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs text-muted-foreground font-medium text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        {categories.map((category, categoryIndex) => (
          <section 
            key={category.title} 
            className="animate-fade-in"
            style={{ animationDelay: `${(categoryIndex + 1) * 0.15}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}>
                <category.icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-foreground">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {category.items.map((item, itemIndex) => (
                <button
                  key={item}
                  className="px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground font-medium shadow-card hover:shadow-soft hover:border-primary/30 transition-all active:scale-95"
                  style={{ animationDelay: `${(categoryIndex * 0.15) + (itemIndex * 0.05)}s` }}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Featured Card */}
        <section 
          className="animate-fade-in mt-8"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="relative overflow-hidden rounded-3xl gradient-islamic p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <Star className="w-8 h-8 text-gold-accent mb-3" />
              <h3 className="font-display text-xl text-foreground mb-2">
                Daily Spiritual Guide
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized duas and reminders for your sacred journey
              </p>
              <Button variant="golden" size="sm">
                Explore
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuickAccessScreen;
