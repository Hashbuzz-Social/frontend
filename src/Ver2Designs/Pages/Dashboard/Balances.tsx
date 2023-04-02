import { AddCircle, ArrowBackIos, ArrowForwardIos, RemoveCircle } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  Grow,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import React, { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { useHashconnectService } from "../../../HashConnect";
import { useStore } from "../../../Providers/StoreProvider";
import HederaIcon from "../../../SVGR/HederaIcon";
import { BalOperation, EntityBalances } from "../../../types";
import { getErrorMessage } from "../../../Utilities/Constant";
import { cardStyle } from "./CardGenUtility";
import TopupModal from "./TopupModal";

interface BalanceObject {
  activeIndex: number;
  balances: EntityBalances[];
}
const INITIAL_BALANCES: BalanceObject = {
  activeIndex: 0,
  balances: [
    {
      entityBalance: "1234.1245",
      entityIcon: "ℏ",
      entitySymbol: "ℏ",
      entityId: "",
      entityType: "HBAR",
    },
  ],
};

const Balances = () => {
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  const store = useStore();
  const balances = store?.balances;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [topupModalData, setTopupModalData] = useState<EntityBalances | null>(null);

  const { pairingData, connectToExtension } = useHashconnectService();

  const { User, MirrorNodeRestAPI } = useApiInstance();
  // const [popOverOpen, setPopOverOpen] = React.useState(false);
  const [balanceList, setBalanceList] = React.useState<{ open: boolean; operation: BalOperation }>({ open: false, operation: "topup" });
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleBalanceNavigator = (navigate: "next" | "prev") => {
    setActiveIndex((index) => {
      const length = balances!.length;
      if (navigate === "next") {
        return index <= length - 1 ? index + 1 : 0;
      } else {
        return index >= 0 ? index - 1 : length - 1;
      }
    });
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setBalanceList((_d) => ({ ..._d, open: false }));
  };

  const handleMenuItemClick = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    event.preventDefault();
    const entity = balances![index];
    if (balanceList.operation === "topup") {
      //Start Operation for the top up
      const accountId = pairingData?.accountIds[0];
      if (accountId) {
        // Request for the balances for the account id
        const accountBalReq = await MirrorNodeRestAPI.getBalancesForAccountId(accountId);
        const accountBal = accountBalReq.data.balances.find((b) => b.account === accountId);

        // User is asking for the topup of fiet hbar
        if (entity.entityType === "HBAR") {
          accountBal?.balance ? setTopupModalData(entity) : toast.warning("Insufficient fund to the account.");
        } else {
          const tokenBalance = accountBal?.tokens.find((t) => t.token_id === entity.entityId);
          tokenBalance && tokenBalance.balance > 0
            ? setTopupModalData(entity)
            : toast.warning(`Paired account have insufficient token balance for the token ${entity.entityIcon}.`);
        }
      }
      setBalanceList((_d) => ({ ..._d, open: false }));
    } else {
      unstable_batchedUpdates(() => {
        setTopupModalData(entity);
        setBalanceList((_d) => ({ ..._d, open: false }));
      });
    }
  };

  const handleTopupOrReimClick = (operation: BalOperation) => {
    if (!pairingData) {
      toast.warning("Connect wallet first then retry topup.");
      connectToExtension();
    } else {
      setBalanceList({
        open: true,
        operation,
      });
    }
  };

  const topUpButtons = [
    <Button
      key="reimburse"
      startIcon={<RemoveCircle />}
      title="Reimburse from hashbuzz contract to your wallet"
      onClick={() => handleTopupOrReimClick("reimburse")}
    />,
    <Button
      key="top-up"
      startIcon={<AddCircle />}
      onClick={() => handleTopupOrReimClick("topup")}
      title="Topup your hashbuzz account for the campaign"
    />,
  ];

  return (
    <React.Fragment>
      <Grid item lg={3} xl={3} md={4} sm={6} xs={6}>
        <Card elevation={0} sx={cardStyle}>
          <Stack direction={aboveXs ? "row" : "column"} alignItems={aboveXs ? "flex-start" : "normal"} sx={{ height: "100%", width: "100%" }}>
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent={"center"}
              sx={{
                color: "rgba(82, 102, 255, 0.5)",
                height: "100%",
                paddingRight: aboveXs ? 2 : 0,
                paddingBottom: aboveXs ? 0 : 2,
                fontSize: 48,
              }}
            >
              <HederaIcon fill="#fff" fillBg="rgba(82, 102, 255, 0.5)" size={48} />
            </Stack>
            <Divider orientation={aboveXs ? "vertical" : "horizontal"} />
            <Box sx={{ flexGrow: 1, flexBasis: 0, maxWidth: "100%", textAlign: "left", paddingLeft: 1, paddingRight: 1 }}>
              <Stack direction={"row"} alignItems="center" justifyContent={"space-between"} sx={{ marginBottom: 2 }}>
                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                  {" Balances(ℏ)"}
                </Typography>
                <ButtonGroup
                  size="small"
                  aria-label="Balance update group"
                  sx={{ ".MuiButton-startIcon": { margin: 0 }, justifyContent: "center" }}
                  ref={anchorRef}
                >
                  {topUpButtons}
                </ButtonGroup>
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <ButtonGroup size="small" aria-label="Balance display card" sx={{ ".MuiButton-startIcon": { margin: 0 }, justifyContent: "center" }}>
                  <Button
                    key="next_button"
                    startIcon={<ArrowBackIos />}
                    disabled={activeIndex === 0}
                    onClick={() => handleBalanceNavigator("prev")}
                  />
                  <BalanceCard
                    entityBal={balances![activeIndex].entityBalance}
                    entityIcon={balances![activeIndex].entityIcon}
                    entitySymbol={balances![activeIndex].entitySymbol}
                    key="balance_card"
                  />
                  <Button
                    key="prev_button"
                    startIcon={<ArrowForwardIos />}
                    disabled={activeIndex === balances!.length - 1}
                    onClick={() => handleBalanceNavigator("next")}
                  />
                </ButtonGroup>
              </Box>
            </Box>
          </Stack>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={balanceList.open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="entityList-for-topup" autoFocusItem>
                      {balances!.map((bal, index) => (
                        <MenuItem onClick={(event) => handleMenuItemClick(event, index)}>
                          <ListItemAvatar>{bal.entityIcon}</ListItemAvatar>
                          <ListItemText>
                            {bal.entityBalance} {bal.entitySymbol + " "}
                          </ListItemText>
                          {balanceList.operation === "reimburse" ? (
                            <Typography variant="body2" color="text.secondary">
                              {"(max)"}
                            </Typography>
                          ) : null}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Card>
      </Grid>
      <TopupModal data={topupModalData} open={Boolean(topupModalData)} onClose={() => setTopupModalData(null)} operation={balanceList.operation} />
    </React.Fragment>
  );
};

interface BalanceCardProps {
  entityBal: string | number;
  entityIcon: React.ReactNode;
  entitySymbol: string;
}

const BalanceCard = ({ entityBal, entityIcon, entitySymbol }: BalanceCardProps) => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      component={Card}
      elevation={0}
      sx={{ padding: 0.5, display: "inline-flex", margin: "0 auto", borderRadius: 0, border: 1, borderColor: theme.palette.primary.main }}
    >
      <Avatar variant="rounded" sx={{ width: "24px", height: "24px" }}>
        {entityIcon ?? "ℏ"}
      </Avatar>
      <Stack spacing={0.25} sx={{ marginLeft: 0.5, marginRight: 0.5 }}>
        <Typography fontWeight={500} sx={{ textAlign: "center" }}>
          {entityBal ?? "124.5678"} {entitySymbol ?? "ℏ"}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Balances;