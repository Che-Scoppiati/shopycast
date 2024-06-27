import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { IoInformationCircleOutline, IoCloseOutline } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@privy-io/react-auth";
import { AppContext } from "../providers";

interface UpdateShopModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  user: User | null;
}

export const UpdateShopModal: React.FC<UpdateShopModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  user,
}) => {
  const context = useContext(AppContext);

  const [shopifyName, setShopifyName] = useState<string>("");
  const [shopifyUrl, setShopifyUrl] = useState<string>("");
  const [shopifyApiKey, setShopifyApiKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const now = new Date();
  const secretName = `${shopifyName}-${user?.id}-${now.getTime()}`;

  const queryClient = useQueryClient();

  const validateShopUrl = (shopUrl: string) => {
    return shopUrl.startsWith("https://");
  };

  const validateApiKey = (apiKey: string) => {
    return apiKey.startsWith("shpat_");
  };

  const setError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!shopifyName || !shopifyUrl || !shopifyApiKey) {
      setError("Please fill in all fields");
    } else {
      if (!validateShopUrl(shopifyUrl)) {
        setError("Shop URL must start with 'https://'");
        return;
      }

      if (!validateApiKey(shopifyApiKey)) {
        setError("Shopify API key must start with 'shpat_'");
        return;
      }

      setIsLoading(true);

      try {
        // 1. Save to db the secret
        await queryClient.fetchQuery({
          queryKey: [`apiKey`],
          queryFn: () =>
            fetch(`/api/secret`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                secretName: secretName,
                secretValue: shopifyApiKey,
              }),
            }).then((res) => res.json()),
        });
        // 2. Save to db the shop
        let result = await queryClient.fetchQuery({
          queryKey: [`shop`],
          queryFn: () =>
            fetch(`/api/shops`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user?.id,
                shopName: shopifyName,
                shopUrl: shopifyUrl,
                secretName: secretName,
                secretValue: shopifyApiKey,
              }),
            }).then((res) => res.json()),
        });

        context?.setActiveShopId(result.shopId);
      } catch (error) {
        setError("An error occurred. Please try again.");
      }

      // 3. Close the modal
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setShopifyName("");
      setShopifyUrl("");
      setShopifyApiKey("");
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      closeButton={<></>}
      size="lg"
    >
      <ModalContent className="bg-zinc-900">
        {(onClose) => (
          <>
            <ModalHeader className="flex w-full justify-between items-center p-[1.25rem]">
              <p className="text-2xl leading-none">Add your Store details</p>
              <Button
                isIconOnly
                className="p-1 min-w-0 w-6 h-6 rounded-small bg-zinc-800"
                onPress={onClose}
              >
                <IoCloseOutline size={20} color="white" />
              </Button>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Shop Name"
                placeholder="Enter your Shopify Store name"
                required
                value={shopifyName}
                onChange={(e) => setShopifyName(e.target.value)}
              />
              <Input
                label="Shop URL"
                placeholder="Enter your Shopify Store URL"
                required
                value={shopifyUrl}
                onChange={(e) => setShopifyUrl(e.target.value)}
              />
              <div className="flex flex-col gap-4">
                <Input
                  autoFocus
                  label="Shopify API Key"
                  placeholder="Enter your Shopify API key"
                  required
                  value={shopifyApiKey}
                  onChange={(e) => setShopifyApiKey(e.target.value)}
                />
                <a
                  href="https://shopify-graphiql-app.shopifycloud.com/login"
                  target="_blank"
                  className="flex underline gap-1 text-white items-center text-center"
                >
                  <IoInformationCircleOutline />
                  <p>How to get your Shopify API key</p>
                </a>
              </div>
            </ModalBody>
            <ModalFooter className="p-[1.25rem] justify-between items-center">
              <div>
                <p className="text-red-500">{errorMessage ?? ""}</p>
              </div>
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={
                  shopifyName === "" ||
                  shopifyUrl === "" ||
                  shopifyApiKey === ""
                }
                isLoading={isLoading}
              >
                {!isLoading && "Submit"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
