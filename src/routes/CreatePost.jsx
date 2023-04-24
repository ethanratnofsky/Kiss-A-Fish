import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase.config";
import "./CreatePost.css";

const CreatePost = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("Posts")
            .insert([{ title, content, image_url: imageUrl }])
            .select();
        if (error) {
            alert("[CreatePost] Error creating post: " + error.message);
        } else {
            console.log("[CreatePost] Post created: ", data[0]);
            setTitle("");
            setContent("");
            setImageUrl("");
            navigate("/");
        }
    };

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit}>
                <h1>Post your fish kiss!</h1>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <label htmlFor="image-url">Image URL</label>
                <input
                    type="text"
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
