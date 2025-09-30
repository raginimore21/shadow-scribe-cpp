import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from './FileUpload';
import { Download, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SteganographyEncoder = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [encodedImageUrl, setEncodedImageUrl] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  const handleFileSelect = (file: File) => {
    setOriginalImage(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setEncodedImageUrl('');
  };

  const encodeMessage = async () => {
    if (!originalImage || !message.trim()) return;

    setIsProcessing(true);
    
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

        // Add delimiter to message
        const messageWithDelimiter = message + '###END###';
        const binaryMessage = messageWithDelimiter.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('');

        let messageIndex = 0;
        
        // Encode message in LSB of red channel
        for (let i = 0; i < data.length && messageIndex < binaryMessage.length; i += 4) {
          if (messageIndex < binaryMessage.length) {
            // Modify LSB of red channel
            data[i] = (data[i] & 0xFE) | parseInt(binaryMessage[messageIndex]);
            messageIndex++;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setEncodedImageUrl(url);
          }
          setIsProcessing(false);
        }, 'image/png');
      };

      img.src = originalImageUrl;
    } catch (error) {
      console.error('Encoding error:', error);
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!encodedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = encodedImageUrl;
    link.download = 'encoded_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="gradient-card border-border cyber-glow-secondary">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Hide Message in Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload 
          onFileSelect={handleFileSelect}
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] }}
        />
        
        {originalImageUrl && (
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your secret message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24 bg-muted border-border focus:border-primary"
            />
            
            <Button 
              onClick={encodeMessage}
              disabled={!message.trim() || isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cyber-glow"
            >
              {isProcessing ? 'Encoding...' : 'Hide Message'}
            </Button>
          </div>
        )}

        {(originalImageUrl || encodedImageUrl) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="border-border hover:border-primary"
              >
                {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showOriginal ? 'Show Encoded' : 'Show Original'}
              </Button>
              
              {encodedImageUrl && (
                <Button
                  onClick={downloadImage}
                  size="sm"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
            
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <img
                src={showOriginal ? originalImageUrl : encodedImageUrl || originalImageUrl}
                alt={showOriginal ? "Original" : "Encoded"}
                className="max-w-full h-auto rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {showOriginal ? 'Original Image' : 'Encoded Image (with hidden message)'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};