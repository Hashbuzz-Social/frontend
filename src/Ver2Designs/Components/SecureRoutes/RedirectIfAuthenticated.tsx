import { useStore } from '@store/hooks';
import { FC, ReactNode } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';


interface Props {
    children?: ReactNode;
}

const RedirectIfAuthenticated: FC<Props> = ({ children }) => {
    const { ping, auth } = useStore()
    const [cookies] = useCookies(['aSToken', 'refreshToken']);

    const isAuthenticated = ping.status && (auth?.auth || cookies.aSToken);

    if (isAuthenticated) {
        // Redirect authenticated users to Dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default RedirectIfAuthenticated;