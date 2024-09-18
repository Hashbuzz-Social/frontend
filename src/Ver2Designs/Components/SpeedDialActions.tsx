import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { default as LogoutIcon } from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
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
import { useHashconnectService } from "../../Wallet";
import { useConnectToExtension } from "../../Wallet/useConnectToExtension";
import { useDisconnect } from "../../Wallet/useDisconnect";
import { WalletConnectors } from "../../types";

type SpeedDialAction = {
  icon: React.ReactNode;
  name: React.ReactNode;
  id: string;
};

const postAuthActions: SpeedDialAction[] = [{ icon: <LogoutIcon />, name: "Logout", id: "logout" }];
const beforeAuthActions: SpeedDialAction[] = [
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  anchorEl?: HTMLElement | null;
  menuOpen?: boolean;
  handleMenuClose?: () => void;
}

const MenuItemsAndSpeedDial = ({ anchorEl, menuOpen, handleMenuClose }: Props) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [qrCodeOpen, setQrCodeOpen] = React.useState(false);
  const { pairingString, availableExtension } = useHashconnectService();
  const connectToExtension = useConnectToExtension();
  const disconnect = useDisconnect();
  const isDeviceIsSm = useMediaQuery(theme.breakpoints.down("sm"));
  const store = useStore();
  const navigate = useNavigate();
  const [cookies] = useCookies(["aSToken"]);

  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);

  const connectWalletProcess = () => {
    // console.log("Connect logo");
  };
  const showSnackBar = () => {};

  const handleQrCodeGen = () => {
    if (pairingString) {
      handleClose();
      setQrCodeOpen(true);
    }
  };

  const connectHashpack = async () => {
    try {
      if (isDeviceIsSm) {
        handleQrCodeGen();
      }
      if (availableExtension) {
        connectToExtension();
      } else {
        // await sendMarkOFwalletInstall();
        // Taskbar Alert - Hashpack browser extension not installed, please click on <Go> to visit HashPack website and install their wallet on your browser
        alert("Alert - HashPack browser extension not installed, please click on <<OK>> to visit HashPack website and install their wallet on your browser.  Once installed you might need to restart your browser for Taskbar to detect wallet extension first time.");
        window.open("https://www.hashpack.app");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = async (name: string) => {
    switch (name) {
      case "top-up":
        if (store?.currentUser?.hedera_wallet_id) connectWalletProcess();
        else showSnackBar();
        break;
      case "logout":
        await disconnect();
        toast.info("Logout Successfully.");
        navigate("/");
        break;
      case "qr-connect":
        handleQrCodeGen();
        store.dispatch({ type: "SET_WALLET_CONNECTOR", payload: WalletConnectors.QrCode });
        break;
      case "hashpack-connect":
        connectHashpack();
        store.dispatch({ type: "SET_WALLET_CONNECTOR", payload: WalletConnectors.HashPack });
        break;
      case "wallet-connect":
        store.dispatch({ type: "SET_WALLET_CONNECTOR", payload: WalletConnectors.WalletConnect });
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <SpeedDial
        ariaLabel="Connect your wallet"
        sx={{ position: "fixed", bottom: 10, right: 40 }}
        icon={<HashbuzzIcon size={60} color="#fff" />}
        openIcon={<CloseIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{
          sx: {
            colorScheme: "light",
          },
        }}
      >
        {(cookies?.aSToken ? postAuthActions : beforeAuthActions).map((action, index) => {
          return <SpeedDialAction key={action.id} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={(event) => handleClick(action.id)} />;
        })}
      </SpeedDial>
      <QRCodeDialog
        open={qrCodeOpen}
        onclose={() => {
          setQrCodeOpen(false);
        }}
      />
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
        {beforeAuthActions.map((action, index) => (
          <>
            <MenuItem key={action.id} onClick={() => handleClick(action.id)}>
              {action.name}
            </MenuItem>
            {index !== beforeAuthActions.length - 1 && <Divider />}
          </>
        ))}
      </Menu>
    </React.Fragment>
  );
};

interface QRCodeDialogProps {
  open: boolean;
  onclose: () => void;
}

const QRCodeDialog = ({ open, onclose }: QRCodeDialogProps) => {
  const [qrCodeOpen, setQrCodeOpen] = React.useState(false);
  const { pairingString, pairingData } = useHashconnectService();

  const handleQRCodeDialogClose = React.useCallback(() => {
    setQrCodeOpen(false);
    if (onclose) onclose();
  }, [onclose]);

  React.useEffect(() => {
    setQrCodeOpen(open);
  }, [open]);

  React.useEffect(() => {
    if (pairingData?.topic) handleQRCodeDialogClose();
  }, [handleQRCodeDialogClose, pairingData]);

  return (
    <Dialog open={qrCodeOpen} aria-labelledby="QRcode-dialog-title" onClose={handleQRCodeDialogClose} TransitionComponent={Transition} aria-describedby="qr-code-dialog-having-paring-string">
      <DialogTitle id="QRcode-dialog-title">{"Hashpack pairing string"}</DialogTitle>
      <DialogContent>
        <DialogContent id="qr-code-dialog-having-paring-string">Copy paring string and paste it in your wallet extension or scan QR code with your mobile wallet.</DialogContent>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Typography noWrap sx={{ width: 150 }}>
            {pairingString}
          </Typography>
          <Button size="small" endIcon={<ContentCopyIcon />} onClick={() => navigator.clipboard.writeText(pairingString ?? "")}>
            Copy
          </Button>
        </Stack>
        <Stack alignItems={"center"} justifyContent={"center"} sx={{ marginTop: 3 }}>
          {pairingString ? <QRCode value={pairingString} size={256} bgColor="#ffffff" viewBox={`0 0 256 256`} /> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleQRCodeDialogClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemsAndSpeedDial;
