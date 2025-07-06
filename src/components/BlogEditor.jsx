import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBlog } from '../context/BlogContext';
import { v4 as uuidv4 } from 'uuid';

const { FiSave, FiX, FiEye, FiImage, FiTag } = FiIcons;

const BlogEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getPostBySlug, savePost } = useBlog();
  const isEdit = slug && slug !== 'new';
  const existingPost = isEdit ? getPostBySlug(slug) : null;

  const [post, setPost] = useState({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'Global Holidays Team',
    status: 'draft',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (existingPost) {
      setPost(existingPost);
    } else {
      setPost(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [existingPost]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title ? `${title} - Global Public Holidays` : ''
    }));
  };

  const handleContentChange = (content) => {
    // Generate excerpt from content (first 160 characters of plain text)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    
    setPost(prev => ({
      ...prev,
      content,
      excerpt,
      metaDescription: excerpt
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = (status = 'draft') => {
    if (!post.title.trim()) {
      alert('Please enter a title for your post.');
      return;
    }

    const postToSave = {
      ...post,
      status,
      updatedAt: new Date().toISOString()
    };

    savePost(postToSave);
    navigate('/blog');
  };

  const handlePreview = () => {
    // Save as draft first
    handleSave('draft');
    // Open preview in new tab
    window.open(`/blog/${post.slug}`, '_blank');
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Post' : 'New Blog Post'}
        </h1>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiEye} />
            <span>Preview</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleSave('draft')}
            className="flex items-center space-x-2 px-4 py-2 bg-sa-blue text-white rounded-lg hover:bg-sa-blue/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiSave} />
            <span>Save Draft</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleSave('published')}
            className="flex items-center space-x-2 px-4 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiSave} />
            <span>Publish</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/blog')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiX} />
            <span>Cancel</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
              placeholder="Enter post title..."
            />
            {post.slug && (
              <p className="text-sm text-gray-500 mt-2">
                Slug: {post.slug}
              </p>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                value={post.content}
                onChange={handleContentChange}
                modules={modules}
                theme="snow"
                style={{ minHeight: '300px' }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiImage} className="inline mr-2" />
              Featured Image
            </label>
            <input
              type="url"
              value={post.featuredImage}
              onChange={(e) => setPost(prev => ({ ...prev, featuredImage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
              placeholder="Image URL..."
            />
            {post.featuredImage && (
              <div className="mt-3">
                <img
                  src={post.featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiTag} className="inline mr-2" />
              Tags
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                placeholder="Add tag..."
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-sa-green text-white rounded-lg hover:bg-sa-green/90 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-sa-green/10 text-sa-green rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-sa-green hover:text-sa-green/80"
                  >
                    <SafeIcon icon={FiX} size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Meta Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={post.metaTitle}
                  onChange={(e) => setPost(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
                  placeholder="SEO title..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {post.metaTitle.length}/60 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={post.metaDescription}
                  onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent h-20 resize-vertical"
                  placeholder="SEO description..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {post.metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={post.author}
              onChange={(e) => setPost(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sa-green focus:border-transparent"
              placeholder="Author name..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogEditor;