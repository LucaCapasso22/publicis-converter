import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
  uploadedImage: File | null
  onRemoveImage: () => void
}

export function ImageUpload({
  onImageUpload,
  uploadedImage,
  onRemoveImage,
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            variant: 'destructive',
            title: 'File troppo grande',
            description: 'La dimensione massima consentita è 10MB.',
          })
          return
        }

        onImageUpload(file)
        toast({
          title: 'Immagine caricata',
          description: `${file.name} è stato caricato con successo.`,
        })
      }
    },
    [onImageUpload]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneActive,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff'],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  })

  if (uploadedImage) {
    return (
      <Card className="p-6 glass-effect border-2 border-dashed border-primary/30 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Image className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">{uploadedImage.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemoveImage}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="aspect-video bg-muted/50 rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(uploadedImage)}
            alt="Uploaded image"
            className="w-full h-full object-contain"
          />
        </div>
      </Card>
    )
  }

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50 ${
        isDragActive || dropzoneActive
          ? 'border-primary bg-primary/5 scale-[0.98]'
          : 'border-muted-foreground/25'
      } animate-fade-in-up`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div
          className={`p-4 rounded-full transition-all duration-200 ${
            isDragActive || dropzoneActive ? 'gradient-primary' : 'bg-muted'
          }`}
        >
          <Upload
            className={`h-8 w-8 ${
              isDragActive || dropzoneActive
                ? 'text-white'
                : 'text-muted-foreground'
            }`}
          />
        </div>
        <div>
          <p className="text-lg font-medium mb-2">
            {isDragActive
              ? "Rilascia qui l'immagine"
              : 'Carica la tua immagine'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Trascina e rilascia un'immagine qui, o clicca per selezionare
          </p>
          <p className="text-xs text-muted-foreground">
            Supporta JPEG, PNG, WebP, GIF e altri formati • Max 10MB
          </p>
        </div>
        <Button className="gradient-primary hover:opacity-90 transition-opacity">
          Seleziona File
        </Button>
      </div>
    </Card>
  )
}
