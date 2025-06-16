// src/components/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming Navbar is in components
import Footer from './Footer'; // Assuming Footer is in components
import { motion } from 'framer-motion';

// The base API endpoint for posts. We'll append the slug directly for single post fetching.
const WISP_BASE_API_ENDPOINT = 'https://www.wisp.blog/api/v1/ad98debc-5b29-4d92-86ab-0a765957ebe9/posts';

const BlogPost = () => {
    const { slug } = useParams(); // Get the slug from the URL parameter (e.g., /blog/my-first-post)
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSingleBlogPost = async () => {
            if (!slug) { // Ensure slug exists before fetching
                setError('No blog post slug provided in the URL.');
                setLoading(false);
                return;
            }
            try {
                // CORRECTED: Construct the API URL to fetch a single post by its slug directly in the path
                // Based on Wisp's "Get Specific Blog Post by Slug" endpoint: /posts/:slug
                const response = await fetch(`${WISP_BASE_API_ENDPOINT}/${slug}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'No error message available.' })); // Handle cases where errorData is not JSON
                    throw new Error(`Failed to fetch post: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown API error'}`);
                }

                const data = await response.json();
                
                // Wisp's API for a single post might return the object directly, or an array with one object.
                // Check if 'data.posts' exists and is an array, then take the first item.
                // Otherwise, assume 'data' itself is the post object.
                const fetchedPost = (data.posts && data.posts.length > 0) ? data.posts[0] : data;

                if (fetchedPost && fetchedPost.id) { // Basic check to ensure a valid post object was returned
                    setPost(fetchedPost);
                } else {
                    setError('Blog post data is empty or malformed.'); // Data was fetched, but not a valid post
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching single Wisp blog post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSingleBlogPost();
    }, [slug]); // Re-run effect whenever the slug parameter changes

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#070c24] to-[#142454] flex justify-center items-center">
                <motion.div
                    className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#070c24] to-[#142454] text-center text-red-500 text-xl py-16">
                Error: {error}
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#070c24] to-[#142454] text-center text-white text-xl py-16">
                Blog post not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#070c24] to-[#142454] flex flex-col">
            <Navbar />
            <motion.div 
                className="container mx-auto px-4 py-16 flex-grow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    {post.title}
                </h1>
                <p className="text-gray-400 mb-8">
                    Published on {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Date N/A'}
                </p>
                {/* Wisp's 'content' field likely contains HTML.
                    The 'prose' classes from Tailwind CSS Typography plugin help style raw HTML.
                    If you don't have this plugin installed, the styling might look basic.
                    Install: `npm install @tailwindcss/typography`
                    Add to `tailwind.config.js` plugins: `plugins: [require('@tailwindcss/typography')],`
                */}
                <div className="prose prose-invert max-w-none text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
            </motion.div>
            <Footer />
        </div>
    );
};

export default BlogPost;
