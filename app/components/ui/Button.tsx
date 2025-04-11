import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  withSparkles?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  icon,
  fullWidth = false,
  withSparkles = false,
}: ButtonProps) => {
  const baseClasses =
    "relative flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30",
    secondary:
      "bg-white/10 backdrop-blur-md text-white hover:bg-white/15 border border-white/20",
    outline:
      "bg-transparent border border-indigo-500 text-indigo-500 hover:bg-indigo-500/10",
    ghost: "bg-transparent text-indigo-500 hover:bg-indigo-500/10",
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {withSparkles && variant === "primary" && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -top-1 -left-1 w-5 h-5 bg-white/40 rounded-full filter blur-sm animate-sparkle-1"></div>
          <div className="absolute -bottom-1 -right-3 w-6 h-6 bg-white/40 rounded-full filter blur-sm animate-sparkle-2"></div>
        </div>
      )}

      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
