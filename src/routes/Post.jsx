import { Link, useParams } from "react-router-dom";
import "./Post.css";

const Post = () => {
    const { id } = useParams();

    return (
        <div className="post-container">
            <div className="header">
                <Link to=".." className="back-button">←</Link>
                <h3 className="back">Back</h3>
            </div>
            <div className="post">
                <h2>Post {id}</h2>
            </div>
        </div>
    );
};

export default Post;
