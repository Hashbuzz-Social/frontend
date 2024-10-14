import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import TwitterIcon from "@mui/icons-material/Twitter";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "@store/hooks";
import HederaIcon from "@svgr/HederaIcon";
import * as S from "./styled";
import useAuthenticator from "@wallet/authentication/useAuthenticator";

const HeaderMenu = () => {
  const store = useStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleDisconnectAndLogout } = useAuthenticator();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await handleDisconnectAndLogout();
      navigate("/");
      toast.info("Logout Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ position: "absolute", right: 10, top: 20 }}>
      <Tooltip title="Account Options">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
          {store?.currentUser?.profile_image_url ? <Avatar src={store.currentUser.profile_image_url} sx={{ width: 32, height: 32 }} /> : <Avatar sx={{ width: 32, height: 32 }} />}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: S.MenuListItemsCss,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem title="Click to copy" onClick={() => navigator.clipboard.writeText(store?.currentUser?.personal_twitter_handle ?? "")}>
          <Avatar sx={{ height: 35, width: 35 }}>
            <HederaIcon size={23} fill="white" fillBg="#ccc" />
          </Avatar>
          {store?.currentUser?.hedera_wallet_id ?? ""}
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ height: 35, width: 35 }}>
            <TwitterIcon fontSize="inherit" />
          </Avatar>
          @{store?.currentUser?.personal_twitter_handle}
        </MenuItem>
        <Divider />
        {store?.currentUser?.role && ["ADMIN", "SUPER_ADMIN"].includes(store.currentUser?.role) ? (
          <MenuItem onClick={() => navigate(pathname.includes("admin") ? "/" : "/admin")}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            {pathname.includes("admin") ? "User Dashboard" : "Admin Dashboard"}
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderMenu;
