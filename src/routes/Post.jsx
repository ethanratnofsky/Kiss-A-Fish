import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabase.config";
import "./Post.css";

const Post = () => {
    const { id } = useParams();

    const [post, setPost] = useState();
    const [upvotes, setUpvotes] = useState(0);
    const [comments, setComments] = useState([]);

    const fetchPost = async () => {
        const { data, error } = await supabase
            .from("Posts")
            .select()
            .filter("id", "eq", id)
            .single();
        if (error) {
            alert("[Post] Error fetching post: " + error.message);
        } else {
            setPost(data);
        }
    };

    // Fetch post on initial load
    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
        if (post) setUpvotes(post.upvotes);
    }, [post]);

    const handleUpvote = async () => {
        setUpvotes((prev) => prev + 1);

        const { error } = await supabase
            .from("Posts")
            .update({ upvotes: upvotes + 1 })
            .eq("id", id);

        if (error) {
            setUpvotes((prev) => prev - 1);
            alert("[Post] Error upvoting post: " + error.message);
        }
    };

    return (
        <div className="post-container">
            <div className="header">
                <Link to=".." className="back-button">
                    ←
                </Link>
                <h3 className="thread">Thread</h3>
            </div>
            {post ? (
                <div className="post">
                    <h1 className="post-title">{post.title}</h1>
                    {post.image_url && (
                        <img className="post-image" src={post.image_url} alt={post.title} />
                    )}
                    <p className="post-content">{post.content}</p>
                    <div className="actions-container">
                        <p className="post-date">
                            {new Date(post.created_at).toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            })}
                        </p>
                        <div>
                            <p className="upvote-count">
                                <strong>{upvotes}</strong> upvotes
                            </p>
                            <button className="upvote-button" onClick={handleUpvote}>
                                Upvote
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="comments-header">
                        <h3 className="comments-title">Comments </h3>
                        <strong className="delimiter">•</strong>
                        <p className="comments-count">{comments.length}</p>
                    </div>
                    <div className="comments-container">
                        {comments.length > 0 ? (
                            <ul className="comments-list">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="comment">
                                        <p className="comment-content">{comment.content}</p>
                                        <p className="comment-date">
                                            {new Date(comment.created_at).toLocaleString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                            })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-comments">No comments yet</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="no-post-found-container">
                    <h1>404: Not Found</h1>
                    <p>No post found with ID {id}</p>
                </div>
            )}
        </div>
    );
};

export default Post;
