"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Link from "next/link";
import YouTube from "react-youtube";

export const Faq = () => {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };
  const onReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };
  return (
    <div>
      <h1>Faq</h1>
      <Accordion defaultExpandedKeys={["api-key"]}>
        <AccordionItem
          key="api-key"
          aria-label="api-key"
          title="How to generate your Shopify Store API key"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <ol className="list list-outside list-decimal">
                <li>
                  1. Install the{" "}
                  <Link
                    href="https://apps.shopify.com/headless"
                    target="_blank"
                    className="text-primary underline"
                  >
                    Headless App
                  </Link>{" "}
                  for your Shopify store
                </li>
                <li>
                  2. Click <b>Create storefront</b>
                </li>
                <li>
                  3. Click <b>Manage Storefront API</b>
                </li>
                <li>
                  4. Copy your <b>Private Access Token</b>
                </li>
              </ol>
            </div>
            <div className="video-responsive">
              <YouTube videoId="q5egaoZMpXs" opts={opts} onReady={onReady} />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
