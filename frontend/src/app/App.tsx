import { useState, useCallback } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ModeProvider } from "./context/ModeContext";
import { TranslationProvider } from "./context/TranslationContext";
import { ThemeProvider } from "./context/ThemeContext";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("thor-splash-shown");
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("thor-splash-shown", "true");
    setShowSplash(false);
  }, []);

  return (
    <AuthProvider>
      <ModeProvider>
        <TranslationProvider>
          <ThemeProvider>
            {showSplash ? (
              <SplashScreen onComplete={handleSplashComplete} />
            ) : (
              <RouterProvider router={router} />
            )}
          </ThemeProvider>
        </TranslationProvider>
      </ModeProvider>
    </AuthProvider>
  );
}