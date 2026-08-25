import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreVertical, Pencil, Trash2, Star } from "lucide-react";
import { cn } from "../../lib/utils";

type JobStatus = "Completed" | "Pending" | "Canceled";

type WorkHistoryRow = {
  id: number;
  name: string;
  paymentMethod: string;
  review: string;
  rating: number;
  date: string;
  status: JobStatus;
  avatar: string;
};

const MOCK_HISTORY: WorkHistoryRow[] = Array.from({ length: 25 }).map((_, i) => {
  const statuses: JobStatus[] = ["Completed", "Pending", "Canceled"];
  return {
    id: i + 1,
    name: "Joshua Philip",
    paymentMethod: ["Bank Transfer", "USSD", "Wallet"][i % 3],
    review: "I had a fantas...",
    rating: 5,
    date: "12/19/2025",
    status: statuses[i % 3],
    avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
  };
});

const StatusPill = ({ status }: { status: JobStatus }) => {
  return (
    <span
      className={cn(
        "px-4 py-1.5 rounded-full text-[13px] font-medium",
        status === "Completed" && "bg-emerald-100 text-emerald-600",
        status === "Pending" && "bg-amber-100 text-amber-600",
        status === "Canceled" && "bg-red-100 text-red-500"
      )}
    >
      {status}
    </span>
  );
};

export default function ProviderDetails() {
  useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(MOCK_HISTORY.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = MOCK_HISTORY.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex gap-6 w-full h-full mt-2 relative overflow-hidden">
      
      {/* Left Sidebar Profile Panel */}
      <div className="w-[300px] bg-[#EAEBEA]/50 rounded-2xl p-6 flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
        <div className="flex flex-col items-center mt-4 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm bg-blue-100 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" 
              alt="Joshua Friday"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Joshua Friday</h2>
        </div>

        <div className="space-y-6 flex-1 text-[15px]">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-800 font-medium">Josh@gmail.com</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Number</span>
            <span className="text-gray-800 font-medium">08115923837</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Gender</span>
            <span className="text-gray-800 font-medium">Male</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Service</span>
            <span className="text-gray-800 font-medium">Plumber</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Verification ID</span>
            <span className="text-gray-800 font-medium">0000</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Registered Since</span>
            <span className="text-gray-800 font-medium">16/09/2025</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium">Bookings</span>
            <span className="text-gray-800 font-medium">100</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-4 mt-8 pb-4">
          <button className="text-gray-600 hover:text-blue-600 transition-colors p-2 bg-transparent hover:bg-white rounded-md shadow-sm">
            <Pencil className="w-[20px] h-[20px]" />
          </button>
          <button className="text-red-500 hover:text-red-600 transition-colors p-2 bg-transparent hover:bg-white rounded-md shadow-sm">
            <Trash2 className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>

      {/* Right Main Panel (Work History) */}
      <div className="bg-[#EAEBEA]/50 rounded-2xl p-6 sm:p-8 flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">Work History</h2>
          <div className="flex items-center gap-4">
            <button className="bg-[#243cd6] hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-full transition-colors">
              Add
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors p-1">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="text-gray-800 font-semibold border-b border-transparent">
                <th className="pb-4 font-semibold text-[15px]">Name</th>
                <th className="pb-4 font-semibold text-[15px]">Payment method</th>
                <th className="pb-4 font-semibold text-[15px]">Review</th>
                <th className="pb-4 font-semibold text-[15px]">Rating</th>
                <th className="pb-4 font-semibold text-[15px]">Date</th>
                <th className="pb-4 font-semibold text-[15px]">Jobs</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {paginatedHistory.map((row) => (
                <tr key={row.id} className="group text-[15px] font-medium text-gray-700 hover:bg-white/40 rounded-lg transition-colors">
                  <td className="py-3 pl-2 rounded-l-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={row.avatar} 
                        alt={row.name} 
                        className="w-8 h-8 rounded-full object-cover shadow-sm bg-blue-100 shrink-0"
                      />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{row.paymentMethod}</td>
                  <td className="py-3">{row.review}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: row.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3">{row.date}</td>
                  <td className="py-3 pr-2 rounded-r-lg">
                    <StatusPill status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder mapped closely to Figma */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 mb-4 gap-2 text-sm font-medium">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5"/>
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isActive = pageNumber === currentPage;
              return (
                <button 
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-full flex flex-col justify-center items-center transition-colors ${
                    isActive ? "bg-[#243cd6] text-white" : "hover:bg-gray-200 text-gray-600 bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
