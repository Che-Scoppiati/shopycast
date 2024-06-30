"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Link from "next/link";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

export const Faq = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const opts = {
    height: height * 0.7,
    width: width * 0.8,
    playerVars: {
      autoplay: 0,
    },
  };
  const onReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl">FAQ</h1>
      <Accordion defaultExpandedKeys={["api-key"]} className="px-0">
        <AccordionItem
          key="api-key"
          aria-label="api-key"
          title="How to generate your Shopify Store API key"
          className="bg-zinc-950 p-6 outline outline-1 outline-zinc-700 rounded-xl"
          classNames={{
            title: "text-xl",
            trigger: "p-0",
            content: "pt-6 pb-0",
          }}
        >
          <div className="flex flex-col justify-between gap-4">
            <div>
              <ol className="list list-outside list-decimal text-xl" style={{}}>
                <li className="mb-2">
                  1. Install the{" "}
                  <Link
                    href="https://apps.shopify.com/headless"
                    target="_blank"
                    className="text-primary-light underline"
                  >
                    Headless App
                  </Link>{" "}
                  for your Shopify store
                </li>
                <li className="mb-2">
                  2. Click <b>Create storefront</b>
                </li>
                <li className="mb-2">
                  3. Click <b>Manage Storefront API</b>
                </li>
                <li>
                  4. Copy your <b>Private Access Token</b>
                </li>
              </ol>
            </div>
            <div className="video items-center flex justify-center">
              {width > 0 ? (
                <YouTube
                  videoId="q5egaoZMpXs"
                  opts={opts}
                  onReady={onReady}
                  iframeClassName="rounded-3xl"
                />
              ) : null}
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
