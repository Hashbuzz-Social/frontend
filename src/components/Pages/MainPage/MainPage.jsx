import { useNavigate } from "react-router-dom";
import TwitterSVG from "../../../SVGR/Twitter";
import WalletSVG from "../../../SVGR/Wallet";
import Typography from "../../../Typography/Typography";
import PrimaryButton from "../../Buttons/PrimaryButton";
import Card from "../../Card/Card";
import CheckBox from "../../CheckBox/CheckBox";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import {
  Brand,
  CardWrap,
  CheckboxWrap,
  Connect,
  ContentHeaderText,
  Row,
  Seperator,
  Wallet,
} from "./MainPage.styles";

export const MainPage = () => {
  const theme = {
    color: "#696969",
    size: "18px",
    weight: "600",
  };
  const secondaryTheme = {
    color: "#696969",
    size: "14px",
    weight: "500",
  };
  let navigate = useNavigate();

  const handleStart = () => {
    navigate("/create");
  };
  return (
    <ContainerStyled>
      <ContentHeaderText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu iaculis
        urna, nec vestibulum elit. Praesent quam risus, varius vel venenatis
        non, elementum at sapien. Maecenas feugiat dictum tortor, in tincidunt
        metus dignissim eget. Pellentesque quis tincidunt quam. Integer a nibh
        nec ante imperdiet vehicula. Duis ac velit vel nulla pellentesque porta
        vel vel massa. Quisque tellus ante, ultricies vel ipsum id, bibendum
        suscipit mi. Nunc ullamcorper dolor tortor, vitae bibendum lectus
        elementum convallis. Praesent quam nisl, pellentesque ac massa placerat,
        tempus fermentum ligula. Nulla facilisi. Praesent consectetur dapibus
        interdum.
      </ContentHeaderText>
      <Connect>
        <Wallet>
          <Typography theme={theme}>Connect your wallet</Typography>
          <Row />
          <Card title="Connect HashPack" icon={<WalletSVG />} />
        </Wallet>
        <Seperator />
        <Brand>
          <Typography theme={theme}>Connect your brand</Typography>
          <CheckboxWrap style={{ display: "flex" }}>
            <Row>
              <>
                <CheckBox />
              </>
              <>
                <Typography theme={secondaryTheme}>
                  I want to run a campaign
                </Typography>
              </>
            </Row>
            <Row>
              <>
                <CheckBox />
              </>
              <>
                <Typography theme={secondaryTheme}>
                  I want to earn hbars
                </Typography>
              </>
            </Row>
          </CheckboxWrap>
          <CardWrap style={{ display: "flex" }}>
            <Card title="Connect Twitter" icon={<TwitterSVG />} />
            <Card
              title={`Enter Personal Twitter Handle`}
              icon={<TwitterSVG />}
            />
          </CardWrap>
        </Brand>
      </Connect>
      <div>
        <PrimaryButton text="Start" variant="contained" onclick={handleStart} />
      </div>
    </ContainerStyled>
  );
};
