import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../context/RoleContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { loginWithGoogle, user } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (role === "citizen") navigate("/citizen");
    if (role === "authority" || role === "admin") navigate("/admin");
  }, [user, role]);

  return (
    <div className="login-container">
      <h1 className="login-heading">
        Welcome to <span>CivicTrack</span>,<br />
        where the voices are heard!<br />
        <span style={{ fontSize: "0.8em", display: "block", marginTop: "8px" }}>
          Register your complaint now.
        </span>
      </h1>

      <button onClick={loginWithGoogle}>
        Continue with Google
      </button>
    </div>
  );
}

export default Login;