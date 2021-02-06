import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  console.log(res);
  res.cookie("jid", token, {
    httpOnly: true,
    sameSite: "lax",
  });
};
