import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Plus, AlertCircle, ChevronLeft, ChevronRight, MapPin, Briefcase, Building2, DollarSign, Wifi } from "lucide-react";
import {
  getAdminJobs,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  getAdminApplicationCategories,
  getAdminServiceCategories,
} from "@/api/admin";

// Common currencies with symbols
const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "NGN", symbol: "₦", label: "NGN (₦)" },
  { code: "GHS", symbol: "₵", label: "GHS (₵)" },
  { code: "KES", symbol: "KSh", label: "KES (KSh)" },
  { code: "ZAR", symbol: "R", label: "ZAR (R)" },
  { code: "CAD", symbol: "CA$", label: "CAD (CA$)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

const getCurrencySymbol = (code: string) =>
  CURRENCIES.find((c) => c.code === code)?.symbol ?? code;

const formatBudget = (job: Job) => {
  const sym = getCurrencySymbol(job.currency || "USD");
  if (job.min_charge && job.max_charge)
    return `${sym}${job.min_charge} – ${sym}${job.max_charge}`;
  if (job.min_charge) return `${sym}${job.min_charge}+`;
  return null;
};

const JOBS_PER_PAGE = 10;

type Job = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  is_remote?: boolean;
  job_type?: string;
  company_name?: string;
  job_link?: string;
  min_charge?: number;
  max_charge?: number;
  currency?: string;
  category?: string;
  [key: string]: any;
};

type CategoryOption = { id: string; name: string };

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/40 focus:border-[#243cd6] outline-none transition-colors text-sm";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    is_remote: false,
    job_type: "",
    company_name: "",
    job_link: "",
    min_charge: "",
    max_charge: "",
    currency: "USD",
    category: "",
  });

  // ─── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Fetch Jobs ────────────────────────────────────────────────────────────
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminJobs();
      if (response) {
        const rawList = Array.isArray(response)
          ? response
          : Array.isArray(response.results)
          ? response.results
          : Array.isArray(response.data?.results)
          ? response.data.results
          : Array.isArray(response.data)
          ? response.data
          : [];
        const jobsData: Job[] = rawList.map((job: any) => ({
          ...job,
          id: job.id ?? job.application_id ?? job.external_id ?? job.job_id ?? job.pk ?? "",
        }));
        setJobs(jobsData);
        setCurrentPage(1);
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail || err?.message || "Failed to load jobs. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  // ─── Fetch Categories ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const normalize = (raw: any[]): CategoryOption[] =>
          raw.map((item) => ({
            id: item.category_id ?? item.id ?? String(item),
            name: item.name ?? item.category_name ?? String(item),
          }));
        const toArray = (res: any): any[] => {
          if (!res) return [];
          return Array.isArray(res)
            ? res
            : Array.isArray(res.results)
            ? res.results
            : Array.isArray(res.data?.results)
            ? res.data.results
            : Array.isArray(res.data)
            ? res.data
            : [];
        };
        const [appCatRes, svcCatRes] = await Promise.allSettled([
          getAdminApplicationCategories(),
          getAdminServiceCategories(),
        ]);
        const appCats = appCatRes.status === "fulfilled" ? normalize(toArray(appCatRes.value)) : [];
        const svcCats = svcCatRes.status === "fulfilled" ? normalize(toArray(svcCatRes.value)) : [];
        const seen = new Set<string>();
        const merged: CategoryOption[] = [];
        for (const cat of [...appCats, ...svcCats]) {
          const key = cat.name.toLowerCase().trim();
          if (!seen.has(key)) { seen.add(key); merged.push(cat); }
        }
        merged.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(merged);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ─── Modal helpers ─────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: "", description: "", location: "", is_remote: false,
      job_type: "", company_name: "", job_link: "",
      min_charge: "", max_charge: "", currency: "USD", category: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || "",
      location: job.location || "",
      is_remote: job.is_remote || false,
      job_type: job.job_type || "",
      company_name: job.company_name || "",
      job_link: job.job_link || "",
      min_charge: job.min_charge?.toString() || "",
      max_charge: job.max_charge?.toString() || "",
      currency: job.currency || "USD",
      category: job.category || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingJob(null); };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ─── Save / Delete ─────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.title.trim()) { setError("Job title is required"); return; }
    try {
      const payload = {
        ...formData,
        min_charge: formData.min_charge ? parseFloat(formData.min_charge) : null,
        max_charge: formData.max_charge ? parseFloat(formData.max_charge) : null,
      };
      if (editingJob) {
        if (!editingJob.id) {
          setError("Cannot update: job ID is missing.");
          return;
        }
        await updateAdminJob(editingJob.id, payload);
      } else {
        await createAdminJob(payload);
      }
      closeModal();
      fetchJobs();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        Object.values(err?.response?.data || {}).join(", ") ||
        err?.message ||
        "Failed to save job.";
      setError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) { setError("Cannot delete: job ID is missing."); return; }
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setError(null);
    try {
      await deleteAdminJob(id);
      fetchJobs();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Failed to delete job.");
    }
  };

  // ─── Pagination control ────────────────────────────────────────────────────
  const PaginationBar = () => {
    if (totalPages <= 1) return null;

    // Build page number list with ellipsis
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("…");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++)
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500 hidden sm:block">
          Showing {(currentPage - 1) * JOBS_PER_PAGE + 1}–
          {Math.min(currentPage * JOBS_PER_PAGE, jobs.length)} of {jobs.length} jobs
        </p>
        <p className="text-sm text-gray-500 sm:hidden">
          Page {currentPage} / {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p as number)}
                className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === p
                    ? "bg-[#243cd6] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Jobs Management</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-500">Create and manage job postings</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#243cd6] hover:bg-[#1a2fa8] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base shrink-0"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Create Job</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-4">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-[#243cd6] rounded-full animate-spin" />
              </div>
              <p className="text-gray-500 text-sm">Loading jobs...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {paginatedJobs.length > 0 ? (
              <>
                {/* ── Desktop Table (md+) ─────────────────────────────── */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Title", "Company", "Location", "Job Type", "Budget", "Remote", "Actions"].map(
                          (col) => (
                            <th
                              key={col}
                              className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900 max-w-[180px] truncate">
                            {job.title}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 max-w-[140px] truncate">
                            {job.company_name || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 max-w-[130px] truncate">
                            {job.location || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {job.job_type ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {job.job_type}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatBudget(job) || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                job.is_remote
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.is_remote ? "Remote" : "On-site"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditModal(job)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Mobile Card List (< md) ─────────────────────────── */}
                <div className="md:hidden divide-y divide-gray-100">
                  {paginatedJobs.map((job) => {
                    const budget = formatBudget(job);
                    return (
                      <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                        {/* Card top row */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                              {job.title}
                            </p>
                            {job.company_name && (
                              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <Building2 className="w-3 h-3 shrink-0" />
                                {job.company_name}
                              </p>
                            )}
                          </div>
                          {/* Action buttons */}
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => openEditModal(job)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Meta chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          )}
                          {job.job_type && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              <Briefcase className="w-3 h-3" />
                              {job.job_type}
                            </span>
                          )}
                          {budget && (
                            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                              <DollarSign className="w-3 h-3" />
                              {budget}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                              job.is_remote
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Wifi className="w-3 h-3" />
                            {job.is_remote ? "Remote" : "On-site"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <PaginationBar />
              </>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                  <Briefcase className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">No jobs yet</p>
                <p className="text-gray-400 text-sm mb-5">Get started by creating your first job posting.</p>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 bg-[#243cd6] hover:bg-[#1a2fa8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Job
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              {/* Drag handle on mobile */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {editingJob ? "Edit Job" : "Create New Job"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-5 space-y-4">

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Frontend Developer"
                  className={inputClass}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role, responsibilities, requirements..."
                  rows={4}
                  className={inputClass}
                />
              </div>

              {/* Company + Job Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Acme Corp"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Job Type
                  </label>
                  <input
                    type="text"
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Full-time, Contract"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos, Nigeria"
                  className={inputClass}
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Currency
                </label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} className={inputClass}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Min + Max Charge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Min Charge ({getCurrencySymbol(formData.currency)})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none pointer-events-none">
                      {getCurrencySymbol(formData.currency)}
                    </span>
                    <input
                      type="number"
                      name="min_charge"
                      value={formData.min_charge}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Charge ({getCurrencySymbol(formData.currency)})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none pointer-events-none">
                      {getCurrencySymbol(formData.currency)}
                    </span>
                    <input
                      type="number"
                      name="max_charge"
                      value={formData.max_charge}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
              </div>

              {/* Job Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Link
                </label>
                <input
                  type="url"
                  name="job_link"
                  value={formData.job_link}
                  onChange={handleInputChange}
                  placeholder="https://example.com/apply"
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select name="category" value={formData.category} onChange={handleInputChange} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No categories available</p>
                )}
              </div>

              {/* Remote toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#243cd6] cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Remote Job</span>
              </label>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#243cd6] hover:bg-[#1a2fa8] text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {editingJob ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
