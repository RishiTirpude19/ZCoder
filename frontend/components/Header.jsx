import axios from "axios";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const navigate = useNavigate();

    async function handleClick() {
        try {
            await axios.post("http://localhost:8080/logout", {}, { withCredentials: true });
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/");
        } catch (error) {
            console.log(error);
            console.log("error while logging out");
        }
    }

    return (
        <header className="navbar">
            <nav>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookmarkedproblems" activeClassName="active">Bookmarked Problems</NavLink>
                    </li>
                    <li>
                        <NavLink to="/myproblems" activeClassName="active">My Problems</NavLink>
                    </li>
                    <li>
                        <NavLink to="/messages" activeClassName="active">Messages</NavLink>
                    </li>
                    <li>
                        <NavLink to="/contests" activeClassName="active">Contests</NavLink>
                    </li>
                    <li>
                        <NavLink to="/myprofile" activeClassName="active">My Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="/blogs" activeClassName="active">Blogs</NavLink>
                    </li>
                    <li>
                        <NavLink to="/collaborators" activeClassName="active">Hire Collaborator </NavLink>
                    </li>
                </ul>
            </nav>
            
            <button className="logout-button" onClick={handleClick}>
                Log Out
            </button>
        </header>
    );
}

export default Header;
