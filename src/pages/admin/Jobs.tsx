import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Plus, AlertCircle } from "lucide-react";
import {
  getAdminJobs,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  getAdminApplicationCategories,
} from "@/api/admin";

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
  category?: string;
  [key: string]: any;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<{ category_id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
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
    category: "",
  });

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminJobs();
      console.log("Fetch jobs response:", response);
      if (response) {
        const jobsData = Array.isArray(response)
          ? response
          : Array.isArray(response.results)
          ? response.results
          : Array.isArray(response.data?.results)
          ? response.data.results
          : Array.isArray(response.data)
          ? response.data
          : [];
        setJobs(jobsData);
      }
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      const errorMsg = err?.response?.data?.detail || err?.message || "Failed to load jobs. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAdminApplicationCategories();
        if (response) {
          const data = Array.isArray(response)
            ? response
            : Array.isArray(response.results)
            ? response.results
            : Array.isArray(response.data?.results)
            ? response.data.results
            : Array.isArray(response.data)
            ? response.data
            : [];
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      is_remote: false,
      job_type: "",
      company_name: "",
      job_link: "",
      min_charge: "",
      max_charge: "",
      category: "",
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
      category: job.category || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.title.trim()) {
      setError("Job title is required");
      return;
    }

    try {
      const payload = {
        ...formData,
        min_charge: formData.min_charge ? parseFloat(formData.min_charge) : null,
        max_charge: formData.max_charge ? parseFloat(formData.max_charge) : null,
      };

      console.log("Sending payload:", payload);

      if (editingJob) {
        const response = await updateAdminJob(editingJob.id, payload);
        console.log("Update response:", response);
      } else {
        const response = await createAdminJob(payload);
        console.log("Create response:", response);
      }
      closeModal();
      fetchJobs();
    } catch (err: any) {
      console.error("Error saving job:", err);
      const errorMsg = err?.response?.data?.detail || 
                      err?.response?.data?.message || 
                      Object.values(err?.response?.data || {}).join(", ") ||
                      err?.message || 
                      "Failed to save job. Please try again.";
      setError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setError(null);
    try {
      const response = await deleteAdminJob(id);
      console.log("Delete response:", response);
      fetchJobs();
    } catch (err: any) {
      console.error("Error deleting job:", err);
      const errorMsg = err?.response?.data?.detail || err?.message || "Failed to delete job. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Jobs Management</h1>
            <p className="mt-2 text-gray-600">Create and manage job postings</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#243cd6] hover:bg-[#1a2fa8] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Job
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-4">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-[#243cd6] rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        )}

        {/* Jobs Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Job Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Budget
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Remote
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {job.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.company_name || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.location || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.job_type || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.min_charge && job.max_charge
                            ? `$${job.min_charge} - $${job.max_charge}`
                            : job.min_charge
                            ? `$${job.min_charge}+`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              job.is_remote
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {job.is_remote ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(job)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="Edit job"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete job"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No jobs found</p>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 text-[#243cd6] hover:text-[#1a2fa8] font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create your first job
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingJob ? "Edit Job" : "Create New Job"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter job description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Company Name and Job Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <input
                    type="text"
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Full-time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Min and Max Charge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Charge ($)
                  </label>
                  <input
                    type="number"
                    name="min_charge"
                    value={formData.min_charge}
                    onChange={handleInputChange}
                    placeholder="Minimum charge"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Charge ($)
                  </label>
                  <input
                    type="number"
                    name="max_charge"
                    value={formData.max_charge}
                    onChange={handleInputChange}
                    placeholder="Maximum charge"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Job Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Link
                </label>
                <input
                  type="url"
                  name="job_link"
                  value={formData.job_link}
                  onChange={handleInputChange}
                  placeholder="https://example.com/job"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243cd6]/50 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No categories available</p>
                )}
              </div>

              {/* Is Remote Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#243cd6] rounded focus:ring-2 focus:ring-[#243cd6]/50 cursor-pointer"
                />
                <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Remote Job
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#243cd6] hover:bg-[#1a2fa8] text-white rounded-lg font-medium transition-colors"
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
