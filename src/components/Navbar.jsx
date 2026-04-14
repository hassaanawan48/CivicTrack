import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout, user } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-left">{user?.email}</div>

      <div className="navbar-right">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;