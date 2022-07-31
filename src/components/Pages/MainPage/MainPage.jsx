import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { APIAuthCall, APICall } from "../../../APIConfig/APIServices";
import TwitterSVG from "../../../SVGR/Twitter";
import Typography from "../../../Typography/Typography";
import Card from "../../Card/Card";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import ConsentModal from "../../PreviewModal/ConsentPreviewModal";
import {
  Connect,
  ContentHeaderText,
  Row, Wallet,
  CardContainer
} from "./MainPage.styles";
import { Loader } from '../../Loader/Loader';
export const MainPage = () => {
  const [open, setOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);
  const [userData, setUserData] = useState({});
  const [showLoading, setShowLoading] = useState(false);

  const theme = {
    color: "#696969",
    size: "18px",
    weight: "600",
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const href = window.location.href;
      if (href.includes('token=')) {
        const string = href.split('token=')[1];
        const token = string.split('&user_id=')[0];
        setCookie('token', token)
        const userId = string.split('&user_id=')[1];
        getUserInfo(userId, token);
      }
    }
    return () => mounted = false;
  }, [userData])
  let navigate = useNavigate();
  const getUserInfo = async (user_id, token) => {
    try {
      setShowLoading(true)
      const response = await APICall("/user/profile/" + user_id + "/", "GET", {}, null, false, token);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        setUserData(response.data)
        const { consent } = response.data;
        if (consent === true) {
          setShowLoading(false)
          navigate("/dashboard");
        }
        else {
          setShowLoading(false)
          setOpen(true);
        }
      }
    }
    catch (err) {
      console.error("/user/profile/", err)
      setShowLoading(false)

    }
  }

  const submitClick = async () => {
    setShowLoading(true)
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const user_data = {
      ...userInfo,
      "consent": true
    }
    try {
      const response = await APICall("/user/profile/" + userInfo.id + "/", "PATCH", {}, user_data, false, cookies.token);
      if (response.data) {
        setShowLoading(false)
        navigate("/dashboard");
      }
    }
    catch (err) {
      console.error("/user/profile/:", err)
      setShowLoading(false)

    }
  }

  const clickNo = () => {
    // Alert('You need to Accept consent!');
  }

  const login = () => {
    (async () => {
      setShowLoading(true)
      try {
        const response = await APIAuthCall("/user/twitter-login/", "GET", {}, {});
        if (response.data) {
          const { url } = response.data;
          window.location.href = url

        }
      } catch (error) {
        console.error("error===", error);
        setShowLoading(false)
      }

    })();
  }


  return (
    <ContainerStyled>
      <ContentHeaderText>
        _
      </ContentHeaderText>

      <Connect>
        <Wallet>
          <Typography theme={theme}>Let us get started</Typography>
          <Row />
          <CardContainer onClick={() => login()}>
            <Card title="Log in with Twitter" icon={<TwitterSVG />} />
          </CardContainer>
          {/* <Card title="Connect HashPack" icon={<WalletSVG />} /> */}
        </Wallet>
        {/* <Seperator /> */}
        {/* <Brand>
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
        </Brand> */}
      </Connect>
      <div>
        {/* <ReactTwitterLogin
          authCallback={authHandler}
          consumerKey='70jT2zeMdbbhGinO7R9TM8rmP'
          consumerSecret='hS6iMJXxR1LmI8MKvwIilW476Kb2h25ej9dZoxhvtQICn5BioG'
          children={<PrimaryButton text="Start" variant="contained" onclick={handleStart} />}
        /> */}
        {/* <PrimaryButton text="Start" variant="contained" onclick={login} /> */}
      </div>
      <ConsentModal
        open={open}
        setOpen={setOpen}
        submit={submitClick}
        noClick={clickNo}
      />
      <Loader open={showLoading} />
    </ContainerStyled>

  );
};