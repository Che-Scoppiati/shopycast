import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { IoInformationCircleOutline, IoCloseOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

interface UpdateShopModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
}

export const UpdateShopModal: React.FC<UpdateShopModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
}) => {
  const [shopifyName, setShopifyName] = useState<string>("");
  const [shopifyApiKey, setShopifyApiKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [secretName, setSecretName] = useState<string>("");
  const [secretValue, setSecretValue] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);

  const {
    isFetching: isLoadingEdit,
    error: errorEdit,
    data: dataEdit,
  } = useQuery({
    queryKey: [`apiKey`],
    queryFn: () =>
      fetch(`/api/secret/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secretName, secretValue }),
      }).then((res) => res.json()),
    enabled: submit,
  });

  const handleSubmit = () => {
    setSubmit(true);
    if (!shopifyName || !shopifyApiKey) {
      setErrorMessage("Please fill in all fields");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } else {
      setSubmit(true);
      setTimeout(() => {
        onClose();
      }, 5000);
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
              <div className="flex flex-col gap-2">
                <Input
                  autoFocus
                  label="Your Api Key"
                  placeholder="Enter your Shopify Api-Key"
                  required
                  value={shopifyApiKey}
                  onChange={(e) => setShopifyApiKey(e.target.value)}
                />
                <div className="flex gap-1 text-white items-center text-center">
                  <IoInformationCircleOutline />
                  <p>How to get your shopify api key</p>
                </div>
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
