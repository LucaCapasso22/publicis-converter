import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Settings, Download, Loader2 } from 'lucide-react'

export interface ImageConfig {
  width: number
  height: number
  quality: number
  format: string
  maintainAspectRatio: boolean
}

interface ImageSettingsProps {
  originalImage: File
  config: ImageConfig
  onConfigChange: (config: ImageConfig) => void
  onProcess: () => void
  isProcessing: boolean
}

export function ImageSettings({
  originalImage,
  config,
  onConfigChange,
  onProcess,
  isProcessing,
}: ImageSettingsProps) {
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  useState(() => {
    const img = new Image()
    img.onload = () => {
      setOriginalDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
      if (!config.width || !config.height) {
        onConfigChange({
          ...config,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
    }
    img.src = URL.createObjectURL(originalImage)
  })

  const handleDimensionChange = (
    dimension: 'width' | 'height',
    value: number
  ) => {
    const newConfig = { ...config, [dimension]: value }

    if (config.maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      if (dimension === 'width') {
        newConfig.height = Math.round(value / aspectRatio)
      } else {
        newConfig.width = Math.round(value * aspectRatio)
      }
    }

    onConfigChange(newConfig)
  }

  const presetSizes = [
    { name: 'Squared', width: 800, height: 800 },
    { name: 'Desktop Portrait', width: 1920, height: 1080 },
    { name: 'Desktop Smaller Portrait', width: 1280, height: 720 },
    { name: 'Mobile Portrait', width: 810, height: 1440 },
  ]

  return (
    <div
      className="space-y-6 animate-fade-in-up"
      style={{ animationDelay: '0.1s' }}
    >
      <Card className="glass-effect shadow-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Impostazioni Immagine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Sizes */}
          <div className="space-y-2">
            <Label>Dimensioni Predefinite</Label>
            <Select
              onValueChange={(value) => {
                const preset = presetSizes.find((p) => p.name === value)
                if (preset) {
                  onConfigChange({
                    ...config,
                    width: preset.width,
                    height: preset.height,
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una dimensione predefinita" />
              </SelectTrigger>
              <SelectContent>
                {presetSizes.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name} ({preset.width}×{preset.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Larghezza (px)</Label>
              <Input
                type="number"
                value={config.width}
                onChange={(e) =>
                  handleDimensionChange('width', parseInt(e.target.value) || 0)
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Altezza (px)</Label>
              <Input
                type="number"
                value={config.height}
                onChange={(e) =>
                  handleDimensionChange('height', parseInt(e.target.value) || 0)
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Maintain Aspect Ratio */}
          <div className="flex items-center justify-between">
            <Label>Mantieni proporzioni</Label>
            <Switch
              checked={config.maintainAspectRatio}
              onCheckedChange={(checked) =>
                onConfigChange({ ...config, maintainAspectRatio: checked })
              }
            />
          </div>

          {/* Quality Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Qualità ({config.quality}%)</Label>
              <span className="text-sm text-muted-foreground">
                {config.quality >= 90
                  ? 'Eccellente'
                  : config.quality >= 70
                  ? 'Buona'
                  : config.quality >= 50
                  ? 'Media'
                  : 'Bassa'}
              </span>
            </div>
            <Slider
              value={[config.quality]}
              onValueChange={(value) =>
                onConfigChange({ ...config, quality: value[0] })
              }
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Formato di Output</Label>
            <Select
              value={config.format}
              onValueChange={(value) =>
                onConfigChange({ ...config, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Original Image Info */}
          {originalDimensions && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-1">
              <p className="text-sm font-medium">Immagine Originale:</p>
              <p className="text-xs text-muted-foreground">
                {originalDimensions.width}×{originalDimensions.height}px •{' '}
                {(originalImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Button */}
      <Button
        onClick={onProcess}
        disabled={isProcessing}
        className="w-full gradient-primary hover:opacity-90 transition-opacity py-6 text-lg font-medium shadow-modern"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Elaborazione...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Elabora e Scarica
          </>
        )}
      </Button>
    </div>
  )
}
