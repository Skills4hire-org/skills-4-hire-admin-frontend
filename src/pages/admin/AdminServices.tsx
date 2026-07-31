import { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { createAdminService, updateAdminService, deleteAdminService } from "@/api/admin";
import { api } from "@/utils/axiosConfig";

type ServiceCategory = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export default function AdminServices() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch Service Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      // In the schema, GET /api/admin/service/ is not listed directly as a GET endpoint,
      // but let's check if there's a list endpoint or if we can fetch categories from the public API or fallback.
      // Usually, there is a GET endpoint on `/api/services/` or `/api/admin/service/`.
      // Let's call GET /api/admin/service/ or fetch from public service categories.
      const response = await api.get("/api/admin/service/").catch(async () => {
        return await api.get("/api/services/");
      });
      if (response && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : response.data.results || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateAdminService(editingCategory.id, formData);
      } else {
        await createAdminService(formData);
      }
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service category?")) {
      try {
        await deleteAdminService(id);
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full mt-2 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Service Categories</h1>
        <button 
          onClick={openAddModal}
          className="bg-[#243cd6] hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-full transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="bg-[#EAEBEA]/50 rounded-2xl p-6 sm:p-8 flex-1 box-border">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-gray-500 font-medium">Loading categories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-950 mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-600 mb-6">{cat.description || "No description provided."}</p>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => openEditModal(cat)}
                    className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                    title="Edit"
                  >
                    <Pencil className="w-[18px] h-[18px]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-gray-600 hover:text-red-500 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No service categories found.
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  placeholder="e.g. Electrical Work"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  placeholder="Short description of the service category"
                  rows={3}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#243cd6] text-white font-medium rounded-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
