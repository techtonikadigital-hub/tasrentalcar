import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { Calendar, Clock, ArrowRight, ArrowLeft, BookOpen, Share2, Car as CarIcon, Sparkles } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const {
    blogPosts,
    selectedBlogPost,
    setSelectedBlogPost,
    setCurrentView,
    getCarById,
    openBookingForCar,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    ...Array.from(new Set(blogPosts.map((p) => p.category))).filter(Boolean),
  ];

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === selectedCategory);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard.', 'success');
    }
  };

  // If viewing a single post
  if (selectedBlogPost) {
    const featuredCar = selectedBlogPost.featuredCarId ? getCarById(selectedBlogPost.featuredCarId) : null;

    return (
      <div className="bg-white min-h-screen py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedBlogPost(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black mb-8 cursor-pointer transition-colors bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <div className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#111111] text-[#FFC928]">
              {selectedBlogPost.category}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading leading-tight">
              {selectedBlogPost.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-y border-neutral-100 py-3 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <img
                  src={selectedBlogPost.authorAvatar}
                  alt={selectedBlogPost.author}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-[#111111]">{selectedBlogPost.author}</div>
                  <div className="text-[11px] text-neutral-400">{selectedBlogPost.authorRole}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC928]" />
                  {selectedBlogPost.publishedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FFC928]" />
                  {selectedBlogPost.readTime}
                </span>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-black cursor-pointer"
                  title="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Cover Image */}
          <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-10 shadow-lg border border-neutral-200">
            <img
              src={selectedBlogPost.coverImage}
              alt={selectedBlogPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-neutral max-w-none text-neutral-800 text-sm sm:text-base leading-relaxed space-y-5">
            <div className="p-4 rounded-xl bg-[#F5F5F5] border-l-4 border-[#FFC928] italic text-neutral-700 text-sm font-medium">
              {selectedBlogPost.excerpt}
            </div>

            <div className="whitespace-pre-line leading-relaxed text-neutral-800">
              {selectedBlogPost.content}
            </div>
          </div>

          {/* Featured Car Callout */}
          {featuredCar && (
            <div className="mt-12 p-6 rounded-2xl bg-[#111111] text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={featuredCar.mainImage}
                  alt={featuredCar.model}
                  className="w-24 h-16 object-cover rounded-lg border border-neutral-700 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC928] block">
                    Featured Vehicle in This Guide
                  </span>
                  <h4 className="text-lg font-bold text-white font-heading">
                    {featuredCar.make} {featuredCar.model}
                  </h4>
                  <p className="text-xs text-neutral-400">Available for collection at our Revesby depot</p>
                </div>
              </div>

              <button
                onClick={() => openBookingForCar(featuredCar)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs transition-luxury cursor-pointer shadow-sm shrink-0"
              >
                <span>Reserve This Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="mt-12 pt-8 border-t border-neutral-200 flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedBlogPost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('cars');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-black cursor-pointer"
            >
              <span>Explore Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blog Index View
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm">
            TAS Car Rental Journal & Guides
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight mt-3 font-heading">
            Van Hire Insights & Routes
          </h1>
          <p className="text-sm text-[#666666] mt-2">
            Curated Australian road trip guides, passenger van comparisons, and rental advice from our TAS Car Rental team.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-[#FFC928]'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => {
                setSelectedBlogPost(post);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#111111]/90 text-[#FFC928] backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] group-hover:text-black transition-colors font-heading leading-snug line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-neutral-800">{post.author}</span>
                  </div>

                  <span className="text-xs font-bold text-[#111111] group-hover:text-[#997300] flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
