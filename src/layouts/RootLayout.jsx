import { Outlet, Link } from "react-router-dom";

import "./RootLayout.css";

const RootLayout = () => {
    return (
        <>
            <nav>
                <Link to="/" className="logo">
                    <h2>Kiss-A-Fish 😘🐟🫶</h2>
                </Link>
                <ul>
                    <li>
                        <Link to="/create">
                            <button className="post-button">✎ Post</button>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
};

export default RootLayout;
