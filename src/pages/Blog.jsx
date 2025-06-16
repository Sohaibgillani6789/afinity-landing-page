// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

// The API endpoint for listing all published blog posts from your Wisp dashboard
const WISP_BLOG_LIST_API_ENDPOINT = 'https://www.wisp.blog/api/v1/ad98debc-5b29-4d92-86ab-0a765957ebe9/posts';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Corrected API call: No Authorization header needed as the endpoint itself is the identifier
        const response = await fetch(WISP_BLOG_LIST_API_ENDPOINT);

        if (!response.ok) {
          // Attempt to get a more specific error message from the response body
          const errorData = await response.json();
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        // Assuming Wisp's API returns posts in a 'posts' array directly within the response data
        // Example: { "posts": [ { ... }, { ... } ] }
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching Wisp blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070c24] to-[#142454] flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-grow">
        <h1 className="text-4xl md:text-6xl text-white font-bold mb-12 text-center">
          Our Blog
        </h1>

        {loading && (
          <div className="flex justify-center">
            <motion.div
              className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {/* Display excerpt, or a substring of content if excerpt is not available */}
                    {post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'No excerpt available.')}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {/* Format date, assuming 'publishedAt' is a valid date string */}
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Date N/A'}
                    </span>
                    {/* Use Link component for internal navigation */}
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (            !loading && !error && (
              <div className="col-span-full text-center text-white">
                <p className="text-xl mb-4">No blog posts found.</p>
                <p className="text-lg">
                  To see blog posts here, you need to:
                  <ol className="list-decimal mt-4 max-w-md mx-auto text-left space-y-2">
                    <li>Go to your Wisp dashboard</li>
                    <li>Create and write your blog posts</li>
                    <li>Publish them to make them visible on your site</li>
                  </ol>
                </p>
              </div>
            )
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
