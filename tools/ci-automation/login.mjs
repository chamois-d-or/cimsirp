import axios from "axios";
import * as cookie from 'cookie';

// File called from the cypress setup in cypress-setup.sh
const [EMAIL, PASSWORD] = [process.env.EMAIL,process.env.PASSWORD];
const CYPRESS_URL = "prismic.io";

export default async function getAuth(){
  const authToken = axios
  .post(`https://${CYPRESS_URL}/authentication/signin`, {
    email: EMAIL,
    password: PASSWORD,
  })
  .then((response) => {
    const cookies = response.headers["set-cookie"].join("; ");
    const token = cookie.parse(cookies)["prismic-auth"]
    return token
  })
  .catch((e) => {
    console.error("[AUTH]: ", e.message);
    console.error(e);
  });
  return authToken
}