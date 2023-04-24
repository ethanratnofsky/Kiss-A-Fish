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
                <h1 className="heading">Share a Fish Kiss</h1>
                <div className="input-container">
                    <label htmlFor="title">Title</label>
                    <span className="input-description">Create a title for your post</span>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="eg. My first fish kiss!"
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="content">Content</label>
                    <span className="input-description">Write a description for your post</span>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="eg. I was so excited to kiss my first fish! I've been fishing for weeks and finally caught one!"
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="image-url">Image URL</label>
                    <span className="input-description">Add an image to your post</span>
                    <input
                        type="text"
                        id="image-url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="eg. https://www.mywebsite.com/my-image.jpg"
                    />
                </div>
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
