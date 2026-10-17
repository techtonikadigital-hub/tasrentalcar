import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import { fileToDataUrl } from '../../utils/imageUpload';
import { VAN_IMAGES } from '../../assets/images';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  Share2,
  Upload,
  X,
  FileText,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  Check,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export const AdminBlogManagement: React.FC = () => {
  const {
    blogPosts,
    saveBlogPost,
    deleteBlogPost,
    setSelectedBlogPost,
    setCurrentView,
    cars,
    settings,
    updateSettings,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Global Blog SEO Settings Modal State
  const [isGlobalSeoModalOpen, setIsGlobalSeoModalOpen] = useState(false);
  const [globalBlogTitle, setGlobalBlogTitle] = useState(settings.blogSeoTitle || 'TAS Car Rental Journal | Van Travel & Driving Guides');
  const [globalBlogDesc, setGlobalBlogDesc] = useState(settings.blogSeoMetaDescription || 'Expert guides on 7 and 12-seater passenger van hire, Australian driver licence rules, and road trip itineraries.');
  const [globalBlogKeywords, setGlobalBlogKeywords] = useState(settings.blogSeoKeywords || '12 seater van hire Sydney, 7 seater car rental, Kia Carnival hire, Toyota HiAce Revesby');

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Driving Tips');
  const [customCategory, setCustomCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('TAS Editorial Team');
  const [authorRole, setAuthorRole] = useState('Fleet Specialists');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  const [readTime, setReadTime] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [featuredCarId, setFeaturedCarId] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // SEO Form Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImage, setOgImage] = useState('');

  // Upload UI helper state
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ogFileInputRef = useRef<HTMLInputElement>(null);

  // Categories list
  const existingCategories = Array.from(new Set(blogPosts.map((p) => p.category))).filter(Boolean);
  const defaultCategories = ['Driving Tips', 'Van Guide', 'Road Trips', 'Corporate & Events', 'Travel Advice'];
  const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories]));

  // Auto-generate slug from title
  const generateSlug = (rawTitle: string) => {
    return rawTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingPost || !slug) {
      setSlug(generateSlug(newTitle));
    }
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(newTitle);
    }
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    if (!metaDescription || metaDescription === excerpt) {
      setMetaDescription(newExcerpt);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setCategory('Driving Tips');
    setCustomCategory('');
    setExcerpt('');
    setContent(`### Introduction\n\nWrite your guide or article introduction here...\n\n### Key Highlights\n- Point 1: Comfortable passenger van travel\n- Point 2: Licencing and road safety in Australia\n\n### Practical Advice\nShare recommendations for your group road trips.`);
    setCoverImage(VAN_IMAGES.hiace12);
    setAuthor('TAS Editorial Team');
    setAuthorRole('Fleet Specialists');
    setAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
    setReadTime('3 min read');
    setPublishedDate(
      new Intl.DateTimeFormat('en-AU', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())
    );
    setFeaturedCarId(cars.length > 0 ? cars[0].id : '');
    setIsPublished(true);

    // SEO fields
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('passenger van hire, Toyota HiAce hire, 12 seater Sydney');
    setCanonicalUrl('');
    setOgImage('');

    setActiveModalTab('content');
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setCustomCategory('');
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setAuthor(post.author);
    setAuthorRole(post.authorRole);
    setAuthorAvatar(post.authorAvatar);
    setReadTime(post.readTime);
    setPublishedDate(post.publishedDate);
    setFeaturedCarId(post.featuredCarId || '');
    setIsPublished(post.isPublished ?? true);

    // SEO
    setMetaTitle(post.metaTitle || post.title);
    setMetaDescription(post.metaDescription || post.excerpt);
    setKeywords(post.keywords || '');
    setCanonicalUrl(post.canonicalUrl || '');
    setOgImage(post.ogImage || post.coverImage);

    setActiveModalTab('content');
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const dataUrl = await fileToDataUrl(file, 1600, 1000, 0.85);
      setCoverImage(dataUrl);
      if (!ogImage || ogImage === coverImage) {
        setOgImage(dataUrl);
      }
      showToast('Cover photo uploaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to process uploaded image file.', 'error');
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle OG Image Upload
  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingOg(true);
      const dataUrl = await fileToDataUrl(file, 1200, 630, 0.85);
      setOgImage(dataUrl);
      showToast('Social sharing (OG) image uploaded!', 'success');
    } catch (err) {
      showToast('Failed to process social image file.', 'error');
    } finally {
      setIsUploadingOg(false);
      if (ogFileInputRef.current) ogFileInputRef.current.value = '';
    }
  };

  // Save Blog Post
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide an article title.', 'error');
      return;
    }
    if (!content.trim()) {
      showToast('Please write some content for the article.', 'error');
      return;
    }

    const finalCategory = category === 'Custom' && customCategory.trim() ? customCategory.trim() : category;
    const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(title);

    saveBlogPost({
      id: editingPost?.id,
      title: title.trim(),
      slug: finalSlug,
      category: finalCategory,
      excerpt: excerpt.trim() || content.slice(0, 150) + '...',
      content: content.trim(),
      coverImage: coverImage || VAN_IMAGES.fleetShowcase,
      author: author.trim() || 'TAS Editorial Team',
      authorRole: authorRole.trim() || 'Fleet Specialists',
      authorAvatar: authorAvatar.trim(),
      readTime: readTime.trim() || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      publishedDate: publishedDate || new Date().toLocaleDateString('en-AU'),
      featuredCarId: featuredCarId || undefined,
      isPublished,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim() || content.slice(0, 160),
      keywords: keywords.trim(),
      canonicalUrl: canonicalUrl.trim(),
      ogImage: ogImage.trim() || coverImage,
    });

    setIsModalOpen(false);
    setEditingPost(null);
  };

  const confirmDelete = () => {
    if (!postToDelete) return;
    deleteBlogPost(postToDelete.id);
    setPostToDelete(null);
  };

  // Save Global Blog SEO Settings
  const handleSaveGlobalSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      blogSeoTitle: globalBlogTitle.trim(),
      blogSeoMetaDescription: globalBlogDesc.trim(),
      blogSeoKeywords: globalBlogKeywords.trim(),
    });
    setIsGlobalSeoModalOpen(false);
    showToast('Global Blog SEO defaults updated!', 'success');
  };

  // Filtered posts
  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategoryFilter !== 'All' && post.category !== selectedCategoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchContent || matchAuthor;
    }
    return true;
  });

  // Calculate SEO Health for a post
  const getSeoHealth = (post: BlogPost) => {
    const effectiveTitle = post.metaTitle || post.title;
    const effectiveDesc = post.metaDescription || post.excerpt;
    let score = 0;

    if (effectiveTitle && effectiveTitle.length >= 30 && effectiveTitle.length <= 65) score += 25;
    else if (effectiveTitle) score += 15;

    if (effectiveDesc && effectiveDesc.length >= 100 && effectiveDesc.length <= 165) score += 25;
    else if (effectiveDesc) score += 15;

    if (post.slug && post.slug.length > 5) score += 20;
    if (post.coverImage || post.ogImage) score += 15;
    if (post.keywords && post.keywords.length > 3) score += 15;

    return Math.min(100, score);
  };

  // Real-time meta length checks for active form
  const metaTitleLength = metaTitle.length;
  const metaDescLength = metaDescription.length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC928]/20 text-[#856404] text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5 text-[#FFC928]" />
            <span>Search Engine Optimization & Articles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading tracking-tight">
            Blog & SEO Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Publish helpful van rental articles, road trip guides, and configure Google Search SERP snippets to attract Aussie travellers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsGlobalSeoModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-neutral-600" />
            <span>Global Blog SEO</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFC928] hover:bg-[#E5B21E] text-black text-xs font-black shadow-sm transition-luxury cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total Articles
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#111111] font-heading">{blogPosts.length}</span>
            <BookOpen className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Live on website</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Active Categories
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#111111] font-heading">{allCategories.length}</span>
            <Layers className="w-4 h-4 text-[#FFC928]" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Topic taxonomy</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Indexed URL Slugs
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-600 font-heading">
              {blogPosts.filter((p) => p.slug).length}
            </span>
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Clean canonical URLs</span>
        </div>

        <div className="bg-[#111111] p-5 rounded-xl border border-neutral-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928] block mb-1">
            Average SEO Score
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-heading">
              {blogPosts.length > 0
                ? Math.round(
                    blogPosts.reduce((acc, p) => acc + getSeoHealth(p), 0) / blogPosts.length
                  )
                : 100}
              %
            </span>
            <Sparkles className="w-4 h-4 text-[#FFC928]" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">SERP readiness rating</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search articles by title, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategoryFilter === 'All'
                ? 'bg-[#111111] text-[#FFC928]'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All ({blogPosts.length})
          </button>
          {allCategories.map((cat) => {
            const count = blogPosts.filter((p) => p.category === cat).length;
            if (count === 0 && selectedCategoryFilter !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#111111] text-[#FFC928]'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles List / Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
          <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">No blog posts found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No articles match the search query "${searchQuery}".`
              : 'Start building organic search traffic by writing your first article.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFC928] text-black text-xs font-bold hover:bg-[#E5B21E] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Article</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const seoScore = getSeoHealth(post);
            const seoStatusColor =
              seoScore >= 80
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : seoScore >= 60
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-red-100 text-red-800 border-red-200';

            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs hover:border-neutral-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Article Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 relative group">
                    <img
                      src={post.coverImage || VAN_IMAGES.fleetShowcase}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/75 text-white">
                      {post.readTime || '3 min'}
                    </span>
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {post.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${seoStatusColor}`}>
                        <Sparkles className="w-3 h-3" />
                        <span>SEO: {seoScore}%</span>
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {post.publishedDate}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-[#111111] font-heading tracking-tight truncate hover:text-[#B28200] transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {post.excerpt || post.content.slice(0, 120)}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-0.5">
                      <span className="flex items-center gap-1 font-mono text-neutral-500">
                        <Globe className="w-3 h-3 text-[#FFC928]" />
                        /blog/{post.slug}
                      </span>
                      <span>•</span>
                      <span>By {post.author}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
                  <button
                    onClick={() => {
                      setSelectedBlogPost(post);
                      setCurrentView('blog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                    title="View live article on public website"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black text-xs font-bold transition-luxury cursor-pointer"
                    title="Edit article and SEO settings"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit & SEO</span>
                  </button>

                  <button
                    onClick={() => setPostToDelete(post)}
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT BLOG POST & SEO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header with Tabs */}
            <div className="p-5 sm:p-6 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFC928] block">
                  {editingPost ? 'Edit Article & SEO' : 'Create New Article'}
                </span>
                <h2 className="text-xl font-black font-heading tracking-tight text-white">
                  {editingPost ? editingPost.title : 'Publish Guide or Article'}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTab('content')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeModalTab === 'content'
                    ? 'border-[#FFC928] text-black bg-white'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                <FileText className="w-4 h-4 text-[#FFC928]" />
                <span>1. Article Content & Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('seo')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeModalTab === 'seo'
                    ? 'border-[#FFC928] text-black bg-white'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span>2. SEO & Google SERP Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('preview')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeModalTab === 'preview'
                    ? 'border-[#FFC928] text-black bg-white'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                <Eye className="w-4 h-4 text-purple-500" />
                <span>3. Live SERP & Snippet Preview</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* TAB 1: CONTENT & DETAILS */}
              {activeModalTab === 'content' && (
                <div className="space-y-5">
                  {/* Article Title */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Can You Drive a 12-Seater Van on a Normal Car Licence in Australia?"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-semibold focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* Slug and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        URL Slug (/blog/[slug]) *
                      </label>
                      <div className="flex items-center">
                        <span className="h-10 px-3 flex items-center bg-neutral-100 border border-r-0 border-neutral-300 rounded-l-lg text-neutral-500 font-mono text-[11px]">
                          /blog/
                        </span>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(generateSlug(e.target.value))}
                          className="flex-1 h-10 px-3 rounded-r-lg bg-neutral-50 border border-neutral-300 text-xs font-mono font-medium focus:outline-none focus:border-black focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Category *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="flex-1 h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                        >
                          {allCategories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value="Custom">+ Add Custom Category...</option>
                        </select>
                        {category === 'Custom' && (
                          <input
                            type="text"
                            placeholder="Type new category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="flex-1 h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Short Excerpt / Summary *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Concise 1-2 sentence hook displayed on blog archive cards and default search snippets..."
                      value={excerpt}
                      onChange={(e) => handleExcerptChange(e.target.value)}
                      className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* Manual Cover Image Upload */}
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-neutral-800">
                          Main Article Cover Image (Manual Upload) *
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Upload high-resolution photo from your device (automatically optimized for fast load speed).
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                      >
                        {showUrlInput ? 'Hide URL input' : 'Or paste URL / presets'}
                      </button>
                    </div>

                    {/* Drag and Drop / Click Upload Box */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCoverUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-6 text-center cursor-pointer bg-white transition-all hover:bg-neutral-50/50 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-neutral-100 group-hover:bg-[#FFC928]/20 flex items-center justify-center mx-auto mb-2 transition-colors">
                        <Upload className="w-5 h-5 text-neutral-600 group-hover:text-black transition-colors" />
                      </div>
                      <span className="block text-xs font-bold text-neutral-800 mb-0.5">
                        {isUploadingCover ? 'Optimizing and loading photo...' : 'Click to Browse or Drag & Drop Cover Photo'}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Supports PNG, JPG, WebP up to 15MB • Auto-resized to crisp 16:9 banner
                      </span>
                    </div>

                    {/* URL Input Fallback */}
                    {showUrlInput && (
                      <div className="pt-2 space-y-2 border-t border-neutral-200">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium"
                        />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-neutral-500 font-bold">Showcase Presets:</span>
                          <button
                            type="button"
                            onClick={() => setCoverImage(VAN_IMAGES.hiace12)}
                            className="px-2 py-0.5 bg-neutral-200 hover:bg-neutral-300 rounded text-[10px] font-semibold"
                          >
                            HiAce 12-Seater
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverImage(VAN_IMAGES.carnival)}
                            className="px-2 py-0.5 bg-neutral-200 hover:bg-neutral-300 rounded text-[10px] font-semibold"
                          >
                            Kia Carnival
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverImage(VAN_IMAGES.fleetShowcase)}
                            className="px-2 py-0.5 bg-neutral-200 hover:bg-neutral-300 rounded text-[10px] font-semibold"
                          >
                            Fleet Lineup
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Preview Box */}
                    {coverImage && (
                      <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-neutral-200">
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="w-28 h-18 object-cover rounded-md border border-neutral-200 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-neutral-800 block">Selected Cover Photo</span>
                          <span className="text-[10px] text-neutral-400 block truncate">
                            {coverImage.startsWith('data:') ? 'Custom uploaded image (Ready)' : coverImage}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCoverImage('')}
                          className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-800">
                        Full Article Content (Markdown format supported) *
                      </label>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {content.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>

                    {/* Markdown helper toolbar */}
                    <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-t-lg border border-b-0 border-neutral-300 text-[11px] font-bold text-neutral-700">
                      <button
                        type="button"
                        onClick={() => setContent((c) => c + '\n\n### Heading 3')}
                        className="px-2 py-1 rounded hover:bg-white cursor-pointer"
                      >
                        Heading
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent((c) => c + ' **bold text**')}
                        className="px-2 py-1 rounded hover:bg-white cursor-pointer font-bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent((c) => c + '\n- Bullet point\n- Second point')}
                        className="px-2 py-1 rounded hover:bg-white cursor-pointer"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent((c) => c + '\n> "Helpful quote or driver tip."')}
                        className="px-2 py-1 rounded hover:bg-white cursor-pointer italic"
                      >
                        Quote
                      </button>
                    </div>

                    <textarea
                      rows={8}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-3.5 rounded-b-lg bg-neutral-50 border border-neutral-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* Author and Linked Fleet Car */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">Author Role</label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Link Vehicle Showcase
                      </label>
                      <select
                        value={featuredCarId}
                        onChange={(e) => setFeaturedCarId(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                      >
                        <option value="">None (General Guide)</option>
                        {cars.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.make} {c.model} ({c.seats} seats)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO & GOOGLE SERP SETTINGS */}
              {activeModalTab === 'seo' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-900">
                        Search Engine Optimization (SEO) Rules
                      </h4>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        Optimize how Google and search crawlers index this article. Meta titles should be 50–60 characters. Meta descriptions should be 140–160 characters.
                      </p>
                    </div>
                  </div>

                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-800">
                        SEO Meta Title (Title Tag in Search Results) *
                      </label>
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          metaTitleLength > 60
                            ? 'text-red-600'
                            : metaTitleLength >= 45
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {metaTitleLength} / 60 characters
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Can You Drive a 12-Seater Van on a Normal Licence? | TAS Car Rental"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                    />
                    <div className="w-full bg-neutral-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          metaTitleLength > 60
                            ? 'bg-red-500 w-full'
                            : metaTitleLength >= 45
                            ? 'bg-emerald-500 w-3/4'
                            : 'bg-amber-500 w-1/2'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-800">
                        SEO Meta Description *
                      </label>
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          metaDescLength > 160
                            ? 'text-red-600'
                            : metaDescLength >= 120
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {metaDescLength} / 160 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="e.g. Find out whether you can legally drive a 12-seater passenger van on a normal Australian Class C car licence. Clear guidelines, laws, and vehicle tips."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                    />
                    <div className="w-full bg-neutral-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          metaDescLength > 160
                            ? 'bg-red-500 w-full'
                            : metaDescLength >= 120
                            ? 'bg-emerald-500 w-4/5'
                            : 'bg-amber-500 w-2/5'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Keywords and Canonical */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Focus Keywords & Search Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="12 seater licence rules, minibus rental NSW, HiAce hire Sydney"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Canonical URL (Optional override)
                      </label>
                      <input
                        type="url"
                        placeholder="https://tascarrental.com.au/blog/your-slug"
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium font-mono"
                      />
                    </div>
                  </div>

                  {/* Social Share / OG Image Upload */}
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-neutral-800">
                          Social Media Share Card Image (OpenGraph / Twitter)
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Displayed when someone shares this article on Facebook, WhatsApp, LinkedIn, or Twitter.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOgImage(coverImage)}
                        className="text-[11px] text-[#856404] hover:underline font-bold"
                      >
                        Use article cover photo
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={ogFileInputRef}
                      onChange={handleOgUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => ogFileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingOg ? 'Processing...' : 'Upload Custom OG Image'}</span>
                      </button>

                      <input
                        type="url"
                        placeholder="Or enter OG image URL"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium"
                      />
                    </div>

                    {ogImage && (
                      <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-neutral-200">
                        <img
                          src={ogImage}
                          alt="OG Preview"
                          className="w-20 h-12 object-cover rounded border border-neutral-200"
                        />
                        <span className="text-[11px] text-neutral-600 truncate flex-1">
                          {ogImage.startsWith('data:') ? 'Custom uploaded OG card' : ogImage}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOgImage('')}
                          className="p-1 hover:text-red-600 text-neutral-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE PREVIEW & AUDIT */}
              {activeModalTab === 'preview' && (
                <div className="space-y-6">
                  {/* Google Search Mockup */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Google Search Result Snippet (Desktop & Mobile Simulation)</span>
                    </h4>

                    <div className="bg-white p-5 rounded-xl border border-neutral-300 shadow-sm space-y-1.5 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#FFC928] text-black font-black text-[10px] flex items-center justify-center">
                          T
                        </div>
                        <div className="text-[11px] text-[#202124] leading-tight">
                          <span className="font-semibold">{settings.websiteName || 'TAS Car Rental'}</span>
                          <span className="text-neutral-500 ml-1">
                            https://tascarrental.com.au › blog › {slug || 'article-slug'}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-tight">
                        {metaTitle || title || 'Article Title Placeholder'}
                      </h3>

                      <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                        {metaDescription || excerpt || content.slice(0, 150) || 'Article meta description preview will appear here on Google Search results.'}
                      </p>
                    </div>
                  </div>

                  {/* Social Share Mockup */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 mb-2 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-emerald-500" />
                      <span>Social Media Card Preview (WhatsApp, Facebook, Twitter)</span>
                    </h4>

                    <div className="bg-neutral-100 rounded-xl overflow-hidden border border-neutral-300 max-w-md">
                      <div className="aspect-[1.91/1] bg-neutral-200">
                        <img
                          src={ogImage || coverImage || VAN_IMAGES.fleetShowcase}
                          alt="Social card"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-white">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                          tascarrental.com.au
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug truncate mt-0.5">
                          {metaTitle || title || 'Article Title'}
                        </h4>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                          {metaDescription || excerpt || 'Article description for social previews.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SEO Health Checklist */}
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-neutral-800">SEO Quality Checklist</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        {metaTitle.length >= 35 && metaTitle.length <= 65 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>
                          Meta Title Length: {metaTitle.length} chars (Recommended: 45–60)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {metaDescription.length >= 100 && metaDescription.length <= 165 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>
                          Meta Description Length: {metaDescription.length} chars (Recommended: 120–160)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {coverImage ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>Cover / Social Sharing Image Attached</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {slug ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>Clean URL Slug Configured (/blog/{slug})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {activeModalTab !== 'preview' ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab(activeModalTab === 'content' ? 'seo' : 'preview')
                      }
                      className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next: {activeModalTab === 'content' ? 'SEO Settings' : 'SERP Preview'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black text-xs font-black shadow-sm transition-luxury cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingPost ? 'Update Article & SEO' : 'Publish Article'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL BLOG SEO SETTINGS MODAL */}
      {isGlobalSeoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFC928]/20 flex items-center justify-center text-black font-bold">
                  <Globe className="w-5 h-5 text-[#856404]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 font-heading">
                    Global Blog Section SEO Settings
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Controls default metadata when visitors open the /blog hub
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGlobalSeoModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGlobalSeo} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Blog Archive Page Title
                </label>
                <input
                  type="text"
                  required
                  value={globalBlogTitle}
                  onChange={(e) => setGlobalBlogTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Blog Archive Meta Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={globalBlogDesc}
                  onChange={(e) => setGlobalBlogDesc(e.target.value)}
                  className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Global Search Keywords
                </label>
                <input
                  type="text"
                  value={globalBlogKeywords}
                  onChange={(e) => setGlobalBlogKeywords(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGlobalSeoModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 font-bold hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#FFC928] text-black font-black hover:bg-[#E5B21E] shadow-sm cursor-pointer"
                >
                  Save Global SEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 font-heading">
              Delete this article?
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Are you sure you want to remove <span className="font-bold text-black">"{postToDelete.title}"</span>? This will permanently remove the article from the website and search indexes.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
