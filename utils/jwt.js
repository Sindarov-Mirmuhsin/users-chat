import JWT from "jsonwebtoken";
const secretKey = "private";

export default {
  sign: (payload) => JWT.sign(payload, secretKey),
  verify: (token) => JWT.verify(token, secretKey),
};
