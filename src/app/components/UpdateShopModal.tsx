import React, { useState } from "react";
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
  const [shopifyName, setShopifyName] = useState<string>("");
  const [shopifyUrl, setShopifyUrl] = useState<string>("");
  const [shopifyApiKey, setShopifyApiKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const secretName = `${user?.id}-${shopifyName}`;

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!shopifyName || !shopifyUrl || !shopifyApiKey) {
      setErrorMessage("Please fill in all fields");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } else {
      // 1. Save to db the secret
      const data = await queryClient.fetchQuery({
        queryKey: [`apiKey`],
        queryFn: () =>
          fetch(`/api/secret/handle`, {
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
      const dataShop = await queryClient.fetchQuery({
        queryKey: [`apiKey`],
        queryFn: () =>
          fetch(`/api/shop`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user?.id,
              shopName: shopifyName,
              shopUrl: shopifyUrl,
              secretName: secretName,
            }),
          }).then((res) => res.json()),
      });

      // 3. Close the modal
      onClose();
    }
  };

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
              <p className="text-2xl leading-none">Add Api Key</p>
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
                label="Your Shop Name"
                placeholder="Enter your Shopify store name"
                required
                value={shopifyName}
                onChange={(e) => setShopifyName(e.target.value)}
              />
              <Input
                label="Your Shop URL"
                placeholder="Enter your Shopify Store URL"
                required
                value={shopifyUrl}
                onChange={(e) => setShopifyUrl(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <Input
                  autoFocus
                  label="Your Api Key"
                  placeholder="Enter your Shopify Api-Key"
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
                  <p>How to get your shopify api key</p>
                </a>
              </div>
              <div>
                <p className="text-red-500">{errorMessage ?? ""}</p>
              </div>
            </ModalBody>
            <ModalFooter className="p-[1.25rem]">
              <Button color="primary" onPress={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
