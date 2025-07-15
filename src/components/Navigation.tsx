
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Activity, DollarSign, Heart, Home, Settings } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Trinity', href: '/', emoji: '🏠' },
    { icon: Activity, label: 'Health', href: '/health', emoji: '💚' },
    { icon: DollarSign, label: 'Wealth', href: '/wealth', emoji: '💎' },
    { icon: Heart, label: 'Relations', href: '/relations', emoji: '🤝' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  // Only show navigation on the home page for mobile design
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/20 md:relative md:border-t-0 md:border-b md:top-0">
      <div className="flex items-center justify-around p-4 md:justify-center md:space-x-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={`flex flex-col gap-1 h-12 px-3 md:flex-row md:h-10 md:gap-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => handleNavigation(item.href)}
            >
              <span className="text-lg md:hidden">{item.emoji}</span>
              <Icon className="h-4 w-4 hidden md:block" />
              <span className="text-xs md:text-sm">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
