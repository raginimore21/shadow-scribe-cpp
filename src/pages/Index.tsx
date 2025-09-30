import { SteganographyEncoder } from '@/components/SteganographyEncoder';
import { SteganographyDecoder } from '@/components/SteganographyDecoder';
import { Shield, Eye, Unlock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 cyber-glow">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">SteganoCrypt</h1>
              <p className="text-sm text-muted-foreground">Image Steganography Tool</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold gradient-cyber bg-clip-text text-transparent">
              Hide & Extract Messages in Images
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Use advanced LSB steganography to securely hide text messages within image files.
              Perfect for secure communication and data protection.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-primary">Hide Messages</h3>
              </div>
              <SteganographyEncoder />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Unlock className="w-6 h-6 text-secondary" />
                <h3 className="text-xl font-semibold text-secondary">Extract Messages</h3>
              </div>
              <SteganographyDecoder />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 p-6 bg-muted/20 border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-3">How it works:</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-primary mb-2">1. LSB Encoding</h4>
                <p>Modifies the least significant bits of image pixels to embed your message without visible changes.</p>
              </div>
              <div>
                <h4 className="font-medium text-secondary mb-2">2. Secure Storage</h4>
                <p>Messages are stored within the image file itself, making them undetectable to casual observation.</p>
              </div>
              <div>
                <h4 className="font-medium text-accent mb-2">3. Perfect Extraction</h4>
                <p>Retrieve your hidden messages by analyzing the modified pixel data using the same algorithm.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;