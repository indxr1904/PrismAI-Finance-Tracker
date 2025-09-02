"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border p-2 ml-2 relative overflow-hidden"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-5 w-5 text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
