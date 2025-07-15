import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Activity, DollarSign, Heart, Home, User } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Trinity', href: '/', emoji: '🏠' },
    { icon: Activity, label: 'Health', href: '/health', emoji: '💚' },
    { icon: DollarSign, label: 'Wealth', href: '/wealth', emoji: '💎' },
    { icon: Heart, label: 'Relations', href: '/relations', emoji: '🤝' },
    { icon: User, label: 'Profile', href: '/profile', emoji: '👤' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className="floating-nav">
      <div className="ios-tab-bar safe-area-left safe-area-right">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.label}
              className={`ios-tab haptic-selection ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.href)}
            >
              <div className="text-xl mb-1">{item.emoji}</div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};