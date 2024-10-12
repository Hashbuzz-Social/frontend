import { MenuItem, Select } from "@mui/material";
import Picker from "emoji-picker-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiInstance } from "../../../APIConfig/api";
import Image from "../../../IconsPng/arrow-symbol.png";
import Typography from "../../../Typography/Typography";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import PreviewModal from "../../PreviewModal/PreviewModal";
import { TemplateTable } from "../../Tables/TemplateTable";
import ChatgptModal from "./ChatgptModal/ChatgptModal";
import { ShowImage } from "./ShowImage";
import { ButtonWrap, ButtonWrapPrimary, CustomCheckboxInput, CustomIframe, CustomInput, CustomParagraph, EmoBtnWrap, ErrorTextWrap, IconsWrap, ImgWrap, LeftSec, RightSec, SimpleDiv, TableSection, WordsWrap, Wrapper } from "./TemplatePage.styles";
import { YoutubeIcon } from "./YoutubeIcon";
import { useStore } from "@store/hooks";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PrimaryButton, SecondaryButton } from "@components/Buttons";

interface Token {
  value: string;
  token_symbol: string;
}

interface FormValues {
  name: string;
  text: string;
  budget: number;
  type: string;
  selectedToken: string;
  reply: number;
  retweet: number;
  like: number;
  quote: number;
  follow: number;
  media: string[];
  displayMedia: string[];
  isYoutube: boolean;
  gifSelected: boolean;
  addMedia: boolean;
}

const TemplatePage: React.FC = () => {
  let navigate = useNavigate();
  const [srcLink, setSrcLink] = useState("https://www.youtube.com/embed/1lzba8D4FCU");
  const [showChatModal, setShowChatModal] = useState(false);
  const [buttonTags, setButtonTags] = useState<string[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string | false>(false);
  const { User } = useApiInstance();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [open, setOpen] = useState(false);
  const store = useStore();

  const getTokens = async () => {
    const response = await User.getTokenBalances();
    const updatedTokens: Token[] = [];
    response?.forEach((item: any) => {
      if (item?.available_balance > 0) {
        updatedTokens.push({
          value: item?.token_id,
          token_symbol: item?.token_symbol,
        });
      }
    });
    setAllTokens(updatedTokens);
  };

  const theme = {
    weight: 500,
    size: "36px",
    color: "#000000",
    sizeRes: "28px",
  };

  const handlePreview = () => {
    setOpen(true);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void, values: FormValues) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let url = URL.createObjectURL(file);
    const fileType = file.type;
    setFieldValue("isYoutube", false);
    if (values.media.length === 0 && fileType.includes("gif")) {
      setFieldValue("displayMedia", [...values.displayMedia, url]);
      setFieldValue("gifSelected", true);
      let data = new FormData();
      data.append("media_file", file);
      data.append("media_type", "image");
      try {
        // Upload logic here
      } catch (err) {
        console.error("/campaign/media/:", err);
      }
    } else if (values.media.length < 4 && !fileType.includes("gif") && !values.gifSelected) {
      try {
        setFieldValue("displayMedia", [...values.displayMedia, url]);
        let data = new FormData();
        data.append("media_file", file);
        data.append("media_type", "image");
        try {
          // Upload logic here
        } catch (err) {
          console.error("/campaign/media/:", err);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Max 4 file or gif");
    }
  };

  const handleYouTubeClick = (setFieldValue: (field: string, value: any) => void, values: FormValues) => {
    setFieldValue("isYoutube", !values.isYoutube);
  };

  const checking = (urls: string, setFieldValue: (field: string, value: any) => void) => {
    let url = urls.trim();
    let videoId = "";
    if (url.indexOf("youtube") !== -1) {
      let urlParts = url.split("?v=");
      videoId = urlParts?.[1]?.substring(0, 11);
    } else if (url?.indexOf("youtu.be") !== -1) {
      let urlParts = url?.replace("//", "")?.split("/");
      videoId = urlParts[1]?.substring(0, 11);
    }
    if (videoId === "") {
      setSrcLink(urls);
    } else {
      setSrcLink("https://www.youtube.com/embed/" + videoId);
    }
    getYouTubeTitleAndDes(videoId);
  };

  const getYouTubeTitleAndDes = (videoId: string) => {
    const vidurl = "https://www.youtube.com/watch?v=" + videoId;

    fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
      .then((res) => res.json())
      .then((data) => setVideoTitle(data.title));
  };

  const handleLink = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    checking(event.target.value, setFieldValue);
    setFieldValue("media", [event.target.value]);
    setFieldValue("displayMedia", []);
  };

  const onEmojiClick = (event: any, emojiObject: any, setFieldValue: (field: string, value: any) => void, values: FormValues) => {
    if (268 - values.text.length >= 2) setFieldValue("text", values.text + "" + event.emoji);
  };

  const setremoveImage = (index: number, setFieldValue: (field: string, value: any) => void, values: FormValues) => {
    values.displayMedia.splice(index, 1);
    values.media.splice(index, 1);
    const imagesArr = values.displayMedia.length === 0 ? [] : [...values.displayMedia];
    const mediaArr = values.media.length === 0 ? [] : [...values.media];
    setFieldValue("media", mediaArr);
    setFieldValue("displayMedia", imagesArr);
  };

  useEffect(() => {
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter some value"),
    text: Yup.string().required("Please enter some value"),
    budget: Yup.number().required("Please enter a budget").min(1, "Budget must be at least 1"),
  });

  const initialValues: FormValues = {
    name: "",
    text: "",
    budget: 0,
    type: "HBAR",
    selectedToken: allTokens?.[0]?.value || "",
    reply: 0,
    retweet: 0,
    like: 0,
    quote: 0,
    follow: 0,
    media: ["https://www.youtube.com/watch?time_continue=1&v=1lzba8D4FCU&embeds_referring_euri=http%3A%2F%2Flocalhost%3A3000%2F&source_ve_path=Mjg2NjY&feature=emb_logo"],
    displayMedia: [],
    isYoutube: false,
    gifSelected: false,
    addMedia: false,
  };

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    // Handle form submission
  };

  return (
    <ContainerStyled>
      <ImgWrap onClick={() => navigate("/dashboard")}>
        <img width={30} src={Image} alt="" />
      </ImgWrap>
      <Typography theme={theme}>Campaign</Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <Wrapper>
              <LeftSec>
                <Field as={CustomInput} name="name" style={{ width: "100%", height: "100px" }} placeholder="Enter Campaign title" />
                <ErrorMessage name="name" component={ErrorTextWrap} />
                <Select style={{ margin: "20px 0" }} labelId="token_type" id="token_type" value={values.type} onChange={handleChange} onBlur={handleBlur} name="type">
                  <MenuItem value={"FUNGIBLE"}>Fungible</MenuItem>
                  <MenuItem value={"HBAR"}>HBAR</MenuItem>
                </Select>
                {values.type === "FUNGIBLE" && (
                  <Select style={{ margin: "20px 0" }} labelId="token_id" id="token_id" value={values.selectedToken} onChange={handleChange} onBlur={handleBlur} name="selectedToken">
                    {allTokens?.map((item) => (
                      <MenuItem key={item.value} value={item.value}>{`${item.token_symbol}-${item.value}`}</MenuItem>
                    ))}
                  </Select>
                )}
                <Field as={CustomParagraph} name="text" type="textarea" maxLength={270} placeholder="Start typing your tweet campaign" />
                <ErrorMessage name="text" component={ErrorTextWrap} />
                <WordsWrap>
                  <div className="chat-icon" onClick={() => setShowChatModal(true)}>
                    <img src="/images/chatgpt.png" />
                  </div>
                  <ChatgptModal showChatModal={showChatModal} setShowChatModal={setShowChatModal} />
                  <EmoBtnWrap className="button" onClick={() => setShowEmojis(!showEmojis)}>
                    😊 &nbsp;
                  </EmoBtnWrap>
                  {270 - values.text.length === 0 ? 0 : <div>{270 - values.text.length || 270}</div>}
                </WordsWrap>
                {showEmojis && (
                  <div>
                    <div style={{ width: "100%" }}>
                      <Picker onEmojiClick={(event, emojiObject) => onEmojiClick(event, emojiObject, setFieldValue, values)} />
                    </div>
                  </div>
                )}
                <ButtonWrap>
                  {buttonTags.map((item) => (
                    <SecondaryButton key={item} text={item.replace(item[0], "")} />
                  ))}
                </ButtonWrap>
                <TableSection>
                  <TemplateTable
                    handleReply={(e) => setFieldValue("reply", e.target.value)}
                    handleRetweet={(e) => setFieldValue("retweet", e.target.value)}
                    handleLike={(e) => setFieldValue("like", e.target.value)}
                    handleDownload={(e) => setFieldValue("quote", e.target.value)}
                    handleFollow={(e) => setFieldValue("follow", e.target.value)}
                    reply={values.reply}
                    selectedToken={values.selectedToken}
                    type={values.type}
                    retweet={values.retweet}
                    like={values.like}
                    quote={values.quote}
                    follow={values.follow}
                    download={0}
                  />
                </TableSection>
              </LeftSec>
              <RightSec>
                <Field as={CustomInput} step="0.1" type="number" required min="1" placeholder="Enter campaign budget" name="budget" />
                <ErrorMessage name="budget" component={ErrorTextWrap} />
                <IconsWrap>
                  <CustomCheckboxInput type="checkbox" onChange={() => setFieldValue("addMedia", !values.addMedia)} />
                  Do you want to add media?
                </IconsWrap>
                {values.addMedia ? (
                  <IconsWrap>
                    <label htmlFor="file">
                      <span> </span>
                    </label>
                    <CustomInput type="file" alt="" id="file" style={{ display: "none" }} accept="image/png, image/gif, image/jpeg,image/jpg, video/*" onChange={(event) => handleImageChange(event, setFieldValue, values)} />
                    <label onClick={() => handleYouTubeClick(setFieldValue, values)}>
                      <span>
                        <YoutubeIcon />
                      </span>
                    </label>
                  </IconsWrap>
                ) : null}
                {values.isYoutube && values.addMedia ? (
                  <>
                    <CustomInput placeholder="http/123/reward/taskbar" value={values.media} onChange={(event) => handleLink(event, setFieldValue)} />
                    {values.displayMedia.length > 0 ? (
                      values.displayMedia.length === 3 ? (
                        <IconsWrap>
                          <div>
                            {values.displayMedia[0] ? (
                              <SimpleDiv>
                                <ShowImage ind={0} setremoveImage={() => setremoveImage} src={values.displayMedia[0]} alt="" />
                                <br />
                              </SimpleDiv>
                            ) : null}
                            {values.displayMedia[1] ? (
                              <SimpleDiv>
                                <ShowImage ind={1} setremoveImage={(i) => setremoveImage(i, setFieldValue, values)} src={values.displayMedia[1]} alt="" />{" "}
                              </SimpleDiv>
                            ) : null}
                          </div>

                          <IconsWrap>
                            {values.displayMedia[2] ? (
                              <SimpleDiv>
                                <ShowImage ind={2} setremoveImage={(i) => setremoveImage(i, setFieldValue, values)} src={values.displayMedia[2]} alt="" />
                              </SimpleDiv>
                            ) : null}
                          </IconsWrap>
                        </IconsWrap>
                      ) : (
                        <>
                          <IconsWrap>
                            {values.displayMedia[0] ? (
                              <SimpleDiv>
                                <ShowImage ind={0} setremoveImage={(i) => setremoveImage(i, setFieldValue, values)} src={values.displayMedia[0]} alt="" />
                                <br />
                              </SimpleDiv>
                            ) : null}
                            {values.displayMedia[1] ? (
                              <SimpleDiv>
                                <ShowImage ind={1} setremoveImage={(i) => setremoveImage(i, setFieldValue, values)} src={values.displayMedia[1]} alt="" />
                                <br />
                              </SimpleDiv>
                            ) : null}
                          </IconsWrap>

                          <IconsWrap>
                            {values.displayMedia[2] ? (
                              <SimpleDiv>
                                <ShowImage ind={2} setremoveImage={(i) => setremoveImage(i, setFieldValue, values)} src={values.displayMedia[2]} alt="" />
                                <br />
                              </SimpleDiv>
                            ) : null}
                            {values.displayMedia[3] ? (
                              <SimpleDiv>
                                <ShowImage ind={3} setremoveImage={(i) => setremoveImage(i, setFieldValue, values)} src={values.displayMedia[3]} alt="" />
                              </SimpleDiv>
                            ) : null}
                          </IconsWrap>
                        </>
                      )
                    ) : values.addMedia ? (
                      <CustomIframe src={srcLink} id="tutorial" frameBorder="0" allow="autoplay; encrypted-media" title="video"></CustomIframe>
                    ) : null}
                  </>
                ) : null}

                <ButtonWrapPrimary>
                  <PrimaryButton text="Preview" inverse={true} onClick={handlePreview} colors="#2546EB" border="1px solid #2546EB" disabled={buttonDisabled || !values.budget || !values.name || !values.text} />
                </ButtonWrapPrimary>
              </RightSec>
            </Wrapper>
            <PreviewModal
              open={open}
              setOpen={setOpen}
              Text={values.text + " #hashbuzz #TestNet"}
              buttonTags={buttonTags}
              reply={values.reply}
              tokenId={values.selectedToken}
              retweet={values.retweet}
              type={values.type}
              like={values.like}
              selectedToken={values.selectedToken}
              follow={values.follow}
              srcLink={srcLink}
              name={values.name}
              media={values.media}
              displayMedia={values.displayMedia}
              isYoutube={values.isYoutube}
              videoTitle={videoTitle}
              addMedia={values.addMedia}
              budget={values.budget}
              quote={values.quote}
            />
          </Form>
        )}
      </Formik>
    </ContainerStyled>
  );
};

export default TemplatePage;
