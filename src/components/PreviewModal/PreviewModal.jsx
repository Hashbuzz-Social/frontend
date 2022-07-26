import { Dialog } from "@mui/material";
import * as React from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { APICall } from "../../APIConfig/APIServices";
import Typography from "../../Typography/Typography";
import PrimaryButton from "../Buttons/PrimaryButton";
import ModalTable from "../Tables/ModalTable";
import {
  BoxCont,
  ButtonWrapPrimary,
  CustomIframe,
  CustomParagraph, IconsWrap, LeftSec,
  RightSec,
  TableSection,
  TextWrap,
  Wrapper
} from "./PreviewModal.styles";

const PreviewModal = ({
  open,
  setOpen,
  Text,
  reply,
  retweet,
  like,
  download,
  follow,
  srcLink,
  name,
  displayMedia,
  media,
  videoTitle,
  addMedia,
  budget
}) => {
  let navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['token']);

  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: "36px",
    color: "#000000",
    sizeRes: "28px",
  };
  const body = {
    weight: 700,
    size: "16px",
    color: "#000",
    sizeRes: "16px",
  };

  const handleSubmit = async () => {
    const postData = {
      "name": name,
      "tweet_text": Text,
      "replay_reward": reply,
      "retweet_reward": retweet,
      "like_reward": like,
      "like_downloaded_reward": download,
      "follow_reward": follow,
      "media": [],
    }
    try {
      const response = await APICall("/campaign/twitter-card/", "POST", {}, postData, false, cookies.token);
      if (response.data) {
        navigate("/dashboard");
        // navigate("/onboarding");
      }
    }
    catch (err) {
      console.error("campaign/twitter-card/:", err)
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
          width: "100%",
          height: "100%",
          maxWidth: 1010,
          minWidth: 350,
          maxHeight: 655,
          scrollbarWidth: "none",
        },
      }}
    >
      <BoxCont>
        <Typography theme={theme}>Tweet campaign preview</Typography>
        <Wrapper>
          <LeftSec>
            {/* <CustomParagraph>{name}</CustomParagraph> */}
            <CustomParagraph>{Text}</CustomParagraph>
            {
              displayMedia.length > 0 && addMedia ?
              displayMedia.length === 3 ?
              <IconsWrap>
                <div>
                  {displayMedia[0] ? <><img width={150} src={displayMedia[0]} alt="" /><br/></> : null}
                  {displayMedia[1] ? <img width={150} src={displayMedia[1]} alt="" /> : null}
                </div>

                <IconsWrap>
                  {displayMedia[2] ? <img width={200} src={displayMedia[2]} alt="" /> : null}
                </IconsWrap>
              </IconsWrap>
              : <IconsWrap>
                 <div>
                  {displayMedia[0] ? <><img width={150} src={displayMedia[0]} alt="" /><br/></> : null}
                  {displayMedia[1] ? <img width={150} src={displayMedia[1]} alt="" /> : null}
                </div>
               
                <div>
                  {displayMedia[2] ? <><img width={150} src={displayMedia[2]} alt="" /><br/></> : null}
                  {displayMedia[3] ? <img width={150} src={displayMedia[3]} alt="" /> : null}
                </div>
              </IconsWrap>
                :
                <CustomIframe
                  src={srcLink}
                  id="tutorial"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  title="video"
                ></CustomIframe>
            }
            <TextWrap>
              <Typography theme={body}>{videoTitle}</Typography>
            </TextWrap>

            <CustomParagraph>Campaign Budget: {budget}</CustomParagraph>
            {/* <CustomParagraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a
              finibus nisl, ut porta felis. Etiam vitae mollis purus. isl, ut
              porta felis. Etiam vitae mollis purus.
            </CustomParagraph> */}
          </LeftSec>
          <RightSec>
            <TableSection>
              <ModalTable
                reply={reply}
                retweet={retweet}
                like={like}
                download={download}
                follow={follow}
              />
            </TableSection>
            <CustomParagraph>
            Warning: you will not be able to edit this tweet if you click submit as this feature is not available in Twitter yet, we recommend you read your tweet information and reward table carefully before submitting your campaign.
            </CustomParagraph>
            <ButtonWrapPrimary>
              <PrimaryButton
                text="Cancel & Edit"
                inverse={true}
                onclick={handleClose}
                colors="#EF5A22"
                border="1px solid #EF5A22"
              />
              <PrimaryButton text="Submit" onclick={handleSubmit} />
            </ButtonWrapPrimary>
          </RightSec>
        </Wrapper>
      </BoxCont>
    </Dialog>
  );
};

export default PreviewModal;
