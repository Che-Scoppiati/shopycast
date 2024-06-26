import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import CreateFrame from "./CreateFrame";

export const CreateShowcaseModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button className="h-auto bg-success" onPress={onOpen}>
        Create Showcase
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
      >
        <ModalContent className="bg-zinc-900">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl flex flex-col gap-1">
                Create Showcase
              </ModalHeader>
              <ModalBody className="max-h-[500px] overflow-y-auto">
                <CreateFrame />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
