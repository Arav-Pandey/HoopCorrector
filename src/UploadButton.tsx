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
    <div className="flex items-center">
      {/* Icon */}
      <RiVideoUploadLine
        size={24}
        className="sm:w-10 sm:h-10 w-6 h-6 cursor-pointer hover:text-orange-400 transition"
        onClick={handleIconClick}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="video/*"
      />
    </div>
  );
}
