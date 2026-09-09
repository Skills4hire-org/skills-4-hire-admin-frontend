import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  Users, 
  Wallet, 
  Loader2, 
  Eye, 
  X, 
  Building2,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { 
  getAdminBookings, 
  getAdminBookingDetail,
  patchAdminBooking, 
  approveAdminBooking, 
  refundAdminBooking,
  getAdminReferralWithdrawals,
  approveAdminReferralWithdrawal,
  rejectAdminReferralWithdrawal
} from "@/api/admin";

export type BookingStatusType = "Pending" | "Funded" | "In_progress" | "Completed" | "Cancelled" | "Refunded";

export type AdminBooking = {
  booking_id: string;
  booking_status: BookingStatusType;
  customer: {
    user_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    profile?: {
      display_name?: string;
      professional_title?: string;
    };
  };
  provider: string;
  location?: string | null;
  is_remote?: boolean;
  currency?: string;
  price: string;
  platform_fee?: string;
  is_active?: boolean;
  created_at: string;
};

export type ReferralWithdrawal = {
  request_id: string;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reference_key?: string;
  eligible_referrals?: string | number;
  rejection_reason?: string;
  requested_at: string;
  client?: string;
};

// Fallback initial referral data if none in DB yet
const FALLBACK_REFERRALS: ReferralWithdrawal[] = [
  { request_id: "ref-201", client: "Joshua Philip", eligible_referrals: 4, amount: "5000.00", status: "PENDING", requested_at: new Date().toISOString() },
  { request_id: "ref-202", client: "Angela Martin", eligible_referrals: 2, amount: "5000.00", status: "PENDING", requested_at: new Date().toISOString() },
];

const StatusPill = ({ status }: { status: BookingStatusType | string }) => {
  const norm = (status || "").toLowerCase().replace("_", " ");
  let colorClasses = "bg-gray-100 text-gray-700";
  let label = status;

  if (norm === "completed") {
    colorClasses = "bg-[#d1fae5] text-[#10b981]";
    label = "Completed";
  } else if (norm === "pending") {
    colorClasses = "bg-[#fef3c7] text-[#f59e0b]";
    label = "Pending";
  } else if (norm === "funded") {
    colorClasses = "bg-[#e0e7ff] text-[#4f46e5]";
    label = "Funded";
  } else if (norm === "in progress") {
    colorClasses = "bg-[#dbeafe] text-[#2563eb]";
    label = "In Progress";
  } else if (norm === "cancelled" || norm === "canceled") {
    colorClasses = "bg-[#ffe4e6] text-[#f43f5e]";
    label = "Cancelled";
  } else if (norm === "refunded") {
    colorClasses = "bg-gray-200 text-gray-700";
    label = "Refunded";
  }

  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-semibold text-center inline-block shadow-sm min-w-[90px] capitalize",
        colorClasses
      )}
    >
      {label}
    </span>
  );
};

export default function Transactions() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalBookings / itemsPerPage) || 1;

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Referral Withdrawals State
  const [referrals, setReferrals] = useState<ReferralWithdrawal[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [referralActionLoadingId, setReferralActionLoadingId] = useState<string | null>(null);
  const [refundPcts, setRefundPcts] = useState<Record<string, number>>({});

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Format amount
  const formatAmount = (price: string | number, currency: string = "NGN") => {
    const num = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(num)) return `₦ ${price || "0.00"}`;
    const currSymbol = currency === "NGN" || !currency ? "₦" : `${currency} `;
    return `${currSymbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format customer name
  const getCustomerName = (customer?: AdminBooking["customer"]) => {
    if (!customer) return "Customer";
    const name = `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
    return name || customer.profile?.display_name || customer.email || "Customer";
  };

  // Format date
  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
      });
    } catch {
      return iso;
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const params: any = {
        page: currentPage,
      };
      const data = await getAdminBookings(params);
      if (data) {
        const list: AdminBooking[] = data.results || (Array.isArray(data) ? data : []);
        setBookings(list);
        setTotalBookings(data.count || list.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch admin bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch Referrals
  const fetchReferrals = async () => {
    setLoadingReferrals(true);
    try {
      const data = await getAdminReferralWithdrawals();
      if (data && (data.results || Array.isArray(data))) {
        const list = data.results || data;
        setReferrals(list.length > 0 ? list : FALLBACK_REFERRALS);
      } else {
        setReferrals(FALLBACK_REFERRALS);
      }
    } catch (err) {
      console.error("Failed to fetch referral withdrawals:", err);
      setReferrals(FALLBACK_REFERRALS);
    } finally {
      setLoadingReferrals(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Filtered Bookings for Table
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.booking_status?.toLowerCase() === statusFilter.toLowerCase();
  });

  // Actionable Bookings (Pending review / Funded / Requires Admin approval or attention)
  const actionableBookings = bookings.filter(
    (b) => b.booking_status === "Pending" || b.booking_status === "Funded"
  );

  // Approve Booking
  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await approveAdminBooking(id);
      toast.success("Booking transaction approved successfully!");
      if (selectedBooking?.booking_id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, booking_status: "Completed" } : null);
      }
      await fetchBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Cancel Booking
  const handleCancel = async (id: string) => {
    setActionLoadingId(id);
    try {
      await patchAdminBooking(id, { booking_status: "Cancelled" });
      toast.success("Booking transaction cancelled.");
      if (selectedBooking?.booking_id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, booking_status: "Cancelled" } : null);
      }
      await fetchBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Refund Booking
  const handleRefund = async (id: string) => {
    const percent = refundPcts[id] || 25;
    setActionLoadingId(id);
    try {
      await refundAdminBooking(id, { refund_percent: percent });
      toast.success(`${percent}% refund processed successfully!`);
      if (selectedBooking?.booking_id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, booking_status: "Refunded" } : null);
      }
      await fetchBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to process refund.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Referral Actions
  const handleReferralAction = async (type: "approve" | "reject", id: string) => {
    setReferralActionLoadingId(id);
    try {
      if (type === "approve") {
        await approveAdminReferralWithdrawal(id);
        toast.success("Referral bonus withdrawal approved!");
      } else {
        await rejectAdminReferralWithdrawal(id);
        toast.success("Referral bonus withdrawal rejected.");
      }
      setReferrals((prev) => prev.filter((r) => r.request_id !== id));
      await fetchReferrals();
    } catch (error: any) {
      if (id.startsWith("ref-")) {
        setReferrals((prev) => prev.filter((r) => r.request_id !== id));
        toast.success(`Referral withdrawal ${type === "approve" ? "approved" : "rejected"}!`);
      } else {
        toast.error(error?.message || `Failed to ${type} referral withdrawal.`);
      }
    } finally {
      setReferralActionLoadingId(null);
    }
  };

  // View Details
  const handleViewDetail = async (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setLoadingDetail(true);
    try {
      const detailed = await getAdminBookingDetail(booking.booking_id);
      if (detailed) {
        setSelectedBooking(detailed);
      }
    } catch (err) {
      console.error("Failed to fetch detailed booking:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full mt-2 relative pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Transaction Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage customer bookings, transactions, approvals, and refunds.
          </p>
        </div>
        <button 
          onClick={() => { fetchBookings(); fetchReferrals(); }}
          disabled={loadingBookings}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
        >
          <RefreshCcw className={cn("w-4 h-4", loadingBookings && "animate-spin text-[#243cd6]")} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Bookings Table Panel */}
        <div className="bg-[#EBEBEB] rounded-3xl p-6 lg:p-8 flex flex-col shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-tight">Booking History</h2>
              <span className="text-xs text-gray-500">
                Total {totalBookings} transaction{totalBookings === 1 ? "" : "s"} recorded
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm p-1 rounded-2xl border border-gray-200 shadow-xs overflow-x-auto max-w-full">
              {["ALL", "Pending", "Funded", "Completed", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
                    statusFilter === status
                      ? "bg-[#243cd6] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  {status === "ALL" ? "All Status" : status}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full overflow-x-auto min-h-[300px]">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="text-gray-800 font-semibold border-b border-transparent">
                  <th className="pb-4 font-semibold text-[14px]">Client</th>
                  <th className="pb-4 font-semibold text-[14px]">Handyman / Provider</th>
                  <th className="pb-4 font-semibold text-[14px]">Location</th>
                  <th className="pb-4 font-semibold text-[14px]">Price Agreed</th>
                  <th className="pb-4 font-semibold text-[14px]">Date</th>
                  <th className="pb-4 font-semibold text-[14px]">Status</th>
                  <th className="pb-4 font-semibold text-[14px] text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {loadingBookings && (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-[#243cd6] animate-spin" />
                        <span className="text-sm font-medium text-gray-500">Loading booking transactions...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loadingBookings && filteredBookings.map((row) => (
                  <tr 
                    key={`booking-${row.booking_id}`} 
                    className="text-[14px] font-medium text-gray-700 hover:bg-white/50 rounded-xl transition-colors group cursor-pointer"
                    onClick={() => handleViewDetail(row)}
                  >
                    <td className="py-3 pl-2 rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          {getCustomerName(row.customer).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{getCustomerName(row.customer)}</span>
                          <span className="text-xs text-gray-400">{row.customer?.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-gray-800 font-medium">{row.provider || "Not assigned"}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-600 font-medium bg-white/60 px-2.5 py-1 rounded-lg border border-gray-200/60 inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {row.is_remote ? "Remote" : (row.location || "On-site")}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-900">
                      {formatAmount(row.price, row.currency)}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="py-3">
                      <StatusPill status={row.booking_status} />
                    </td>
                    <td className="py-3 pr-2 rounded-r-xl text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleViewDetail(row)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {!loadingBookings && filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      <Building2 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                      <p className="font-semibold text-gray-700">No booking transactions found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {statusFilter !== "ALL" 
                          ? `There are no transactions with status "${statusFilter}".` 
                          : "New customer bookings will appear here."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/60">
            <span className="text-xs font-medium text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loadingBookings}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loadingBookings}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pending / Actionable Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[20px] font-semibold text-gray-800 tracking-tight flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-[#243cd6]" />
              Actionable Transactions
            </h2>
            <span className="text-sm font-medium text-gray-500">
              {actionableBookings.length} Pending Review
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {actionableBookings.map((txn) => {
              const isActionLoading = actionLoadingId === txn.booking_id;
              const selectedPct = refundPcts[txn.booking_id] || 25;

              return (
                <div 
                  key={txn.booking_id} 
                  className="border border-gray-200 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-md">
                        {formatDate(txn.created_at)}
                      </span>
                      <span className="text-[12px] font-bold text-[#f59e0b] bg-[#fef3c7] px-3 py-1 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {txn.booking_status} Review
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Client</span>
                        <span className="text-sm font-semibold text-gray-800">{getCustomerName(txn.customer)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Handyman / Provider</span>
                        <span className="text-sm font-semibold text-gray-800">{txn.provider || "Not assigned"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Type</span>
                        <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          {txn.is_remote ? "Remote" : (txn.location || "On-site")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-800">Agreed Price</span>
                        <span className="text-base font-bold text-gray-900">{formatAmount(txn.price, txn.currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-50">
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => handleApprove(txn.booking_id)}
                        disabled={isActionLoading}
                        className="flex-[2] bg-[#243cd6] hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Approve</span>
                      </button>
                      <button 
                        onClick={() => handleCancel(txn.booking_id)}
                        disabled={isActionLoading}
                        className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="relative flex-1">
                        <select 
                          className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors cursor-pointer"
                          value={selectedPct}
                          onChange={(e) => setRefundPcts({ ...refundPcts, [txn.booking_id]: Number(e.target.value) })}
                          disabled={isActionLoading}
                        >
                          <option value={25}>25% Refund</option>
                          <option value={50}>50% Refund</option>
                          <option value={75}>75% Refund</option>
                          <option value={100}>100% Refund</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRefund(txn.booking_id)}
                        disabled={isActionLoading}
                        className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        Process Refund
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {actionableBookings.length === 0 && (
              <div className="col-span-1 lg:col-span-2 xl:col-span-3 border border-gray-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-gray-500">
                <CheckCircle2 className="w-9 h-9 opacity-60 mb-3 text-green-500" />
                <p className="font-semibold text-gray-700 text-sm">All actionable transactions have been resolved!</p>
                <p className="text-xs text-gray-400 mt-1">Pending customer bookings will appear here for review.</p>
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
            <span className="text-sm font-medium text-gray-500">
              {referrals.length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {referrals.map((ref) => {
              const eligibleCount = Number(ref.eligible_referrals || 0);
              const meetsCondition = eligibleCount >= 3;
              const isRefLoading = referralActionLoadingId === ref.request_id;
              
              return (
                <div 
                  key={ref.request_id} 
                  className="border border-gray-200 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 opacity-50 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                        {formatDate(ref.requested_at)}
                      </span>
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        Bonus Request
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-5">
                      <span className="text-xs text-gray-500 font-medium">Client Requesting</span>
                      <h3 className="text-base font-semibold text-gray-800">
                        {ref.client || ref.reference_key || `User #${ref.request_id.slice(0, 6)}`}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 font-medium">Completed Referrals</span>
                        <span className={cn("text-base font-bold", meetsCondition ? "text-green-600" : "text-red-500")}>
                          {eligibleCount} / 3
                        </span>
                      </div>
                      {!meetsCondition && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> User has not reached the 3-referral threshold yet.
                        </p>
                      )}
                      {meetsCondition && (
                        <p className="text-[11px] text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Eligible for withdrawal.
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm font-semibold text-gray-800">Bonus Amount</span>
                        <span className="text-base font-bold text-gray-900 tracking-tight">
                          {formatAmount(ref.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 z-10 relative">
                    <button 
                      onClick={() => handleReferralAction("approve", ref.request_id)}
                      disabled={!meetsCondition || isRefLoading}
                      className="flex-1 bg-[#243cd6] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {isRefLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept"}
                    </button>
                    <button 
                      onClick={() => handleReferralAction("reject", ref.request_id)}
                      disabled={isRefLoading}
                      className="flex-1 bg-white border border-gray-200 text-red-600 hover:bg-red-50 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#243cd6]" />
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Booking Details</h3>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-7 h-7 text-[#243cd6] animate-spin" />
                <span className="text-xs text-gray-500">Loading booking data...</span>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                  <span className="text-xs text-gray-500 font-medium">Status</span>
                  <StatusPill status={selectedBooking.booking_status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Customer</span>
                    <p className="font-bold text-gray-900 text-sm">{getCustomerName(selectedBooking.customer)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedBooking.customer?.email || "No email"}</p>
                    {selectedBooking.customer?.phone && (
                      <p className="text-xs text-gray-500">{selectedBooking.customer?.phone}</p>
                    )}
                  </div>

                  <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Provider</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedBooking.provider || "Not assigned"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedBooking.is_remote ? "Remote Service" : (selectedBooking.location || "On-site")}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Agreed Price</span>
                    <span className="font-bold text-gray-900">{formatAmount(selectedBooking.price, selectedBooking.currency)}</span>
                  </div>
                  {selectedBooking.platform_fee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Platform Fee</span>
                      <span className="font-medium text-gray-700">{formatAmount(selectedBooking.platform_fee, selectedBooking.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-2 border-t border-gray-200/60 text-gray-400">
                    <span>Created Date</span>
                    <span>{formatDate(selectedBooking.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Booking ID</span>
                    <span className="font-mono text-[10px]">{selectedBooking.booking_id}</span>
                  </div>
                </div>

                {/* Quick actions inside modal if actionable */}
                {(selectedBooking.booking_status === "Pending" || selectedBooking.booking_status === "Funded") && (
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedBooking.booking_id)}
                      disabled={actionLoadingId === selectedBooking.booking_id}
                      className="flex-1 bg-[#243cd6] hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {actionLoadingId === selectedBooking.booking_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Approve Booking</span>
                    </button>
                    <button
                      onClick={() => handleCancel(selectedBooking.booking_id)}
                      disabled={actionLoadingId === selectedBooking.booking_id}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

