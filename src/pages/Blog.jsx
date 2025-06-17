// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

// The API endpoint for listing all published blog posts
const WISP_BLOG_LIST_API_ENDPOINT = 'https://www.wisp.blog/api/v1/cluqyx1rl0000l5ds3f0vkfer/posts';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(WISP_BLOG_LIST_API_ENDPOINT);

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // The API returns the posts array directly in the response
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070c24] to-[#142454] flex flex-col">
      <Navbar noBlur />
      
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
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.description || (post.content ? `${post.content.substring(0, 150)}...` : 'No description available.')}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {post.author && (
                        <span className="mr-4">{post.author.name}</span>
                      )}
                      {post.createdAt && (
                        <time dateTime={post.createdAt}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                      )}
                    </div>
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
          ) : !loading && (
            <div className="col-span-full text-center text-white text-xl">
              No blog posts found.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
