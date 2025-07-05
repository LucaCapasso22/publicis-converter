
import { ThemeToggle } from "./ThemeToggle";
import { Image } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="gradient-primary p-2.5 rounded-xl shadow-modern">
            <Image className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
            Publicis Converter
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
