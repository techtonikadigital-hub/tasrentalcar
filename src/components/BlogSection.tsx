import React from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, setCurrentView, setSelectedBlogPost } = useApp();

  const handleReadArticle = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const previewPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1   text-xs font-bold text-neutral-800 mb-2">
              {/* <BookOpen className="w-3.5 h-3.5 text-[#FFC928]" /> */}
              <span className="uppercase tracking-wider">Automotive Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading">
              Stories from the Driver’s Seat
            </h2>
            <p className="text-sm text-[#666666] mt-1 max-w-xl">
              Van hire guides, 7 & 12 seater passenger comparisons, and Australian road trip tips from our TAS Car Rental team.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedBlogPost(null);
              setCurrentView('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-[#997300] transition-colors cursor-pointer group shrink-0"
          >
            <span>View All Journal Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleReadArticle(post)}
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
    </section>
  );
};
