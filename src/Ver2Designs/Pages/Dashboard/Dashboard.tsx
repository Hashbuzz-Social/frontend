import { useStore } from "@store/hooks";
import { ADMIN_ADDRESS } from "../../../utils/helpers";


const Dashboard = () => {
  const store = useStore();
  const currentUseAddress = store.currentUser?.hedera_wallet_id;

  const isAdmin = !!currentUseAddress && ADMIN_ADDRESS.includes(currentUseAddress);

  return <div>{"To Dashboard"}</div>;
};

export default Dashboard;
