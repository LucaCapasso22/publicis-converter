import { useState } from 'react'
import { Settings } from 'lucide-react'
import { ImageUpload } from './ImageUpload'
import { ImageSettings, ImageConfig } from './ImageSettings'
import { toast } from '@/hooks/use-toast'

export function ImageConverter() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [config, setConfig] = useState<ImageConfig>({
    width: 0,
    height: 0,
    quality: 80,
    format: 'jpeg',
    maintainAspectRatio: true,
  })

  const handleImageUpload = (file: File) => {
    setUploadedImage(file)
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setConfig({
      width: 0,
      height: 0,
      quality: 80,
      format: 'jpeg',
      maintainAspectRatio: true,
    })
  }

  const processImage = async () => {
    if (!uploadedImage) return

    setIsProcessing(true)

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = config.width
        canvas.height = config.height

        ctx?.drawImage(img, 0, 0, config.width, config.height)

        const mimeType = `image/${config.format}`
        const quality = config.quality / 100

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url

              const extension = config.format === 'jpeg' ? 'jpg' : config.format
              const originalName = uploadedImage.name.split('.')[0]
              link.download = `${originalName}_converted.${extension}`

              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)

              URL.revokeObjectURL(url)

              const originalSize = (uploadedImage.size / 1024 / 1024).toFixed(2)
              const newSize = (blob.size / 1024 / 1024).toFixed(2)
              const savings = (
                (1 - blob.size / uploadedImage.size) *
                100
              ).toFixed(1)

              toast({
                title: 'Immagine elaborata con successo!',
                description: `Dimensione originale: ${originalSize}MB → Nuova dimensione: ${newSize}MB (${savings}% di riduzione)`,
              })

              setTimeout(() => {
                toast({
                  title: 'File eliminato automaticamente',
                  description:
                    'Per la tua privacy, il file è stato rimosso dai nostri server.',
                })
              }, 30000)
            }
            setIsProcessing(false)
          },
          mimeType,
          quality
        )
      }

      img.src = URL.createObjectURL(uploadedImage)
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        variant: 'destructive',
        title: "Errore durante l'elaborazione",
        description:
          "Si è verificato un errore durante l'elaborazione dell'immagine.",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <ImageUpload
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
            onRemoveImage={handleRemoveImage}
          />
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          {uploadedImage ? (
            <ImageSettings
              originalImage={uploadedImage}
              config={config}
              onConfigChange={setConfig}
              onProcess={processImage}
              isProcessing={isProcessing}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center space-y-4 animate-pulse-slow">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Carica un'immagine per iniziare
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Le opzioni di elaborazione appariranno qui
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
