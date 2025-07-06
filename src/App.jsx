import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import GlobalHeader from './components/GlobalHeader';
import HomePage from './components/HomePage';
import CountriesPage from './components/CountriesPage';
import CountryPage from './components/CountryPage';
import SouthAfricaPage from './components/SouthAfricaPage';
import HolidayBlogPage from './components/HolidayBlogPage';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import BlogEditor from './components/BlogEditor';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import AdSenseAd from './components/AdSenseAd';
import FooterContent from './components/FooterContent';
import { GlobalHolidayProvider } from './context/GlobalHolidayContext';
import { HolidayProvider } from './context/HolidayContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { AdSenseProvider } from './context/AdSenseContext';
import { ContentProvider } from './context/ContentProvider';
import { BlogProvider } from './context/BlogContext';
import { MetaProvider } from './context/MetaProvider';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Update document title on app load
  useEffect(() => {
    document.title = 'Global Public Holidays - Your Complete Guide to Worldwide Celebrations';
  }, []);

  return (
    <HelmetProvider>
      <MetaProvider>
        <GlobalHolidayProvider>
          <HolidayProvider>
            <AnalyticsProvider>
              <AdSenseProvider>
                <ContentProvider>
                  <BlogProvider>
                    <Router>
                      <div className="min-h-screen bg-gradient-to-br from-sa-green/5 via-white to-sa-blue/5">
                        <GlobalHeader isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
                        
                        <main className="container mx-auto px-4 py-8">
                          <Routes>
                            <Route path="/" element={<HomePage isAdmin={isAdmin} />} />
                            <Route path="/countries" element={<CountriesPage isAdmin={isAdmin} />} />
                            <Route path="/south-africa" element={<SouthAfricaPage isAdmin={isAdmin} />} />
                            <Route path="/country/:countryCode" element={<CountryPage isAdmin={isAdmin} />} />
                            <Route path="/holiday/:holidayId" element={<HolidayBlogPage isAdmin={isAdmin} />} />
                            <Route path="/blog" element={<BlogList isAdmin={isAdmin} />} />
                            <Route path="/blog/new" element={isAdmin ? <BlogEditor /> : <BlogList isAdmin={isAdmin} />} />
                            <Route path="/blog/:slug" element={<BlogPost isAdmin={isAdmin} />} />
                            <Route path="/blog/:slug/edit" element={isAdmin ? <BlogEditor /> : <BlogList isAdmin={isAdmin} />} />
                            <Route path="/admin" element={isAdmin ? <AdminPanel /> : <AdminLogin onLogin={setIsAdmin} />} />
                          </Routes>
                        </main>

                        <footer className="bg-sa-green text-white py-8 mt-12">
                          <div className="container mx-auto px-4">
                            <FooterContent isAdmin={isAdmin} />
                            
                            <div className="text-center mb-6">
                              <AdSenseAd 
                                slot="1122334455" 
                                position="footer" 
                                isAdmin={isAdmin} 
                                className="bg-sa-green/20 rounded-lg p-4 text-center text-white/60 min-h-[100px] flex items-center justify-center mb-4"
                              />
                            </div>
                            
                            <div className="text-center">
                              <p>&copy; 2024 Global Public Holidays. All rights reserved.</p>
                              <p className="text-sm mt-2 opacity-80">
                                Data sourced from official government websites worldwide
                              </p>
                            </div>
                          </div>
                        </footer>
                      </div>
                    </Router>
                  </BlogProvider>
                </ContentProvider>
              </AdSenseProvider>
            </AnalyticsProvider>
          </HolidayProvider>
        </GlobalHolidayProvider>
      </MetaProvider>
    </HelmetProvider>
  );
}

export default App;