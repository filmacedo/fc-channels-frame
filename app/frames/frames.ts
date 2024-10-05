import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
/* import { PassportResult } from "@/lib/talent-protocol";

export type Builder = {
  wallet: string;
  passport: PassportResult;
  builderScore: number;
  isHuman: boolean;
  basename: string;
}; */

export const frames = createFrames({
  /*initialState: {
    wallet: "",
    passport: {
      score: 0,
      passport_id: 0,
      human_checkmark: false,
      user: null,
      passport_profile: null,
      passport_socials: [],
      verified_wallets: [],
    },
    builderScore: 0,
    isHuman: false,
    basename: "",
  },*/
  basePath: "/frames",
  middleware: [
    farcasterHubContext({
      // remove if you aren't using @frames.js/debugger or you just don't want to use the debugger hub
      ...(process.env.NODE_ENV === "production"
        ? {}
        : {
            hubHttpUrl: "http://localhost:3010/hub",
          }),
    }),
  ],
});
