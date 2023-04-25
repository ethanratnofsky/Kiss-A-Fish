import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase.config";
import "./Feed.css";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [sortedPosts, setSortedPosts] = useState([]);

    const fetchPosts = async () => {
        const { data, error } = await supabase.from("Posts").select();
        if (error) {
            alert("[Feed] Error fetching posts: " + error.message);
        } else {
            setPosts(data);
        }
    };

    // Fetch posts on initial load
    useEffect(() => {
        fetchPosts();
    }, []);

    // Sort posts by newest first
    useEffect(() => {
        const sortedPosts = posts.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        setSortedPosts(sortedPosts);
    }, [posts]);

    return (
        <div className="feed-container">
            {sortedPosts.length > 0 ? (
                <ul className="posts-list">
                    {sortedPosts.map((post) => (
                        <Link to={"/" + post.id} key={post.id} className="post-list-item-container">
                            <li className="post-list-item">
                                <div className="post-preview">
                                    <h2 className="post-title">{post.title}</h2>
                                    <p className="upvote-count">
                                        <strong>{post.upvotes}</strong> upvotes
                                    </p>
                                </div>
                                <p className="post-date">
                                    {new Date(post.created_at).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </p>
                            </li>
                        </Link>
                    ))}
                </ul>
            ) : (
                <div className="no-posts-container">
                    <p>No posts yet - be the first to show off your fish kisses!</p>
                    <Link to="/create">
                        <button className="post-button">Create Post</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Feed;
