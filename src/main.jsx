import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Feed from "./Feed.jsx";
import CreatePost from "./routes/CreatePost.jsx";
import Post from "./routes/Post.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Feed />} />
                    <Route path="create" element={<CreatePost />} />
                    <Route path=":id" element={<Post />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
