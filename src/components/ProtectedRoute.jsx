import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 👇 ADD adminOnly HERE!
export default function ProtectedRoute({ children, roles, adminOnly }) { 
    const { user, profile } = useAuth();

    // 1. Check Login Status
    if (!user) return <Navigate to="/login" />;

    // 2. Check Admin Approval Status (Your custom security requirement)
    if (!profile?.approved)
        return <div className="text-center mt-10 text-red-600">
            Waiting for Admin Approval...
        </div>;

    // 3. Check for Specific Roles (if roles prop is provided)
    if (roles && !roles.includes(profile?.role))
        return <div className="text-center mt-10 text-red-600">
            Access Denied (Unauthorized)
        </div>;

    // 4. Check for Admin-Only Access (When adminOnly prop is true)
    if (adminOnly && profile.role !== "admin")
        return <Navigate to="/" />;

    return children;
}

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, roles }) {
//     const { user, profile } = useAuth();

//     if (!user) return <Navigate to="/login" />;

//     if (!profile?.approved)
//         return <div className="text-center mt-10 text-red-600">
//             Waiting for Admin Approval...
//         </div>;

//     if (roles && !roles.includes(profile?.role))
//         return <div className="text-center mt-10 text-red-600">
//             Access Denied (Unauthorized)
//         </div>;

//     if (adminOnly && profile.role !== "admin")
//         return <Navigate to="/" />;

//     return children;
// }
