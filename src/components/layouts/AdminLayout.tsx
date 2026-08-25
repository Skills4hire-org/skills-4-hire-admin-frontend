import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  Search, 
  Bell, 
  LayoutGrid, 
  Users, 
  List, 
  Building2, 
  BarChart2, 
  ShieldAlert, 
  HeadphonesIcon, 
  TrendingUp, 
  UserCog,
  Menu,
  X,
  Briefcase
} from "lucide-react";
import { cn } from "../../lib/utils";

const SIDEBAR_LINKS = [
  { name: "Overview", href: "/admin", icon: LayoutGrid, exact: true },
  { name: "User Management", href: "/admin/user-management", icon: Users },
  { name: "Services", href: "/admin/services", icon: List },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Transactions", href: "/admin/transactions", icon: Building2 },
  { name: "Financial", href: "/admin/financial", icon: BarChart2 },
  { name: "Content Moderation", href: "/admin/content-moderation", icon: ShieldAlert },
  { name: "Support & Disputes", href: "/admin/support", icon: HeadphonesIcon },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Admin Roles", href: "/admin/roles", icon: UserCog },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 shrink-0 bg-[#243cd6] text-white flex flex-col h-full lg:rounded-tr-xl lg:rounded-br-xl shadow-xl z-50 fixed lg:static transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between lg:justify-center border-b border-white/10 relative shrink-0">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-2xl font-bold tracking-tight leading-none">
              <span className="text-white">S</span><span className="text-black">4</span><span className="text-white">h</span>
            </div>
            <div className="font-semibold text-lg leading-tight mt-1">Skills4hire</div>
          </div>
          <button 
            className="lg:hidden absolute right-4 text-white hover:text-gray-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto w-full px-4 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-[15px] font-medium w-full",
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden opacity-100 min-w-0">
        
        {/* Top Header */}
        <header className="h-16 lg:h-20 w-full flex items-center justify-between px-4 lg:px-10 bg-white z-10 shrink-0 border-b border-gray-100 lg:border-none">
          <div className="flex items-center gap-4 text-gray-800">
            <button 
              className="lg:hidden text-gray-600 hover:text-gray-900 p-1 -ml-1 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Contextual Title spacing placeholder */}
          </div>
          
          <div className="flex items-center gap-4 lg:gap-8 w-full justify-end lg:justify-between lg:pl-8">
            {/* Search Bar - Hidden on small mobile, visible on sm and up */}
            <div className="relative w-full max-w-xl hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-5 pr-12 py-2.5 bg-gray-50 lg:bg-white border border-gray-200 lg:border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#243cd6]/50 placeholder:text-gray-400 transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600" />
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              <button className="relative text-blue-400 hover:text-blue-600 transition-colors hidden sm:block">
                <Bell className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              
              <div className="relative group cursor-pointer w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
                  alt="Admin User"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-teal-400 rounded-full border-2 border-white z-10" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-10 pb-10 bg-white w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
