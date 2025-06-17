// src/components/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const WISP_BASE_API_ENDPOINT = 'https://www.wisp.blog/api/v1/cluqyx1rl0000l5ds3f0vkfer/posts';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSingleBlogPost = async () => {
            if (!slug) {
                setError('No blog post slug provided in the URL.');
                setLoading(false);
                return;
            }
            try {
                // Using the correct endpoint format for single post
                const response = await fetch(`${WISP_BASE_API_ENDPOINT}/${slug}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                // The API returns the post inside a 'post' property
                if (data.post) {
                    setPost(data.post);
                } else {
                    throw new Error('Blog post not found');
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching blog post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSingleBlogPost();
    }, [slug]);    return (
        <div className="min-h-screen bg-gradient-to-b from-[#132407] to-[#142454] flex flex-col">
      <Navbar noBlur={true} />
            
            <div className="container mx-auto px-4 py-16 flex-grow">
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
                    <div className="text-center">
                        <div className="text-red-500 mb-4">{error}</div>
                        <Link to="/blog" className="text-pink-500 hover:text-pink-400">
                            ← Back to Blog List
                        </Link>
                    </div>
                )}

                {post && (
                    <motion.article
                        className="bg-white rounded-lg p-8 shadow-xl max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            {post.title}
                        </h1>
                        
                        <div className="flex items-center mb-6 text-gray-600">
                            {post.author && (
                                <div className="flex items-center mr-6">
                                    {post.author.image && (
                                        <img
                                            src={post.author.image}
                                            alt={post.author.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                    )}
                                    <span>{post.author.name}</span>
                                </div>
                            )}
                            {post.createdAt && (
                                <time dateTime={post.createdAt}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </time>
                            )}
                        </div>

                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-auto rounded-lg mb-6"
                            />
                        )}

                        <div 
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag.id}
                                            className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <Link
                                to="/blog"
                                className="text-pink-500 hover:text-pink-600 transition flex items-center"
                            >
                                ← Back to Blog List
                            </Link>
                        </div>
                    </motion.article>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BlogPost;
