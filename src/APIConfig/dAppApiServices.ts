import axios, { Method } from "axios";
import { useCookies } from "react-cookie";
import { dAppApiURL, getCookie } from "../Utilities/Constant";

interface APIProps {
  method: Method;
  url: string;
  data?: any;
}

export const useDappAPICall = () => {
  const [cookies] = useCookies(["token"]);

  const dAppAPICall = async (props: APIProps) => {
    const token = getCookie("token");
    const { method, url, data } = props;
    const request = await axios({
      method,
      url: dAppApiURL+"/api/" + url,
      data,
      headers: {
        Authorization: `Token ${cookies.token ?? token}`,
        "Content-type": "application/json",
      },
    });
    return request.data;
  };

  const dAppAuthAPICall = async (props: APIProps) => {
    const { method, url , data } = props;
    const token = getCookie("token");
    const request = await axios({
      method,
      url: dAppApiURL+"/auth/" + url,
      data,
      headers: {
        Authorization: `Token ${cookies.token ?? token}`,
        "Content-type": "application/json",
      },
    });
    return request.data;
  };

  return { dAppAPICall , dAppAuthAPICall };
};
