import { useStore } from "@store/hooks";
import { useCookies } from "react-cookie";
import { Navigate, useLocation } from "react-router-dom";


export const RequiredAuth = ({ children }: { children: JSX.Element }) => {
  const { ping, auth } = useStore();
  const [cookies] = useCookies(['aSToken', 'refreshToken']);
  const location = useLocation();

  const isAuthenticated = ping.status && (auth?.auth || cookies.aSToken);

  if (!isAuthenticated) {
    // Redirect unauthenticated users to Landing page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};


export default RequiredAuth;