import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

declare global {
  interface Window {
    google?: any;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("✅ Google script loaded");
    };
    document.body.appendChild(script);
  }, []);

  const handleCredential = async (credential: string) => {
    try {
      const res = await api("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }), 
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      console.log("✅ Google login success:", res.user);
    } catch (err) {
      console.error("❌ Google login failed:", err);
    }
  };

  const login = () => {
    const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ;

    if (!window.google?.accounts?.id) {
      alert("Google Identity Services script not loaded yet!");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp: any) => {
        console.log("🔑 Google response:", resp); // Debug log
        if (!resp.credential) {
          console.error("❌ No credential returned from Google:", resp);
          return;
        }
        handleCredential(resp.credential);
      },
    });

    const btnContainer = document.getElementById("gsi-btn");
    if (btnContainer && btnContainer.childNodes.length === 0) {
      window.google.accounts.id.renderButton(btnContainer, {
        theme: "outline",
        size: "large",
      });
    }

    (btnContainer?.querySelector("div[role=button]") as HTMLElement)?.click();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
      {/* hidden Google login button */}
      <div id="gsi-btn" style={{ display: "none" }}></div>
    </AuthContext.Provider>
  );
};
