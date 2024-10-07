import { useStore } from "@store/hooks";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";


export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [cookies] = useCookies(["aSToken"]);
  const store = useStore()

  if (cookies.aSToken && store?.ping.status) return children;

  return <Navigate to={"/"} />;
};
