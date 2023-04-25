import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase.config";
import "./Feed.css";

const FILTERS = {
    DATE_ASC: "DATE_ASC",
    DATE_DESC: "DATE_DESC",
    UPVOTES_ASC: "UPVOTES_ASC",
    UPVOTES_DESC: "UPVOTES_DESC",
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState(FILTERS.DATE_DESC);

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

    // Fitler posts by search term and sort by filter
    useEffect(() => {
        let filteredPosts = [...posts];

        // Filter by search term
        if (searchTerm) {
            filteredPosts = filteredPosts.filter((post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by filter
        switch (filter) {
            case FILTERS.DATE_ASC:
                filteredPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case FILTERS.DATE_DESC:
                filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case FILTERS.UPVOTES_ASC:
                filteredPosts.sort((a, b) => a.upvotes - b.upvotes);
                break;
            case FILTERS.UPVOTES_DESC:
                filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
                break;
            default:
                break;
        }

        setFilteredPosts(filteredPosts);
    }, [posts, searchTerm, filter]);

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleDateSort = () => {
        if (filter === FILTERS.DATE_DESC) setFilter(FILTERS.DATE_ASC);
        else setFilter(FILTERS.DATE_DESC); // default sort
    };

    const handleToggleUpvotesSort = () => {
        if (filter === FILTERS.UPVOTES_DESC) setFilter(FILTERS.UPVOTES_ASC);
        else setFilter(FILTERS.UPVOTES_DESC); // default sort
    };

    return (
        <div className="feed-container">
            <div className="filters-container">
                <input
                    className="search-bar"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Search Kiss-A-Fish..."
                />
                <button onClick={handleToggleDateSort}>
                    {filter === FILTERS.DATE_ASC ? "↑ " : filter === FILTERS.DATE_DESC ? "↓ " : ""}
                    Date Posted
                </button>
                <button onClick={handleToggleUpvotesSort}>
                    {filter === FILTERS.UPVOTES_ASC
                        ? "↑ "
                        : filter === FILTERS.UPVOTES_DESC
                        ? "↓ "
                        : ""}
                    Upvotes
                </button>
            </div>
            {filteredPosts.length > 0 ? (
                <ul className="posts-list">
                    {filteredPosts.map((post) => (
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
