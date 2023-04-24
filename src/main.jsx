import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./Feed.jsx";
import CreatePost from "./routes/CreatePost.jsx";
import "./index.css";

import RootLayout from "./layouts/RootLayout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Feed />} />
                    <Route path="create" element={<CreatePost />} />
                    <Route path=":id" element={<>post</>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
