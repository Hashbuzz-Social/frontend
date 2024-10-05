import { Link, Stack, Typography } from "@mui/material";
import * as SC from "./styled";

const LandingPageContent = () => {
  return (
    <Stack sx={{ color: "rgb(255, 255, 255)" }} spacing={2}>
      <Typography variant="subtitle1">
        Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized Xposts. By leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. Additionally, hashbuzz drives
        authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.
      </Typography>

      <Typography>In this proof of concept, campaigners can run Xpost promos and reward their dedicated influencers with either HBAR or from a selection of whitelisted fungible HTS tokens.</Typography>

      <Typography>Our goal is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.</Typography>
      <Typography component={"div"}>
        <SC.StyledText>
          Ready to get started?
          <div>
            * Learn how to launch your very first promo [{" "}
            <Typography component={Link} style={{ color: "red" }} target="_blank" href="https://www.youtube.com/watch?v=e0cv-B9aWTE&t=2s">
              here
            </Typography>
            ].
          </div>
          <div>
            * To request the whitelisting of your token, simply submit a request [
            <Typography component={Link} style={{ color: "red" }} href={"https://about.hashbuzz.social/whitelist-token"}>
              here
            </Typography>
            ].
          </div>
          <div>
            * Stay in the loop with our latest updates and announcements by following us on{" "}
            <Typography component={Link} href={"https://x.com/hbuzzs"} style={{ color: "red" }}>
              X
            </Typography>{" "}
            -{" "}
            <Typography component={Link} href={"https://discord.gg/6Yrg4u8bvB"} target="_blank" style={{ color: "red" }}>
              Discord
            </Typography>
          </div>
          <div>
            * Read our terms and conditions, and privacy policy [
            <Typography component={Link} style={{ color: "red" }} href={"/#"}>
              here
            </Typography>
            ].
          </div>
        </SC.StyledText>
      </Typography>
      <Typography>Join us in revolutionizing the way we share and validate information on social media.</Typography>
    </Stack>
  );
};
export default LandingPageContent;
