import { ArrowUpRight, TrendingUp, MapPin } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const METRICS = [
  { id: 1, title: "Total Bookings", value: "4,000", trend: "8.5%" },
  { id: 2, title: "Revenue", value: "₦ 4,000", trend: "8.5%" },
  { id: 3, title: "Revenue", value: "4.5%", trend: "8.5%" },
  { id: 4, title: "Repeating Bookings", value: "40%", trend: "8.5%" },
];

const LOCATIONS = [
  { id: 1, name: "Lagos", customers: "1234", percentage: 70 },
  { id: 2, name: "Kwara", customers: "1765", percentage: 45 },
  { id: 3, name: "Ogun", customers: "698", percentage: 85 },
];

const ACQUISITION_DATA = [
  { name: "Referrals", value: 30, color: "#1F8A70" }, // Green
  { name: "Ads", value: 45, color: "#F03A47" },     // Red
  { name: "Organic", value: 25, color: "#F6CA06" }, // Yellow
];

const TOP_PROVIDERS = [
  { id: 1, name: "Joshua Friday", service: "Plumber", rating: 5.0, bookings: 124, avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150" },
  { id: 2, name: "Sarah Jenkins", service: "Hairdresser", rating: 4.9, bookings: 110, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" },
  { id: 3, name: "Samuel John", service: "Electrician", rating: 4.8, bookings: 98, avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150" },
];

export default function Analytics() {
  return (
    <div className="flex flex-col w-full h-full mt-2 relative pb-10">
      <h1 className="text-[28px] lg:text-3xl font-semibold text-gray-900 tracking-tight mb-8">
        Analytics & Insights
      </h1>

      <div className="flex flex-col gap-6">
        
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric) => (
            <div key={metric.id} className="bg-[#BDBCA9] bg-opacity-60 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 z-10">
                  <span className="text-[14px] text-gray-700 font-medium">{metric.title}</span>
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight">{metric.value}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0 z-10">
                  <ArrowUpRight className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 z-10">
                <TrendingUp className="w-4 h-4 text-[#10b981] stroke-[2.5px]" />
                <span className="text-sm font-semibold text-[#10b981]">{metric.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Where Bookings Are Happening */}
          <div className="lg:col-span-2 bg-[#EAEBEA]/50 rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight text-center lg:text-left mb-6">
              Where Bookings Are Happening The Most
            </h2>
            
            <div className="flex-1 w-full flex items-center justify-center relative min-h-[220px]">
               {/* Abstract map graphic representing the colorful map mock */}
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
                 alt="World Map Graphic" 
                 className="w-full h-full max-h-[200px] object-contain mt-4 opacity-60"
                 style={{ filter: "sepia(1) hue-rotate(180deg) saturate(300%)" }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#EAEBEA]/50 to-transparent pointer-events-none" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 z-10">
              {LOCATIONS.map((loc) => (
                <div key={loc.id} className="flex flex-col gap-2 relative">
                   <div className="flex items-start gap-2">
                     <div className="w-8 h-8 rounded-full border border-red-200 bg-white flex items-center justify-center shrink-0 shadow-sm mt-1 text-red-500">
                        <MapPin className="w-4 h-4 fill-red-50 xl:w-5 xl:h-5 text-red-500" />
                     </div>
                     <div className="flex flex-col w-full">
                       <span className="font-semibold text-gray-900 text-base">{loc.name}</span>
                       <span className="text-[12px] text-gray-500 font-medium tracking-tight mb-2">{loc.customers} Customers</span>
                       <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-[#243cd6] rounded-full" 
                           style={{ width: `${loc.percentage}%` }}
                         />
                       </div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Acquisition Channel */}
          <div className="bg-[#EAEBEA]/50 rounded-2xl p-6 lg:p-8 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight text-center lg:text-left mb-8">
              Customer Acquisition Channel
            </h2>

            <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-4 relative w-full mt-4">
              <div className="h-[200px] w-[200px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ACQUISITION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {ACQUISITION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-4">
                {ACQUISITION_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[14px] font-semibold text-gray-800">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Top 3 Providers Section (Inferring from the title cut off in design) */}
        <div>
           <h2 className="text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-tight mt-4 mb-5">
             Top 3 Providers
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {TOP_PROVIDERS.map(provider => (
               <div key={provider.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                 <img src={provider.avatar} alt={provider.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                 <div className="flex flex-col flex-1">
                   <span className="font-semibold text-gray-900 text-[15px]">{provider.name}</span>
                   <span className="text-sm text-gray-500 font-medium">{provider.service}</span>
                 </div>
                 <div className="text-right flex flex-col">
                   <div className="flex items-center gap-1 justify-end">
                     <span className="text-yellow-500 text-sm">★</span>
                     <span className="font-bold text-gray-900 text-sm">{provider.rating}</span>
                   </div>
                   <span className="text-[11px] text-gray-400 font-medium">{provider.bookings} bookings</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
