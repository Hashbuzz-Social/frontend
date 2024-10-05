import { Avatar, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useCallback, useState } from "react";
import { defualtBtn } from ".";
import { ExtensionData } from "@hashgraph/hedera-wallet-connect";
import HashbuzzIcon from "../../../../../SVGR/HashbuzzIcon";
import CloseIcon from "@mui/icons-material/Close";

// SpeedDial Component
const LandingPageSpeedDaial = React.memo<{ handleClick?: (id?: string) => void; disabled?: boolean; extensions?: ExtensionData[] }>(({ extensions, handleClick, disabled }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <SpeedDial
      // wallet connect lable
      ariaLabel="Connect your wallet"
      sx={{ position: "fixed", bottom: 10, right: 40 }}
      icon={<HashbuzzIcon size={60} color="#fff" />}
      openIcon={<CloseIcon fontSize="inherit" />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      FabProps={{
        disabled: !!disabled,
      }}
    >
      {extensions &&
        extensions.map((extension) => (
          <SpeedDialAction
            key={extension.id}
            //icon
            icon={<Avatar src={extension.icon} sx={{ width: 24, height: 24 }} alt={extension.name} />}
            tooltipTitle={extension.name}
            tooltipOpen
            // onclick handler
            onClick={() => handleClick && handleClick(extension.id)}
          />
        ))}
      <SpeedDialAction key={defualtBtn.id} icon={defualtBtn.icon} tooltipTitle={defualtBtn.name} tooltipOpen onClick={() => handleClick && handleClick()} />
    </SpeedDial>
  );
});

export default LandingPageSpeedDaial;
