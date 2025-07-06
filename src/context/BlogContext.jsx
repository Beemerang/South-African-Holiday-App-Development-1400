import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blog posts from localStorage
    const savedPosts = localStorage.getItem('global-holidays-blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with some sample posts
      const samplePosts = [
        {
          id: uuidv4(),
          title: 'Understanding Global Public Holidays',
          slug: 'understanding-global-public-holidays',
          content: `<p>Public holidays are more than just days off work - they're windows into the cultural soul of nations. Each country's public holidays tell a unique story of history, tradition, and values that have shaped their society.</p>

<p>From religious observances to national commemorations, public holidays serve multiple purposes: they provide time for reflection, celebration, and community bonding. They also offer insight into what a society holds most dear.</p>

<h2>Types of Public Holidays</h2>
<p>Public holidays generally fall into several categories:</p>
<ul>
<li><strong>Religious Holidays:</strong> Christmas, Eid, Diwali, etc.</li>
<li><strong>National Days:</strong> Independence days, foundation days</li>
<li><strong>Historical Commemorations:</strong> Days marking significant events</li>
<li><strong>Cultural Celebrations:</strong> Traditional festivals and customs</li>
<li><strong>International Days:</strong> Labor Day, Women's Day, etc.</li>
</ul>

<p>Understanding these holidays helps us appreciate the diversity of human experience and the common threads that bind us together as a global community.</p>`,
          excerpt: 'Public holidays are more than just days off work - they\'re windows into the cultural soul of nations.',
          author: 'Global Holidays Team',
          publishedAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString(),
          status: 'published',
          featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          metaTitle: 'Understanding Global Public Holidays - Cultural Insights',
          metaDescription: 'Explore the significance of public holidays around the world and how they reflect cultural values, history, and traditions.',
          tags: ['culture', 'holidays', 'traditions', 'global']
        },
        {
          id: uuidv4(),
          title: 'The Evolution of Public Holidays',
          slug: 'evolution-of-public-holidays',
          content: `<p>The concept of public holidays has evolved significantly throughout history. What began as religious observances and seasonal celebrations has transformed into a complex system of national, cultural, and international commemorations.</p>

<h2>Ancient Origins</h2>
<p>The earliest public holidays were tied to agricultural cycles and religious observances. Ancient civilizations marked important dates with festivals that brought communities together for worship, celebration, and renewal.</p>

<h2>Modern Development</h2>
<p>The industrial revolution and the formation of modern nation-states brought new types of holidays:</p>
<ul>
<li>Labor movements established workers' rights days</li>
<li>Independence movements created national days</li>
<li>International organizations promoted global awareness days</li>
</ul>

<p>Today, public holidays serve as important markers in our collective calendar, providing rhythm to our years and opportunities for reflection on our shared values and history.</p>`,
          excerpt: 'The concept of public holidays has evolved significantly throughout history, from ancient religious observances to modern national commemorations.',
          author: 'Global Holidays Team',
          publishedAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          status: 'published',
          featuredImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop',
          metaTitle: 'The Evolution of Public Holidays Throughout History',
          metaDescription: 'Discover how public holidays have evolved from ancient religious observances to modern national and international commemorations.',
          tags: ['history', 'evolution', 'holidays', 'culture']
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('global-holidays-blog-posts', JSON.stringify(samplePosts));
    }
    setLoading(false);
  }, []);

  const savePost = (post) => {
    const updatedPosts = [...posts];
    const existingIndex = updatedPosts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      updatedPosts[existingIndex] = {
        ...post,
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedPosts.push({
        ...post,
        id: post.id || uuidv4(),
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    setPosts(updatedPosts);
    localStorage.setItem('global-holidays-blog-posts', JSON.stringify(updatedPosts));
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('global-holidays-blog-posts', JSON.stringify(updatedPosts));
  };

  const getPostBySlug = (slug) => {
    return posts.find(post => post.slug === slug);
  };

  const getPublishedPosts = () => {
    return posts.filter(post => post.status === 'published').sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );
  };

  const value = {
    posts,
    loading,
    savePost,
    deletePost,
    getPostBySlug,
    getPublishedPosts
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};