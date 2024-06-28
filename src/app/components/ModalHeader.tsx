import {
  Button,
  ModalHeader as NextUIModalHeader,
  ModalHeaderProps,
} from "@nextui-org/react";
import { IoCloseOutline } from "react-icons/io5";

interface NewModalHeaderProps extends ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader: React.FC<NewModalHeaderProps> = ({
  title,
  onClose,
  ...props
}) => {
  return (
    <NextUIModalHeader
      className="flex w-full justify-between items-center p-[1.25rem]"
      {...props}
    >
      <p className="text-2xl leading-none">{title}</p>
      <Button
        isIconOnly
        className="p-1 min-w-0 w-6 h-6 rounded-small bg-zinc-800"
        onPress={onClose}
      >
        <IoCloseOutline size={20} color="white" />
      </Button>
    </NextUIModalHeader>
  );
};
