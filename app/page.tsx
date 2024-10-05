import { createExampleURL } from "@/lib/frames";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "macedo @ ETHRome 2024",
    other: {
      ...(await fetchMetadata(createExampleURL("/frames"))),
    },
  };
}

export default async function Home() {
  return <div>macedo @ ETHRome 2024</div>;
}
