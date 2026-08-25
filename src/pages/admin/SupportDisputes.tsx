import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, Send, CheckCircle2, AlertCircle, Clock, PlayCircle, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { getAdminSupports, getAdminConversationDetail, createAdminConversationReply, assignAdminSupport, patchAdminSupportAction } from "@/api/admin";


type SupportCase = {
  support_id: string;
  status: string;
  customer?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
  is_active: boolean;
  created_at: string;
  assigned_at?: string;
};

type ChatMessage = {
  id: string;
  sender: "user" | "support" | "system";
  text: string;
  created_at?: string;
};

const CHART_DATA = [
  { name: 'JAN', value: 20 },
  { name: 'FEB', value: 35 },
  { name: 'MAR', value: 25 },
  { name: 'APR', value: 65 },
  { name: 'MAY', value: 30 },
  { name: 'JUN', value: 85 },
  { name: 'JUL', value: 70 },
  { name: 'AUG', value: 110 },
  { name: 'SEPT', value: 90 },
  { name: 'OCT', value: 130 },
  { name: 'NOV', value: 100 },
  { name: 'DEC', value: 140 },
];

const StatusPill = ({ status }: { status: string }) => {
  const normStatus = status.toLowerCase();
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-max",
        normStatus === "completed" && "bg-green-100 text-green-700", 
        normStatus === "on hold" && "bg-yellow-100 text-yellow-700",   
        normStatus === "escalate" && "bg-red-100 text-red-700",
        normStatus === "yet to start" && "bg-gray-100 text-gray-700"     
      )}
    >
      {normStatus === "completed" && <CheckCircle2 className="w-3 h-3" />}
      {normStatus === "on hold" && <Clock className="w-3 h-3" />}
      {normStatus === "escalate" && <AlertCircle className="w-3 h-3" />}
      {normStatus === "yet to start" && <PlayCircle className="w-3 h-3" />}
      {status}
    </span>
  );
};

export default function SupportDisputes() {
  const [supportCases, setSupportCases] = useState<SupportCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  const fetchSupports = async () => {
    setLoading(true);
    try {
      const data = await getAdminSupports(searchQuery ? { search: searchQuery } : undefined);
      if (data) {
        const results = data.results || [];
        setSupportCases(results);
        if (results.length > 0 && !selectedCase) {
          setSelectedCase(results[0]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (caseId: string) => {
    setLoadingChat(true);
    try {
      const data = await getAdminConversationDetail(caseId);
      if (data) {
        // Map messages appropriately from support conversation detail
        // Detail schema may have 'messages' list
        const rawMsgs = data.messages || [];
        setMessages(rawMsgs.map((m: any) => ({
          id: m.id || m.message_id || String(Math.random()),
          sender: m.sender_type === "SUPPORT" ? "support" : m.sender_type === "SYSTEM" ? "system" : "user",
          text: m.message || m.text,
          created_at: m.created_at
        })));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(error);
      setMessages([]);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  useEffect(() => {
    if (selectedCase) {
      fetchChatHistory(selectedCase.support_id);
    } else {
      setMessages([]);
    }
  }, [selectedCase]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedCase) return;
    try {
      const res = await createAdminConversationReply(selectedCase.support_id, {
        message: messageText.trim()
      });
      if (res) {
        setMessages(prev => [...prev, {
          id: res.id || String(Math.random()),
          sender: "support",
          text: messageText.trim()
        }]);
      }
      setMessageText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignToMe = async () => {
    if (!selectedCase) return;
    try {
      await assignAdminSupport(selectedCase.support_id, {});
      alert("Ticket assigned successfully!");
      fetchSupports();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusAction = async (action: string) => {
    if (!selectedCase) return;
    try {
      await patchAdminSupportAction(selectedCase.support_id, action, {});
      alert(`Ticket marked as ${action}`);
      fetchSupports();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full mt-2 relative overflow-hidden text-[#333333] pb-10">
      
      {/* Analytics Chart Block */}
      <div className="bg-[#EBEBEB] rounded-[20px] p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-gray-500 font-semibold">OVERVIEW</span>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-none">Support Tickets & Disputes</h2>
          </div>
        </div>
        <div className="w-full h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="supportColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#243cd6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#243cd6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D1D5DB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#243cd6" strokeWidth={2} fillOpacity={1} fill="url(#supportColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[600px] items-stretch">
        
        {/* Left Side: Cases List */}
        <div className={cn(
          "w-full lg:w-[360px] bg-[#EBEBEB] rounded-[20px] p-4 flex flex-col shrink-0 h-full",
          selectedCase && "hidden lg:flex"
        )}>
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search disputes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-sm border-0 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <div className="text-center py-10 text-gray-500 font-medium text-sm">Loading tickets...</div>
            ) : supportCases.map(ticket => (
              <div 
                key={ticket.support_id}
                onClick={() => setSelectedCase(ticket)}
                className={cn(
                  "p-4 rounded-xl cursor-pointer transition-all border",
                  selectedCase?.support_id === ticket.support_id 
                    ? "bg-[#243cd6] text-white border-transparent" 
                    : "bg-white text-gray-800 border-gray-100 hover:border-gray-300"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm truncate pr-2">
                    {ticket.customer ? `${ticket.customer.first_name} ${ticket.customer.last_name}` : "Unknown User"}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium shrink-0",
                    selectedCase?.support_id === ticket.support_id ? "text-blue-100" : "text-gray-400"
                  )}>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs opacity-80 truncate">ID: {ticket.support_id.slice(0, 8)}...</span>
                  <StatusPill status={ticket.status} />
                </div>
              </div>
            ))}
            {supportCases.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-500 font-medium text-sm">No tickets found.</div>
            )}
          </div>
        </div>

        {/* Right Side: Conversation window */}
        <div className={cn(
          "flex-1 bg-[#EBEBEB] rounded-[20px] p-4 flex flex-col h-full min-w-0",
          !selectedCase && "hidden lg:flex justify-center items-center text-gray-400"
        )}>
          {selectedCase ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setSelectedCase(null)}
                    className="p-1 hover:bg-gray-200 rounded-lg lg:hidden"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {selectedCase.customer ? `${selectedCase.customer.first_name} ${selectedCase.customer.last_name}` : "Unknown User"}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">Ticket: {selectedCase.support_id}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleAssignToMe}
                    className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Assign to Me
                  </button>
                  <button 
                    onClick={() => handleStatusAction("resolve")}
                    className="px-3 py-1 bg-[#10b981] hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                {loadingChat ? (
                  <div className="text-center py-10 text-gray-500 font-medium text-sm">Loading messages...</div>
                ) : messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[75%] rounded-2xl p-3 text-sm",
                      msg.sender === "support" 
                        ? "bg-[#243cd6] text-white ml-auto rounded-tr-none" 
                        : msg.sender === "system"
                        ? "bg-gray-200 text-gray-600 mx-auto text-xs py-1.5 px-4 rounded-full"
                        : "bg-white text-gray-800 mr-auto rounded-tl-none border border-gray-100 shadow-sm"
                    )}
                  >
                    <p className="leading-relaxed break-words">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-medium placeholder-gray-400"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-2.5 bg-[#243cd6] hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <span className="font-medium text-sm">Select a dispute from the left panel to begin</span>
          )}
        </div>

      </div>
    </div>
  );
}
