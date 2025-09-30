import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from './FileUpload';
import { Unlock, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SteganographyDecoder = () => {
  const [encodedImage, setEncodedImage] = useState<File | null>(null);
  const [encodedImageUrl, setEncodedImageUrl] = useState<string>('');
  const [extractedMessage, setExtractedMessage] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setEncodedImage(file);
    const url = URL.createObjectURL(file);
    setEncodedImageUrl(url);
    setExtractedMessage('');
  };

  const extractMessage = async () => {
    if (!encodedImage) return;

    setIsExtracting(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let binaryMessage = '';
        
        // Extract LSB from red channel
        for (let i = 0; i < data.length; i += 4) {
          binaryMessage += (data[i] & 1).toString();
        }

        // Convert binary to text
        let extractedText = '';
        for (let i = 0; i < binaryMessage.length; i += 8) {
          const byte = binaryMessage.substr(i, 8);
          if (byte.length === 8) {
            const charCode = parseInt(byte, 2);
            if (charCode === 0) break; // Stop at null character
            extractedText += String.fromCharCode(charCode);
          }
        }

        // Look for delimiter
        const delimiterIndex = extractedText.indexOf('###END###');
        if (delimiterIndex !== -1) {
          setExtractedMessage(extractedText.substring(0, delimiterIndex));
          toast({
            title: "Message extracted successfully!",
            description: "Hidden message found in the image.",
          });
        } else {
          setExtractedMessage('No hidden message found or message corrupted.');
          toast({
            title: "No message found",
            description: "This image may not contain a hidden message.",
            variant: "destructive",
          });
        }
        
        setIsExtracting(false);
      };

      img.src = encodedImageUrl;
    } catch (error) {
      console.error('Extraction error:', error);
      setExtractedMessage('Error extracting message.');
      setIsExtracting(false);
      toast({
        title: "Extraction failed",
        description: "An error occurred while extracting the message.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!extractedMessage) return;
    
    try {
      await navigator.clipboard.writeText(extractedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="gradient-card border-border cyber-glow-secondary">
      <CardHeader>
        <CardTitle className="text-secondary flex items-center gap-2">
          <Unlock className="w-5 h-5" />
          Extract Hidden Message
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload 
          onFileSelect={handleFileSelect}
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] }}
        />
        
        {encodedImageUrl && (
          <div className="space-y-4">
            <Button 
              onClick={extractMessage}
              disabled={isExtracting}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground cyber-glow"
            >
              {isExtracting ? 'Extracting...' : 'Extract Message'}
            </Button>
            
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <img
                src={encodedImageUrl}
                alt="Image to decode"
                className="max-w-full h-auto rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Image to extract message from
              </p>
            </div>
          </div>
        )}

        {extractedMessage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Extracted Message:</h3>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="border-border hover:border-primary"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <p className="text-foreground whitespace-pre-wrap break-words">
                {extractedMessage}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};