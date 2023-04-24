import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase.config";
import "./Feed.css";

const Feed = () => {
    const [posts, setPosts] = useState([]);

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

    return (
        <div className="feed-container">
            {posts.length > 0 ? (
                <div className="posts-container">
                    {posts.map((post) => (
                        <div className="post-container" key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                        </div>
                    ))}
                </div>
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
