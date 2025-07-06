import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBlog } from '../context/BlogContext';
import { useMeta } from '../context/MetaContext';
import { format, parseISO } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import MetaEditor from './MetaEditor';
import SocialShare from './SocialShare';
import AdSenseAd from './AdSenseAd';

const { FiArrowLeft, FiCalendar, FiUser, FiEdit } = FiIcons;

const BlogPost = ({ isAdmin }) => {
  const { slug } = useParams();
  const { getPostBySlug, loading } = useBlog();
  const { getPageMeta, generateBlogPostMeta } = useMeta();
  
  const post = getPostBySlug(slug);
  const currentPath = `/blog/${slug}`;

  useEffect(() => {
    if (post) {
      const meta = generateBlogPostMeta(slug, post.title, post.excerpt);
      
      // Update document meta tags
      document.title = meta.title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = meta.description;
        document.head.appendChild(metaDescription);
      }
    }
  }, [post, slug, generateBlogPostMeta]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
        <Link
          to="/blog"
          className="px-6 py-3 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const pageMeta = getPageMeta(currentPath);

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:author" content={post.author} />
        <meta property="article:tag" content={post.tags.join(',')} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage,
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Global Public Holidays"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>

      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Meta Editor for Admin */}
        <MetaEditor path={currentPath} isAdmin={isAdmin} />

        {/* Header AdSense */}
        <AdSenseAd slot="1234567890" position="header" isAdmin={isAdmin} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="flex items-center space-x-2 text-sa-green hover:text-sa-green/80 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back to Blog</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <Link
                to={`/blog/${post.slug}/edit`}
                className="flex items-center space-x-2 px-4 py-2 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors"
              >
                <SafeIcon icon={FiEdit} />
                <span>Edit</span>
              </Link>
            )}
            <SocialShare
              url={window.location.href}
              title={post.title}
              description={post.excerpt}
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-3 bg-white rounded-lg shadow-md p-8">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} />
                  <span>{format(parseISO(post.publishedAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiUser} />
                  <span>{post.author}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sa-green/10 text-sa-green rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <AdSenseAd slot="0987654321" position="sidebar" isAdmin={isAdmin} />
          </aside>
        </div>
      </motion.div>
    </>
  );
};

export default BlogPost;