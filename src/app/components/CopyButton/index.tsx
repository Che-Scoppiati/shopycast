import { Button, ButtonProps } from "@nextui-org/react";
import { useState } from "react";

interface CopyButtonProps extends ButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  ...props
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyButton = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Button
      size="md"
      color={`${copied ? "success" : "primary"}`}
      onClick={handleCopyButton}
      {...props}
    />
  );
};
