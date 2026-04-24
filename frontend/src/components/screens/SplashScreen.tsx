import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen = ({ onGetStarted }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowButton(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background islamic-pattern relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-48 gradient-sky opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary/20 to-transparent" />
      
      {/* Floating decorative stars */}
      <div className="absolute top-16 left-8 w-3 h-3 bg-gold-accent/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-32 right-12 w-2.5 h-2.5 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-24 left-16 w-4 h-4 bg-secondary/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <div 
          className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gold-accent/20 rounded-full blur-3xl animate-pulse-soft" />
            <img 
              src={logo} 
              alt="ZiyaulHarmayn Logo" 
              className="w-28 h-28 object-contain relative z-10 drop-shadow-lg animate-float"
            />
          </div>
        </div>

        {/* App Name */}
        <h1 
          className={`font-display text-3xl md:text-4xl text-foreground mb-2 text-center transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          ZiyaulHarmayn
        </h1>

        {/* Arabic subtitle */}
        <p 
          className={`font-display text-xl text-gold-accent mb-3 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          dir="rtl"
        >
          ضیاء الحرمین
        </p>

        {/* Tagline */}
        <p 
          className={`font-body text-sm text-muted-foreground max-w-[260px] text-center mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Your Trusted Companion for Hajj & Umrah Guidance
        </p>

        {/* Get Started Button */}
        <div 
          className={`transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Button 
            variant="golden" 
            size="lg"
            onClick={onGetStarted}
            className="min-w-[160px]"
          >
            Get Started
          </Button>
        </div>

        {/* Language indicators */}
        <div 
          className={`flex items-center gap-3 mt-6 text-xs text-muted-foreground transition-all duration-700 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <span>English</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span>اردو</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span>العربية</span>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 gradient-golden opacity-60" />
    </div>
  );
};

export default SplashScreen;
