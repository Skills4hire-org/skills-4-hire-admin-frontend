import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw, Users, Wallet } from "lucide-react";
import { cn } from "../../lib/utils";

type StatusType = "Completed" | "Pending" | "Caceled" | "Refunded";

type BookingType = {
  id: number;
  client: string;
  paymentMethod: string;
  handyman: string;
  price: string;
  date: string;
  status: StatusType;
  avatar: string;
};

const INITIAL_BOOKINGS: BookingType[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  client: "Joshua Philip",
  paymentMethod: ["Bank Transfer", "USSD", "Wallet"][i % 3],
  handyman: "Samuel John",
  price: "₦ 15000.00",
  date: "12/19/2025",
  status: (["Completed", "Pending", "Caceled", "Completed", "Pending", "Caceled"] as StatusType[])[i],
  avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
}));

const INITIAL_PENDING_TXNS = [
  { id: 101, client: "Joshua Philip", service: "Hairdressing", handyman: "Philip James", price: "₦ 15000.00", date: "12/20/2025" },
  { id: 102, client: "Sarah Jenkins", service: "Plumbing Repair", handyman: "John Smith", price: "₦ 25500.00", date: "12/19/2025" },
  { id: 103, client: "Michael Scott", service: "Electrical Wiring", handyman: "David Wallace", price: "₦ 45000.00", date: "12/18/2025" }
];

const INITIAL_REFERRALS = [
  { id: 201, client: "Joshua Philip", referrals: 4, amount: "₦ 5000.00", date: "12/21/2025" },
  { id: 202, client: "Angela Martin", referrals: 2, amount: "₦ 5000.00", date: "12/21/2025" },
];

const StatusPill = ({ status }: { status: StatusType | string }) => {
  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-semibold text-center inline-block shadow-sm min-w-[90px]",
        status === "Completed" && "bg-[#d1fae5] text-[#10b981]", 
        status === "Pending" && "bg-[#fef3c7] text-[#f59e0b]",   
        status === "Caceled" && "bg-[#ffe4e6] text-[#f43f5e]",
        status === "Refunded" && "bg-gray-200 text-gray-700" 
      )}
    >
      {status}
    </span>
  );
};

export default function Transactions() {
  const [bookings, setBookings] = useState<BookingType[]>(INITIAL_BOOKINGS);
  const [pendingTxns, setPendingTxns] = useState(INITIAL_PENDING_TXNS);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [refundPcts, setRefundPcts] = useState<Record<number, string>>({});

  const handleTxnAction = (type: "Approve" | "Cancel", id: number) => {
    const item = pendingTxns.find(t => t.id === id);
    if (item) {
      const newBooking: BookingType = {
        id: Date.now(),
        client: item.client,
        paymentMethod: "Resolved",
        handyman: item.handyman,
        price: item.price,
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        status: type === "Approve" ? "Completed" : "Caceled",
        avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
      };
      setBookings([newBooking, ...bookings]);
    }
    setPendingTxns(prev => prev.filter(txn => txn.id !== id));
  };

  const handleRefund = (id: number) => {
    const item = pendingTxns.find(t => t.id === id);
    const pct = refundPcts[id] || "25%";
    if (item) {
      const newBooking: BookingType = {
        id: Date.now(),
        client: item.client,
        paymentMethod: `${pct} Refund`,
        handyman: item.handyman,
        price: item.price,
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        status: "Refunded",
        avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
      };
      setBookings([newBooking, ...bookings]);
    }
    setPendingTxns(prev => prev.filter(txn => txn.id !== id));
  };

  const handleReferralAction = (_action: string, id: number) => {
    setReferrals(prev => prev.filter(ref => ref.id !== id));
  };

  return (
    <div className="flex flex-col w-full h-full mt-2 relative pb-10">
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-6">Transaction Management</h1>

      <div className="flex flex-col gap-8">
        
        {/* Bookings Table Panel */}
        <div className="bg-[#EBEBEB] rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <h2 className="text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-tight">Booking History</h2>
            <button className="bg-[#243cd6] hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full transition-colors shadow-sm flex items-center gap-1 text-sm">
              <ChevronLeft className="w-4 h-4" />
              This Monthly
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full overflow-x-auto min-h-[300px]">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="text-gray-800 font-semibold border-b border-transparent">
                  <th className="pb-4 font-semibold text-[14px]">Client</th>
                  <th className="pb-4 font-semibold text-[14px]">Payment method</th>
                  <th className="pb-4 font-semibold text-[14px]">Book Handyman</th>
                  <th className="pb-4 font-semibold text-[14px]">Price Agreed</th>
                  <th className="pb-4 font-semibold text-[14px]">Date</th>
                  <th className="pb-4 font-semibold text-[14px]">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {bookings.map((row) => (
                  <tr key={`booking-${row.id}`} className="text-[14px] font-medium text-gray-700 hover:bg-white/40 rounded-lg transition-colors group">
                    <td className="py-3 pl-2 rounded-l-lg">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt="client" className="w-8 h-8 rounded-full object-cover shadow-sm bg-blue-100 shrink-0" />
                        <span>{row.client}</span>
                      </div>
                    </td>
                    <td className="py-3">{row.paymentMethod}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt="handyman" className="w-8 h-8 rounded-full object-cover shadow-sm bg-green-100 shrink-0" />
                        <span>{row.handyman}</span>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-gray-800">{row.price}</td>
                    <td className="py-3">{row.date}</td>
                    <td className="py-3 pr-2 rounded-r-lg">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No historical bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[20px] font-semibold text-gray-800 tracking-tight flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-[#243cd6]" />
              Actionable Transactions
            </h2>
            <span className="text-sm font-medium text-gray-500">{pendingTxns.length} Pending Review</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingTxns.map(txn => (
              <div key={txn.id} className="border border-gray-200 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">{txn.date}</span>
                    <span className="text-[13px] font-bold text-[#f59e0b] bg-[#fef3c7] px-3 py-1 rounded-full">Requires Action</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-medium">Client</span>
                      <span className="text-sm font-semibold text-gray-800">{txn.client}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-medium">Service / Handyman</span>
                      <span className="text-sm font-semibold text-gray-800">{txn.service} ({txn.handyman})</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-800">Total Price</span>
                      <span className="text-base font-bold text-gray-900">{txn.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => handleTxnAction("Approve", txn.id)}
                      className="flex-[2] bg-[#243cd6] hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleTxnAction("Cancel", txn.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="relative flex-1">
                      <select 
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors cursor-pointer"
                        value={refundPcts[txn.id] || "25%"}
                        onChange={(e) => setRefundPcts({...refundPcts, [txn.id]: e.target.value})}
                      >
                        <option value="25%">25% Refund</option>
                        <option value="50%">50% Refund</option>
                        <option value="75%">75% Refund</option>
                        <option value="100%">100% Refund</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRefund(txn.id)}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                      Process Refund
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingTxns.length === 0 && (
              <div className="col-span-1 lg:col-span-2 xl:col-span-3 border border-gray-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-gray-500">
                <CheckCircle2 className="w-8 h-8 opacity-50 mb-3 text-green-500" />
                <p className="font-medium text-sm">All actionable transactions have been resolved!</p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Bonus Withdrawals Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[20px] font-semibold text-gray-800 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#243cd6]" />
              Referral Bonus Withdrawals
            </h2>
            <span className="text-sm font-medium text-gray-500">{referrals.length} Pending</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {referrals.map(ref => {
              const meetsCondition = ref.referrals >= 3;
              
              return (
                <div key={ref.id} className="border border-gray-200 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  
                  {/* Subtle decorative background icon */}
                  <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 opacity-50 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">{ref.date}</span>
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Bonus Request</span>
                    </div>
                    
                    <div className="space-y-1 mb-5">
                      <span className="text-xs text-gray-500 font-medium">Client Requesting</span>
                      <h3 className="text-base font-semibold text-gray-800">{ref.client}</h3>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 font-medium">Completed Referrals</span>
                        <span className={cn("text-base font-bold", meetsCondition ? "text-green-600" : "text-red-500")}>
                          {ref.referrals} / 3
                        </span>
                      </div>
                      {!meetsCondition && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> User is not eligible to withdraw yet.
                        </p>
                      )}
                      {meetsCondition && (
                        <p className="text-[11px] text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Eligible for withdrawal.
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm font-semibold text-gray-800">Bonus Amount</span>
                        <span className="text-base font-bold text-gray-900 tracking-tight">{ref.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 z-10 relative">
                    <button 
                      onClick={() => handleReferralAction("Accept", ref.id)}
                      disabled={!meetsCondition}
                      className="flex-1 bg-[#243cd6] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleReferralAction("Reject", ref.id)}
                      className="flex-1 bg-white border border-gray-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
            {referrals.length === 0 && (
              <div className="col-span-1 lg:col-span-2 xl:col-span-3 border border-gray-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-gray-500">
                <CheckCircle2 className="w-8 h-8 opacity-50 mb-3 text-green-500" />
                <p className="font-medium text-sm">All referral bonus withdrawals have been processed!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
