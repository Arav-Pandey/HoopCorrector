import { useRef } from "react";
import { RiVideoUploadLine } from "react-icons/ri";

interface Props {
  setVideoURL: React.Dispatch<React.SetStateAction<string>>;
}

export default function UploadButton({ setVideoURL }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click(); // opens file explorer
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
    }
  };

  return (
    <div>
      {/* Icon */}
      <RiVideoUploadLine
        size={40}
        onClick={handleIconClick}
        style={{ cursor: "pointer" }}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
