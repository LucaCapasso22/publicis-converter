import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Copy, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type ConversionType = 'sentence' | 'upper' | 'lower'

export default function CaseConverter() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const { toast } = useToast()

  const stripFormatting = (text: string) => {
    // Rimuove la formattazione
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const convertText = (text: string, type: ConversionType) => {
    const cleanText = stripFormatting(text)

    switch (type) {
      case 'sentence':
        return cleanText
          .toLowerCase()
          .replace(/(^\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      case 'upper':
        return cleanText.toUpperCase()
      case 'lower':
        return cleanText.toLowerCase()
      default:
        return cleanText
    }
  }

  const handleTextChange = (text: string) => {
    setInputText(text)
    if (text.trim()) {
      setOutputText(convertText(text, 'sentence'))
    } else {
      setOutputText('')
    }
  }

  const handleConversion = (type: ConversionType) => {
    if (inputText.trim()) {
      setOutputText(convertText(inputText, type))
    }
  }

  const copyToClipboard = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText)
      toast({
        title: 'Testo copiato!',
        description: 'Il testo è stato copiato negli appunti.',
      })
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="gradient-text">Case Converter</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Converti il formato del testo rimuovendo automaticamente ogni
          formattazione
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="glass-effect shadow-modern">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Testo Originale
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="ml-2"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </CardTitle>
            <CardDescription>
              Incolla qui il tuo testo. La formattazione verrà rimossa
              automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Incolla qui il tuo testo..."
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="glass-effect shadow-modern">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Testo Convertito
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!outputText}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copia
              </Button>
            </CardTitle>
            <CardDescription>Il testo convertito apparirà qui</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={outputText}
              readOnly
              className="min-h-[200px] resize-none bg-muted/50"
              placeholder="Il testo convertito apparirà qui..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Conversion Options */}
      <Card className="mt-6 glass-effect shadow-modern">
        <CardHeader>
          <CardTitle>Opzioni di Conversione</CardTitle>
          <CardDescription>
            Scegli il formato desiderato per il tuo testo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleConversion('sentence')}
              disabled={!inputText.trim()}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              Prima lettera maiuscola
            </Button>
            <Button
              onClick={() => handleConversion('upper')}
              disabled={!inputText.trim()}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              TUTTO MAIUSCOLO
            </Button>
            <Button
              onClick={() => handleConversion('lower')}
              disabled={!inputText.trim()}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              tutto minuscolo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
