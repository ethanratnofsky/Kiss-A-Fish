import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase.config";
import "./Post.css";

const Post = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState();
    const [upvotes, setUpvotes] = useState(0);
    const [comments, setComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newComment, setNewComment] = useState("");

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

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("Comments")
            .select()
            .filter("post_id", "eq", id);
        if (error) {
            alert("[Post] Error fetching comments: " + error.message);
        } else {
            setComments(data);
        }
    };

    // Fetch post on initial load
    useEffect(() => {
        fetchPost();
        fetchComments();
    }, []);

    useEffect(() => {
        if (post) setUpvotes(post.upvotes);
    }, [post]);

    // Reset edit form when toggling edit mode
    useEffect(() => {
        if (!isEditing && post) {
            setNewTitle(post.title);
            setNewContent(post.content);
            setNewImageUrl(post.image_url);
        }
    }, [isEditing, post]);

    const handleNewTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const handleNewContentChange = (e) => {
        setNewContent(e.target.value);
    };

    const handleNewImageUrlChange = (e) => {
        setNewImageUrl(e.target.value);
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    const handleEdit = async () => {
        const { error } = await supabase
            .from("Posts")
            .update({ title: newTitle, content: newContent, image_url: newImageUrl })
            .eq("id", id);

        if (error) {
            alert("[Post] Error editing post: " + error.message);
        } else {
            toggleEditMode();
            setPost((prev) => ({
                ...prev,
                title: newTitle,
                content: newContent,
                image_url: newImageUrl,
            }));
        }
    };

    const handleDelete = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this post?");
        if (confirmation) {
            const { error } = await supabase.from("Posts").delete().eq("id", id);
            if (error) {
                alert("[Post] Error deleting post: " + error.message);
            } else {
                navigate("/");
            }
        }
    };

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

    const handleComment = async () => {
        const { data, error } = await supabase
            .from("Comments")
            .insert({ post_id: id, content: newComment })
            .select();

        if (error) {
            alert("[Post] Error commenting on post: " + error.message);
        } else {
            setComments((prev) => [...prev, data[0]]);
            setNewComment("");
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
                    <div className="post-header">
                        <h1 className="post-title">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={handleNewTitleChange}
                                    placeholder="Title"
                                />
                            ) : (
                                post.title
                            )}
                        </h1>
                        <span>
                            {isEditing ? (
                                <>
                                    <button onClick={handleEdit} className="save-button">
                                        Save
                                    </button>
                                    <button onClick={toggleEditMode} className="cancel-button">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={toggleEditMode} className="edit-button">
                                        Edit
                                    </button>
                                    <button onClick={handleDelete} className="delete-button">
                                        Delete
                                    </button>
                                </>
                            )}
                        </span>
                    </div>
                    {post.image_url && (
                        <img
                            className="post-image"
                            src={isEditing ? newImageUrl : post.image_url}
                            alt={post.title}
                        />
                    )}
                    {isEditing && (
                        <label className="image-url">
                            <strong>Image URL:</strong>
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={handleNewImageUrlChange}
                                className="image-url"
                            />
                        </label>
                    )}
                    <p className="post-content">
                        {isEditing ? (
                            <textarea
                                value={newContent}
                                onChange={handleNewContentChange}
                                placeholder="Add a description to your post!"
                            />
                        ) : (
                            post.content
                        )}
                    </p>
                    <div className="footer">
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
                    <div className="new-comment-container">
                        <textarea
                            className="new-comment"
                            value={newComment}
                            onChange={handleNewCommentChange}
                            placeholder="Add a comment..."
                        />
                        <div className="comment-button-container">
                            <button onClick={handleComment} className="comment-button">
                                💬 Comment
                            </button>
                        </div>
                    </div>
                    <div className="comments-container">
                        {comments.length > 0 ? (
                            <ul className="comments-list">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="comment">
                                        <p className="comment-date">
                                            {new Date(comment.created_at).toLocaleString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                            })}
                                        </p>
                                        <p className="comment-content">{comment.content}</p>
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
