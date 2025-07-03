import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2">
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-black" />}
    </button>
  );
};

export default ThemeToggle;
