import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { Image } from "lucide-react";

export function AppLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="lg:hidden" />
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

            {/* Main Content */}
            <main className="flex-1">
              <Outlet />
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}