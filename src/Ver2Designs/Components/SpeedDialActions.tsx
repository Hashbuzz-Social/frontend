import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Menu, MenuItem, SpeedDial, SpeedDialAction, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HashbuzzIcon from "../../SVGR/HashbuzzIcon";
import HashpackIcon from "../../SVGR/HashpackIcon";
import HashPackLogoBlack from "../../SVGR/HashpackLogoBalck";
import WalletConnectIcon from "../../SVGR/WalletConnectIcon";
import WalletConnectLookup from "../../SVGR/WalletConnectLookup";
import { useStore } from "../../Store/StoreProvider";
import { useConnectToExtension } from "../../Wallet/hashpack/useConnectToExtension";
import { useDisconnect } from "../../Wallet/hashpack/useDisconnect";
import { useHashconnectService } from "../../Wallet/hashpack/useHashconnectServicce";
import useConnectViaWalletConnect from "../../Wallet/walletConnect/useConnectViaWalletConnect";

// Action Types
type SpeedDialActionType = {
  icon: React.ReactNode;
  name: React.ReactNode;
  id: string;
};

const postAuthActions: SpeedDialActionType[] = [{ icon: <LogoutIcon />, name: "Logout", id: "logout" }];

const beforeAuthActions: SpeedDialActionType[] = [
  { icon: <HashpackIcon height={24} />, name: <HashPackLogoBlack className="Hashpack-connecter-name" height={28} />, id: "hashpack-connect" },
  { icon: <WalletConnectIcon height={24} />, name: <WalletConnectLookup className="walletconnect-connecter-name" height={28} />, id: "wallet-connect" },
  {
    icon: <QrCodeIcon />,
    name: (
      <Box component={"span"} style={{ display: "inline-flex", width: "max-content", alignItems: "center", height: 32 }}>
        <HashPackLogoBlack className="Hashpack-QR-connecter-name" height={16} />
        <QrCodeIcon fontSize="inherit" sx={{ margin: "0 5px" }} />
        {" OR string"}
      </Box>
    ),
    id: "qr-connect",
  },
];

// SpeedDial Component
const SpeedDialComponent = React.memo<{ actions: SpeedDialActionType[]; handleClick: (id: string) => void }>(({ actions, handleClick }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <SpeedDial ariaLabel="Connect your wallet" sx={{ position: "fixed", bottom: 10, right: 40 }} icon={<HashbuzzIcon size={60} color="#fff" />} openIcon={<CloseIcon />} onClose={handleClose} onOpen={handleOpen} open={open}>
      {actions.map((action) => (
        <SpeedDialAction key={action.id} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={() => handleClick(action.id)} />
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
  handleClick: (id: string) => void;
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
        <MenuItem onClick={() => handleClick(action.id)}>{action.name}</MenuItem>
        {index !== actions.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </Menu>
));

// QRCodeDialog Component
const QRCodeDialog = ({ open, onclose }: { open: boolean; onclose?: () => void }) => {
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const { pairingString, pairingData } = useHashconnectService();

  const handleQRCodeDialogClose = useCallback(() => {
    setQrCodeOpen(false);
    if (onclose) onclose();
  }, [onclose]);

  useEffect(() => {
    setQrCodeOpen(open);
  }, [open]);

  useEffect(() => {
    if (pairingData?.topic) handleQRCodeDialogClose();
  }, [handleQRCodeDialogClose, pairingData]);

  return (
    <Dialog open={qrCodeOpen} aria-labelledby="QRcode-dialog-title" onClose={handleQRCodeDialogClose}>
      <DialogTitle id="QRcode-dialog-title">{"Hashpack pairing string"}</DialogTitle>
      <DialogContent>
        <DialogContent id="qr-code-dialog-having-paring-string">Copy pairing string and paste it in your wallet extension or scan QR code with your mobile wallet.</DialogContent>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Typography noWrap sx={{ width: 150 }}>
            {pairingString}
          </Typography>
          <Button size="small" endIcon={<ContentCopyIcon />} onClick={() => navigator.clipboard.writeText(pairingString ?? "")}>
            Copy
          </Button>
        </Stack>
        <Stack alignItems={"center"} justifyContent={"center"} sx={{ marginTop: 3 }}>
          {pairingString && <QRCode value={pairingString} size={256} bgColor="#ffffff" viewBox={`0 0 256 256`} />}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleQRCodeDialogClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export interface MenuItemsAndSpeedDialProps {
  anchorEl: Element | null;
  menuOpen?: boolean;
  handleMenuClose: (event: React.MouseEvent) => void;
}

// Main Component
const MenuItemsAndSpeedDial = ({ anchorEl, menuOpen, handleMenuClose }: MenuItemsAndSpeedDialProps) => {
  const theme = useTheme();
  const isDeviceIsSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { availableExtension, pairingString } = useHashconnectService();
  const connectToExtension = useConnectToExtension();
  const { handleConnect } = useConnectViaWalletConnect();
  const disconnect = useDisconnect();
  const store = useStore();
  const navigate = useNavigate();
  const [cookies] = useCookies(["aSToken"]);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  const connectHashpack = useCallback(async () => {
    try {
      if (isDeviceIsSm) {
        handleQrCodeGen();
      } else if (availableExtension) {
        connectToExtension();
      } else {
        alert("Please install HashPack extension.");
        window.open("https://www.hashpack.app", "_blank");
      }
    } catch (e) {
      console.log(e);
    }
  }, [availableExtension, connectToExtension, isDeviceIsSm]);

  const handleQrCodeGen = useCallback(() => {
    if (pairingString) {
      setQrCodeOpen(true);
    }
  }, [pairingString]);

  const connectViaWalletConnect = useCallback(() => {
    handleConnect();
  }, [handleConnect]);

  const handleClick = useCallback(
    async (name) => {
      switch (name) {
        case "top-up":
          // logic here
          break;
        case "logout":
          await disconnect();
          toast.info("You have successfully logged out.");
          navigate("/");
          break;
        case "hashpack-connect":
          connectHashpack();
          break;
        case "wallet-connect":
          connectViaWalletConnect();
          break;
        case "qr-connect":
          handleQrCodeGen();
          break;
        default:
          console.warn("Unexpected action: ", name);
      }
    },
    [connectHashpack, connectViaWalletConnect, disconnect, handleQrCodeGen, navigate]
  );

  const actions = cookies.aSToken ? postAuthActions : beforeAuthActions;

  return (
    <>
      <SpeedDialComponent actions={actions} handleClick={handleClick} />
      <MenuComponent anchorEl={anchorEl} menuOpen={!!menuOpen} handleMenuClose={handleMenuClose} actions={actions} handleClick={handleClick} />
      <QRCodeDialog open={qrCodeOpen} onclose={() => setQrCodeOpen(false)} />
    </>
  );
};

export default React.memo(MenuItemsAndSpeedDial);
