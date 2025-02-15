
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useAttachmentHandler = () => {
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setAttachmentPreview({
          type: 'image',
          url: previewUrl,
          name: file.name
        });
      }
    };
    input.click();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Coming Soon",
        description: "Voice recording feature will be available soon!",
      });
    }
  };

  const removeAttachment = () => {
    if (attachmentPreview?.url) {
      URL.revokeObjectURL(attachmentPreview.url);
    }
    setAttachmentPreview(null);
  };

  return {
    attachmentPreview,
    isRecording,
    handleAttachment,
    handleVoiceRecord,
    removeAttachment
  };
};
