import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBlog } from '../context/BlogContext';
import { format, parseISO } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

const { FiEdit, FiCalendar, FiUser, FiExternalLink, FiSearch, FiX, FiFilter, FiTag, FiPlus } = FiIcons;

const BlogList = ({ isAdmin }) => {
  const { getPublishedPosts, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const posts = getPublishedPosts();

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Sort posts
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt) - new Date(b.publishedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });
  }, [posts, searchTerm, selectedTag, sortBy]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedTag || sortBy !== 'newest';

  return (
    <>
      <Helmet>
        <title>Blog - Global Public Holidays</title>
        <meta name="description" content="Read our latest articles about public holidays, cultural celebrations, and traditions from around the world." />
        <meta name="keywords" content="holiday blog, cultural celebrations, traditions, public holidays, international holidays" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Global Public Holidays Blog",
            "description": "Articles about public holidays, cultural celebrations, and traditions from around the world",
            "url": `${window.location.origin}/blog`,
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "datePublished": post.publishedAt,
              "dateModified": post.updatedAt,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "url": `${window.location.origin}/blog/${post.slug}`
            }))
          })}
        </script>
      </Helmet>

      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Blog</h1>
          {isAdmin && (
            <Link
              to="/blog/new"
              className="flex items-center space-x-2 px-4 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors w-fit"
            >
              <SafeIcon icon={FiPlus} />
              <span>New Post</span>
            </Link>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent w-full"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                )}
              </div>
            </div>

            {/* Tag Filter */}
            <div className="lg:w-48">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                <SafeIcon icon={FiX} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-sa-blue/10 text-sa-blue rounded-full text-sm flex items-center space-x-1">
                  <SafeIcon icon={FiSearch} />
                  <span>Search: "{searchTerm}"</span>
                </span>
              )}
              {selectedTag && (
                <span className="px-3 py-1 bg-sa-green/10 text-sa-green rounded-full text-sm flex items-center space-x-1">
                  <SafeIcon icon={FiTag} />
                  <span>Tag: {selectedTag}</span>
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="px-3 py-1 bg-sa-yellow/10 text-sa-yellow rounded-full text-sm flex items-center space-x-1">
                  <SafeIcon icon={FiFilter} />
                  <span>Sort: {sortBy === 'oldest' ? 'Oldest First' : 'Title A-Z'}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-gray-600">
          Showing {filteredAndSortedPosts.length} of {posts.length} posts
          {hasActiveFilters && (
            <span className="ml-2 text-sa-blue">
              (filtered)
            </span>
          )}
        </div>

        {/* Posts */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {posts.length === 0 ? 'No blog posts yet' : 'No posts match your filters'}
            </h2>
            <p className="text-gray-500 mb-4">
              {posts.length === 0 
                ? 'Check back soon for articles about global holidays and traditions.' 
                : 'Try adjusting your search terms or filters.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredAndSortedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} />
                        <span>{format(parseISO(post.publishedAt), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUser} />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-sa-green transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="px-2 py-1 bg-sa-green/10 text-sa-green rounded-full text-xs hover:bg-sa-green/20 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-center space-x-1 text-sa-green hover:text-sa-green/80 transition-colors font-medium"
                      >
                        <span>Read More</span>
                        <SafeIcon icon={FiExternalLink} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default BlogList;