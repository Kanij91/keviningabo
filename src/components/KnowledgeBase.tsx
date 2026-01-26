import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const currentUser = useQuery(api.users.getCurrentUser);
  const allArticles = useQuery(api.knowledgeBase.getAllArticles);
  const createArticle = useMutation(api.knowledgeBase.createArticle);
  const updateArticle = useMutation(api.knowledgeBase.updateArticle);
  const deleteArticle = useMutation(api.knowledgeBase.deleteArticle);

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "technician";

  const filteredArticles = allArticles?.filter((article) => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = Array.from(new Set(allArticles?.map(a => a.category) || []));

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createArticle({
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      });
      
      toast.success("Article created successfully!");
      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Failed to create article");
      console.error(error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await deleteArticle({ articleId: articleId as any });
      toast.success("Article deleted successfully!");
      setSelectedArticle(null);
    } catch (error) {
      toast.error("Failed to delete article");
      console.error(error);
    }
  };

  return (
    <div className="space-y-section">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-secondary-900">Knowledge Base</h2>
          {canEdit && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Article
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Search Articles</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or content..."
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div key={article._id} className="border border-border rounded-container p-4 hover:shadow transition-shadow bg-background-secondary">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">{article.title}</h3>
                  <p className="text-secondary-600 mb-2 line-clamp-2">
                    {article.content.substring(0, 200)}...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    <span>Category: <span className="font-medium">{article.category}</span></span>
                    <span>By: <span className="font-medium">{article.authorName}</span></span>
                    <span>{new Date(article._creationTime).toLocaleDateString()}</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-primary-50 text-primary border border-primary-200 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-primary hover:text-primary-hover text-sm font-semibold transition-colors"
                  >
                    View
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => handleDeleteArticle(article._id)}
                      className="text-red-800 hover:text-red-900 text-sm font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-secondary-600">No articles found.</p>
          </div>
        )}
      </div>

      {/* Create Article Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-2xl w-full max-h-screen overflow-y-auto shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-secondary-900">Create New Article</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateArticle} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Content *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="form-textarea"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input"
                    placeholder="e.g., Hardware, Software, Network"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="form-input"
                    placeholder="Comma-separated tags"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-4xl w-full max-h-screen overflow-y-auto shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold text-secondary-900">{selectedArticle.title}</h3>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 text-sm text-secondary-600 pb-4 border-b border-border">
                <span>Category: <span className="font-semibold">{selectedArticle.category}</span></span> | 
                <span> By: <span className="font-semibold">{selectedArticle.authorName}</span></span> | 
                <span> {new Date(selectedArticle._creationTime).toLocaleDateString()}</span>
              </div>

              {selectedArticle.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {selectedArticle.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-primary-50 text-primary border border-primary-200 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-secondary-900 bg-secondary-50 p-4 rounded-container">
                  {selectedArticle.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
