import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";

// is the user approved to be a member or not
export type State = {
  isApproved: boolean;
  isFollower: boolean;
};

export const frames = createFrames<State>({
  initialState: {
    isApproved: false,
    isFollower: false,
  },
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
