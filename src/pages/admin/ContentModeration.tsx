import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Calendar, Eye, MessageSquare, Rocket, Trash2, ShieldAlert } from "lucide-react";
import { cn } from "../../lib/utils";

type Post = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  body: string;
  status: "Active" | "Flagged";
  date: string;
  views: number;
  inquiries: number;
  images?: string[];
};

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Joshua Philip",
      avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
    },
    title: "Emergency plumbing repairs",
    body: "Fast response emergency plumbing services. Available within 30 minutes for urgent repairs including burst pipes, blocked drains and water heater issues",
    status: "Active",
    date: "Dec 10, 2024",
    views: 447,
    inquiries: 36,
    images: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400"
    ]
  },
  {
    id: "2",
    author: {
      name: "Joshua Philip",
      avatar: "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&q=80&w=150"
    },
    title: "Emergency plumbing repairs",
    body: "Fast response emergency plumbing services. Available within 30 minutes for urgent repairs including burst pipes, blocked drains and water heater issues",
    status: "Active",
    date: "Dec 10, 2024",
    views: 447,
    inquiries: 36,
  }
];

export default function ContentModeration() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmationId(id);
  };

  const handleConfirmDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    setDeleteConfirmationId(null);
  };

  const handleSuspendUser = (id: string) => {
    // In a real app, this would suspend the user and optionally delete the post
    setPosts(posts.filter(p => p.id !== id));
    setDeleteConfirmationId(null);
    alert("User suspended.");
  };

  return (
    <div className="flex flex-col w-full h-full mt-2 relative pb-10">
      <h1 className="text-[28px] lg:text-3xl font-semibold text-gray-900 tracking-tight mb-8">
        Content & Social Feed Moderation
      </h1>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column - Posts */}
        <div className="flex-1 w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Posts</h2>
            <button className="bg-[#243cd6] text-white flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-blue-700 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
                
                {/* Author Info & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt="Author" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <span className="font-semibold text-gray-800 text-[15px]">{post.author.name}</span>
                  </div>
                  <span className={cn(
                    "text-[13px] font-semibold",
                    post.status === "Active" ? "text-emerald-500" : "text-red-500"
                  )}>
                    {post.status}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">{post.body}</p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-[13px] text-gray-400 font-medium mb-5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Posted: {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {post.views} Views
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    {post.inquiries} Inquiries
                  </div>
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {post.images.map((img, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                        <img src={img} alt="Post attachment" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-4 relative">
                  <button className="flex items-center justify-center gap-2 bg-[#fbbd23] hover:bg-[#f5aa0f] text-white font-semibold py-2.5 px-8 rounded-lg transition-colors w-40 text-[15px] shadow-sm">
                    <Rocket className="w-4 h-4" /> Boost
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(post.id)}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-8 rounded-lg transition-colors w-40 text-[15px] shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>

                  {/* Delete Confirmation Popup */}
                  {deleteConfirmationId === post.id && (
                    <div className="absolute top-12 left-1/2 rounded-2xl bg-[#aaaaaa] shadow-xl p-5 z-10 w-64 border border-gray-300">
                      <p className="text-gray-800 font-medium text-sm mb-4 leading-relaxed">
                        Are you sure you want to delete this post?
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleConfirmDelete(post.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => handleSuspendUser(post.id)}
                          className="flex-1 bg-[#fbbd23] hover:bg-[#f5aa0f] text-white py-2 rounded-full text-xs font-semibold transition-colors"
                        >
                          Suspend user
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
                <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No posts require moderation at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Engagement Insight */}
        <div className="w-full xl:w-[350px] shrink-0 bg-[#EFEFEF] rounded-[24px] p-6 shadow-sm border border-gray-100 mt-14 xl:mt-0 xl:sticky xl:top-6">
          <h2 className="text-[20px] font-semibold text-gray-800 tracking-tight text-center mb-6">
            Engagement Insight
          </h2>

          <div className="space-y-4 mb-6">
            {/* Users Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-500 font-semibold mb-1">Users</span>
                  <span className="text-[26px] font-bold text-gray-900 leading-none">4,000</span>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-gray-600">
                  <span className="text-emerald-500">8.5%</span> up from yesterday
                </span>
              </div>
            </div>

            {/* Interactions Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[13px] text-gray-500 font-semibold mb-1">Interactions</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[26px] font-bold text-gray-900 leading-none">4,000</span>
                  <span className="text-sm font-semibold text-emerald-500">+7</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-[5px] border-blue-600 border-r-gray-200" />
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center text-[13px] font-semibold text-gray-600">
              <span>Posts</span>
              <span className="text-gray-900">2,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-semibold text-gray-600">
              <span>Likes</span>
              <span className="text-gray-900">2,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-semibold text-gray-600">
              <span>Comments</span>
              <span className="text-gray-900">2,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-semibold text-gray-600">
              <span>Inquiries</span>
              <span className="text-gray-900">2,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-semibold text-gray-600">
              <span>Boost</span>
              <span className="text-gray-900">2,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-semibold text-gray-600">
              <span>Flagged</span>
              <span className="text-gray-900">2,000</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
