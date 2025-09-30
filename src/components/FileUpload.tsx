import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  className?: string;
}

export const FileUpload = ({ onFileSelect, accept = { 'image/*': [] }, className }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
        "hover:border-primary hover:bg-muted/20 cyber-glow-secondary",
        isDragActive && "border-primary bg-muted/30 cyber-glow",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Upload className="w-12 h-12 text-primary animate-pulse" />
        ) : (
          <Image className="w-12 h-12 text-muted-foreground" />
        )}
        <div>
          <p className="text-lg font-medium text-foreground">
            {isDragActive ? 'Drop the image here' : 'Upload Image'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop or click to select
          </p>
        </div>
      </div>
    </div>
  );
};