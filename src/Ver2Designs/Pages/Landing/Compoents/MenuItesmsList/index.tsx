import React from "react";
import { ExtensionData } from "@hashgraph/hedera-wallet-connect";
import { Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import WalletConnectIcon from "@svgr/WalletConnectIcon";
import WalletConnectLookup from "@svgr/WalletConnectLookup";
import * as SC from "./styled";

export const defualtBtn = {
  // default icon for wallet connect
  icon: <WalletConnectIcon height={24} />,
  name: <WalletConnectLookup className="walletconnect-connecter-name" height={28} />,
  id: "wallet-connect",
};

const MenuItemsList = React.memo<{
  anchorEl: HTMLElement | null;
  menuOpen: boolean;
  handleMenuClose: (event: React.MouseEvent) => void;
  handleClick?: (id?: string) => void;
  avialbeExtensions?: ExtensionData[];
}>(({ anchorEl, menuOpen, handleMenuClose, handleClick, avialbeExtensions }) => (
  <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={!!menuOpen}
    onClose={handleMenuClose}
    onClick={handleMenuClose}
    slotProps={{
      paper: {
        elevation: 0,
        sx: SC.MenuCustomCss,
      },
    }}
    transformOrigin={{ horizontal: "right", vertical: "top" }}
    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  >
    {avialbeExtensions &&
      avialbeExtensions.reduce<JSX.Element[]>((acc, extesnion, index) => {
        acc.push(
          <MenuItem key={extesnion.id} onClick={() => handleClick && handleClick(extesnion.id)}>
            {extesnion.icon && (
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }} src={extesnion.icon} alt={extesnion.name} />
              </ListItemIcon>
            )}
            <ListItemText>{extesnion.name}</ListItemText>
          </MenuItem>
        );
        if (index !== avialbeExtensions.length - 1) {
          acc.push(<Divider key={`divider-${extesnion.id}`} />);
        }
        return acc;
      }, [])}
    <MenuItem onClick={() => handleClick && handleClick()}>{defualtBtn.name}</MenuItem>
  </Menu>
));

export default MenuItemsList;
