import Link from "next/link";
import ThemeToggle from "@/components/ui/themeToggle";
import AddModuleModal from "@/components/metrics/AddModuleModal";

export default function Navbar() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">FH</span>
          </div>
          <span className="font-semibold text-sm">FrontendHealth</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/compare"
            className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/dashboard/alerts"
            className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Alerts
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AddModuleModal />
        </div>
      </div>
    </header>
  );
}