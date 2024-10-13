import { AccountId } from "@hashgraph/sdk";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Box, Button, Menu, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import HashbuzzIcon from "@svgr/HashbuzzIcon";
import useAuthenticator from "@wallet/authentication/useAuthenticator";
import useDisconnectHandler from "@wallet/hooks/useDisconnectHandler";
import useSession from "@wallet/hooks/useSessions";
import useAsyncStatusWrapper from "@wallet/services/useAsyncStatusWrapper";
import { useState } from "react";

const AuthFlowCard = () => {
  const { state, dispatch, dAppConnector } = useSession();
  const { selectedSigner, signers } = state || {};
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { initSignAndAutheticate } = useAuthenticator();
  const { disconnect } = useDisconnectHandler();
  const { modalWrapper } = useAsyncStatusWrapper();

  const open = Boolean(anchorEl);

  const HandlerSignerMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSignerMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOnchage = (event: SelectChangeEvent<string>) => {
    const selectedAcountId = AccountId.fromString(event.target.value);
    dispatch({ type: "SET_SELECTED_SIGNER", payload: dAppConnector?.getSigner(selectedAcountId) ?? null });
  };

  const handleAuthenticate = async (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Authenticate Starts");
    await initSignAndAutheticate();
  };

  const handleDiscconetToSelectedsigner = async () => {
    await modalWrapper(() => disconnect(selectedSigner?.topic));
    handleSignerMenuClose();
  };

  return (
    <Box sx={{ p: 2, bgcolor: "rgba(255,0,0,0.35)", borderRadius: 1 }}>
      <Typography variant="h5" sx={{ color: "#fff", marginBottom: 2 }}>
        Your wallet is paired now procced for Authentication
      </Typography>
      <Stack direction={"row"} justifyContent="space-between">
        <Button sx={{ color: "#fff" }} endIcon={!open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />} id="slected-signer-menu" aria-controls={open ? "slected-signer-options" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={HandlerSignerMenuClick}>
          Signer : {selectedSigner?.getAccountId().toString()}
        </Button>

        <FormControl color="info" size="small">
          <InputLabel id="signer-select-label" sx={{ color: "#fff" }}>
            Chnage Signer
          </InputLabel>
          <Select labelId="signer-select-label" id="signer-selector" defaultValue={selectedSigner?.getAccountId().toString()} value={selectedSigner?.getAccountId().toString()} label={selectedSigner?.getAccountId().toString()} onChange={handleOnchage} sx={{ color: "#fff", borderColor: "#fff" }}>
            {signers?.map((signer) => (
              <MenuItem key={signer.topic} value={signer?.getAccountId().toString()}>
                {signer?.getAccountId().toString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          sx={{ color: "#fff" }}
          startIcon={<HashbuzzIcon color="#fff" size={30} />}
          size="small"
          variant="outlined"
          // onClick={handleAuthenticate}
          onClick={handleAuthenticate}
        >
          Authenticate
        </Button>
        <Menu
          id="slected-signer-options"
          anchorEl={anchorEl}
          open={open}
          onClose={handleSignerMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleDiscconetToSelectedsigner}>Diconnect - {selectedSigner?.getAccountId().toString()}</MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default AuthFlowCard;
