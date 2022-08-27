import { Dialog } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHashconnectService } from "../../HashConnect";
import { useSmartContractServices } from "../../HashConnect/smartcontractService";
import Typography from "../../Typography/Typography";
import PrimaryButton from "../Buttons/PrimaryButton";
import { BoxCont, ButtonWrapPrimary, CustomInput, CustomParagraph, Label, Row } from "./PreviewModal.styles";

const TopUpModal = ({ open, setOpen }) => {
  const [amount, setAmount] = useState(0);
  const { topUpAccount } = useSmartContractServices();
  const { pairingData } = useHashconnectService();

  let navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: "25px",
    color: "#000000",
    sizeRes: "28px",
  };
  const submit = async (e) => {
    // console.log(e);
    //handleSmartContractTransaction
    const amountTotopup = (parseFloat(amount) + parseFloat(amount) * 0.1).toFixed(8);
    const transaction = await topUpAccount(parseFloat(amountTotopup), pairingData.accountIds[0]);
    if (transaction.success) {
      setAmount(0);
      setOpen(false);
      console.log(transaction);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          width: "85%",
          height: "80%",
          maxWidth: 1010,
          scrollbarWidth: "none",
        },
      }}
    >
      <BoxCont>
        <Typography theme={theme}>TopUp account</Typography>
        <Row>
          <Label>Amount in HBAR</Label>

          <CustomInput placeholder="Amount in hbar" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <Label>+ {(parseFloat(amount) * 0.1).toFixed(8) ?? 0}</Label>
          <Label>=</Label>
          <Label>{(parseFloat(amount) + parseFloat(amount) * 0.1).toFixed(8) ?? 0}</Label>
        </Row>
        <CustomParagraph>Note 1: the price excludes Hedera network fee</CustomParagraph>
        <CustomParagraph>Note 2: the budget can be used over multiple campaigns</CustomParagraph>
      </BoxCont>

      <ButtonWrapPrimary>
        <PrimaryButton text="CANCEL" inverse={true} onclick={handleClose} colors="#EF5A22" border="1px solid #EF5A22" />
        <PrimaryButton text="PAY" onclick={submit} />
      </ButtonWrapPrimary>
      <div style={{ marginBottom: 30 }}></div>
    </Dialog>
  );
};

export default TopUpModal;
