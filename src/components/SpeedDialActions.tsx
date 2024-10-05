import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, Menu, MenuItem, SpeedDial, SpeedDialAction, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HashbuzzIcon from "../SVGR/HashbuzzIcon";
import WalletConnectIcon from "../SVGR/WalletConnectIcon";
import WalletConnectLookup from "../SVGR/WalletConnectLookup";

// Action Types
type SpeedDialActionType = {
  icon: React.ReactNode;
  name: React.ReactNode;
  id: string;
};

const postAuthActions: SpeedDialActionType[] = [{ icon: <LogoutIcon />, name: "Logout", id: "logout" }];

const beforeAuthActions: SpeedDialActionType[] = [
  // { icon: <HashpackIcon height={24} />, name: <HashPackLogoBlack className="Hashpack-connecter-name" height={28} />, id: "hashpack-connect" },
  { icon: <WalletConnectIcon height={24} />, name: <WalletConnectLookup className="walletconnect-connecter-name" height={28} />, id: "wallet-connect" },
  // {
  //   icon: <QrCodeIcon />,
  //   name: (
  //     <Box component={"span"} style={{ display: "inline-flex", width: "max-content", alignItems: "center", height: 32 }}>
  //       <HashPackLogoBlack className="Hashpack-QR-connecter-name" height={16} />
  //       <QrCodeIcon fontSize="inherit" sx={{ margin: "0 5px" }} />
  //       {" OR string"}
  //     </Box>
  //   ),
  //   id: "qr-connect",
  // },
];

// SpeedDial Component
const SpeedDialComponent = React.memo<{ actions: SpeedDialActionType[]; handleClick?: (id: string) => void; disabled?: boolean }>(({ actions, handleClick, disabled }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <SpeedDial
      // wallet connect lable
      ariaLabel="Connect your wallet"
      sx={{ position: "fixed", bottom: 10, right: 40 }}
      icon={<HashbuzzIcon size={60} color="#fff" />}
      openIcon={<CloseIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      FabProps={{
        disabled: !!disabled,
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction key={action.id} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={() => handleClick && handleClick(action.id)} />
      ))}
    </SpeedDial>
  );
});

// Menu Component
const MenuComponent = React.memo<{
  anchorEl: Element | null;
  menuOpen: boolean;
  handleMenuClose: (event: React.MouseEvent) => void;
  actions: SpeedDialActionType[];
  handleClick?: (id: string) => void;
}>(({ anchorEl, menuOpen, handleMenuClose, actions, handleClick }) => (
  <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={!!menuOpen}
    onClose={handleMenuClose}
    onClick={handleMenuClose}
    slotProps={{
      paper: {
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      },
    }}
    transformOrigin={{ horizontal: "right", vertical: "top" }}
    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  >
    {actions.map((action, index) => (
      <React.Fragment key={action.id}>
        <MenuItem onClick={() => handleClick && handleClick(action.id)}>{action.name}</MenuItem>
        {index !== actions.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </Menu>
));

export interface MenuItemsAndSpeedDialProps {
  anchorEl: Element | null;
  menuOpen?: boolean;
  handleMenuClose: (event: React.MouseEvent) => void;
  disabled?: boolean;
}

// Main Component
const MenuItemsAndSpeedDial = ({ anchorEl, menuOpen, handleMenuClose, disabled }: MenuItemsAndSpeedDialProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [cookies] = useCookies(["aSToken"]);

  const handleClick = useCallback(
    async (name) => {
      switch (name) {
        case "top-up":
          // logic here
          break;
        case "logout":
          toast.info("You have successfully logged out.");
          navigate("/");
          break;
        case "hashpack-connect":
          break;
        case "wallet-connect":
          break;
        case "qr-connect":
          break;
        default:
          console.warn("Unexpected action: ", name);
      }
    },
    [navigate]
  );

  const actions = cookies.aSToken ? postAuthActions : beforeAuthActions;

  return (
    <>
      <SpeedDialComponent actions={actions} handleClick={handleClick} disabled={disabled} />
      <MenuComponent anchorEl={anchorEl} menuOpen={!!menuOpen} handleMenuClose={handleMenuClose} actions={actions} handleClick={handleClick} />
    </>
  );
};

export default React.memo(MenuItemsAndSpeedDial);
