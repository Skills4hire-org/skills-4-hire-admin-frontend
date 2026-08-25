import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, Download, ArrowUpCircle, ArrowDownCircle, Check, X } from "lucide-react";
import { cn } from "../../lib/utils";

type StatusType = "Completed" | "Pending" | "Overdue" | "Failed";
type CustomerTxnType = "Deposit" | "Withdrawal" | "Booking Payment";
type ProviderTxnType = "Earnings" | "Withdrawal";

const INITIAL_CUSTOMER_TXNS = Array.from({ length: 5 }).map((_, i) => ({
  id: 100 + i,
  customer: ["Joshua Philip", "Sarah Jenkins", "Michael Scott", "Angela Martin", "David Wallace"][i],
  type: ["Deposit", "Booking Payment", "Withdrawal", "Deposit", "Booking Payment"][i] as CustomerTxnType,
  amountValue: [50000, 15000, 5000, 20000, 45000][i],
  date: "12/21/2025",
  status: (["Completed", "Completed", "Pending", "Completed", "Overdue"] as StatusType[])[i],
  avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
}));

const INITIAL_PROVIDER_TXNS = Array.from({ length: 5 }).map((_, i) => ({
  id: 200 + i,
  provider: ["Samuel John", "Philip James", "John Smith", "David Wallace", "Dwight Schrute"][i],
  type: ["Earnings", "Withdrawal", "Earnings", "Earnings", "Withdrawal"][i] as ProviderTxnType,
  service: ["Electrician", "Hairdresser", "Plumbing Repair", "Electrical Wiring", "Carpentry"][i],
  amountValue: [12000, 25000, 20000, 40000, 10000][i],
  date: "12/20/2025",
  status: (["Completed", "Pending", "Completed", "Completed", "Failed"] as StatusType[])[i],
  avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
}));

const formatCurrency = (value: number) => {
  return "₦ " + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const StatusPill = ({ status }: { status: StatusType }) => {
  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-semibold text-center inline-block min-w-[90px] bg-opacity-90 shadow-sm",
        status === "Completed" && "bg-[#d1fae5] text-[#10b981]", 
        status === "Pending" && "bg-[#fef3c7] text-[#f59e0b]",   
        status === "Overdue" && "bg-[#ffe4e6] text-[#f43f5e]",
        status === "Failed" && "bg-gray-200 text-gray-700"     
      )}
    >
      {status}
    </span>
  );
};

export default function Finance() {
  const [customerTxns, setCustomerTxns] = useState(INITIAL_CUSTOMER_TXNS);
  const [providerTxns, setProviderTxns] = useState(INITIAL_PROVIDER_TXNS);

  const handleExport = (type: string) => {
    alert(`Triggered export to CSV for ${type}.`);
  };

  const updateCustomerStatus = (id: number, newStatus: StatusType) => {
    setCustomerTxns(prev => prev.map(txn => txn.id === id ? { ...txn, status: newStatus } : txn));
  };

  const updateProviderStatus = (id: number, newStatus: StatusType) => {
    setProviderTxns(prev => prev.map(txn => txn.id === id ? { ...txn, status: newStatus } : txn));
  };

  // Dynamically calculate the totals based on state updates!
  const totalCustomerDeposits = useMemo(() => {
    return customerTxns
      .filter(t => t.type === "Deposit" && t.status === "Completed")
      .reduce((acc, t) => acc + t.amountValue, 0);
  }, [customerTxns]);

  const totalProviderPayouts = useMemo(() => {
    return providerTxns
      .filter(t => t.type === "Withdrawal" && t.status === "Completed")
      .reduce((acc, t) => acc + t.amountValue, 0);
  }, [providerTxns]);

  return (
    <div className="flex flex-col w-full h-full mt-2 relative pb-10">
      <h1 className="text-[28px] lg:text-3xl font-semibold text-gray-900 tracking-tight mb-8">Finance</h1>

      <div className="flex flex-col gap-10">
        
        {/* Overall Financial Summary Section */}
        <section>
          <h2 className="text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-tight mb-5">Overall Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Total Commission Card */}
            <div className="bg-[#BDBCA9] hover:bg-[#b0afa0] rounded-2xl p-6 transition-colors shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] text-gray-700 font-medium">Total Commission</span>
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight">₦ 4,000.00</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0 hover:bg-black/20 transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-gray-800" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-4 h-4 text-[#10b981] stroke-[2.5px]" />
                <span className="text-sm font-semibold text-[#10b981]">8.5%</span>
              </div>
            </div>

            {/* Total Profit Card */}
            <div className="bg-[#BDBCA9] hover:bg-[#b0afa0] rounded-2xl p-6 transition-colors shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] text-gray-700 font-medium">Total Profit</span>
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight">₦ 4,000.00</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0 hover:bg-black/20 transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-gray-800" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-4 h-4 text-[#10b981] stroke-[2.5px]" />
                <span className="text-sm font-semibold text-[#10b981]">8.5%</span>
              </div>
            </div>

            {/* Total Customer Deposits Card (Dynamic) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-colors shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] text-gray-500 font-medium">Customer Deposits</span>
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight">{formatCurrency(totalCustomerDeposits)}</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <ArrowDownCircle className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-sm font-semibold text-gray-500">Inbound Capital</span>
              </div>
            </div>

            {/* Total Provider Payouts Card (Dynamic) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-colors shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] text-gray-500 font-medium">Provider Payouts (Withdrawn)</span>
                  <span className="text-[26px] font-bold text-gray-900 tracking-tight">{formatCurrency(totalProviderPayouts)}</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <ArrowUpCircle className="w-5 h-5 text-red-600" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-sm font-semibold text-gray-500">Outbound Capital</span>
              </div>
            </div>

          </div>
        </section>

        {/* Customer Activity Ledger */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-tight mb-1">Customer Financial Activity</h2>
              <p className="text-sm text-gray-500">Track deposits, withdrawals, and booking expenditures.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-[#243cd6] hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-full transition-colors shadow-sm flex items-center gap-1 text-[13px]">
                <ChevronLeft className="w-4 h-4" />
                This Month
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleExport("customer records")}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm text-gray-600 border border-gray-200"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto min-h-[250px]">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="text-gray-800 font-semibold border-b border-transparent">
                  <th className="pb-4 font-semibold text-[14px]">Customer</th>
                  <th className="pb-4 font-semibold text-[14px]">Transaction Type</th>
                  <th className="pb-4 font-semibold text-[14px]">Amount</th>
                  <th className="pb-4 font-semibold text-[14px]">Date</th>
                  <th className="pb-4 font-semibold text-[14px]">Status</th>
                  <th className="pb-4 font-semibold text-[14px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {customerTxns.map((row) => (
                  <tr key={`customer-${row.id}`} className="text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group border-b border-gray-50 last:border-0 relative">
                    <td className="py-3.5 pl-2 rounded-l-lg">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt="customer" className="w-8 h-8 rounded-full object-cover shadow-sm bg-blue-100 shrink-0" />
                        <span>{row.customer}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[12px] font-semibold",
                        row.type === "Deposit" && "bg-blue-50 text-blue-700 border border-blue-100",
                        row.type === "Withdrawal" && "bg-gray-100 text-gray-700 border border-gray-200",
                        row.type === "Booking Payment" && "bg-purple-50 text-purple-700 border border-purple-100",
                      )}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold">
                      <span className={cn(
                        row.type === "Deposit" ? "text-green-600" : "text-gray-800"
                      )}>
                        {row.type === "Deposit" ? "+ " : "- "}
                        {formatCurrency(row.amountValue)}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-500">{row.date}</td>
                    <td className="py-3.5">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="py-3.5 pr-2 rounded-r-lg text-right">
                      {row.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                           <button onClick={() => updateCustomerStatus(row.id, "Completed")} className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors" title="Approve Request">
                             <Check className="w-4 h-4" />
                           </button>
                           <button onClick={() => updateCustomerStatus(row.id, "Failed")} className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Reject Request">
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[13px] pr-2">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Provider Activity Ledger */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-tight mb-1">Service Provider Financial Activity</h2>
              <p className="text-sm text-gray-500">Track provider earnings from bookings and their direct withdrawals.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-[#243cd6] hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-full transition-colors shadow-sm flex items-center gap-1 text-[13px]">
                <ChevronLeft className="w-4 h-4" />
                This Month
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleExport("provider records")}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm text-gray-600 border border-gray-200"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto min-h-[250px]">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="text-gray-800 font-semibold border-b border-transparent">
                  <th className="pb-4 font-semibold text-[14px]">Service Provider</th>
                  <th className="pb-4 font-semibold text-[14px]">Transaction Type</th>
                  <th className="pb-4 font-semibold text-[14px]">Service Gig</th>
                  <th className="pb-4 font-semibold text-[14px]">Amount</th>
                  <th className="pb-4 font-semibold text-[14px]">Date</th>
                  <th className="pb-4 font-semibold text-[14px]">Status</th>
                  <th className="pb-4 font-semibold text-[14px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {providerTxns.map((row) => (
                  <tr key={`provider-${row.id}`} className="text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group border-b border-gray-50 last:border-0 relative">
                    <td className="py-3.5 pl-2 rounded-l-lg">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt="provider" className="w-8 h-8 rounded-full object-cover shadow-sm bg-green-100 shrink-0" />
                        <span>{row.provider}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[12px] font-semibold",
                        row.type === "Earnings" && "bg-green-50 text-green-700 border border-green-100",
                        row.type === "Withdrawal" && "bg-gray-100 text-gray-700 border border-gray-200",
                      )}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {row.type === "Earnings" ? row.service : "—"}
                    </td>
                    <td className="py-3.5 font-semibold">
                      <span className={cn(
                        row.type === "Earnings" ? "text-green-600" : "text-gray-800"
                      )}>
                        {row.type === "Earnings" ? "+ " : "- "}
                        {formatCurrency(row.amountValue)}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-500">{row.date}</td>
                    <td className="py-3.5">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="py-3.5 pr-2 rounded-r-lg text-right">
                      {row.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                           <button onClick={() => updateProviderStatus(row.id, "Completed")} className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors" title="Approve Withdrawal">
                             <Check className="w-4 h-4" />
                           </button>
                           <button onClick={() => updateProviderStatus(row.id, "Failed")} className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Reject Withdrawal">
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[13px] pr-2">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
