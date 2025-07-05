import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ExcelRow {
  [key: string]: any;
}

export default function PathEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ExcelRow[]>([]);
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [isProcessed, setIsProcessed] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convert to object format with proper headers
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).map((row: any[]) => {
          const obj: ExcelRow = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || "";
          });
          return obj;
        });
        
        setData(rows);
        setIsProcessed(false);
        
        toast({
          title: "File caricato!",
          description: `${rows.length} righe caricate dal file Excel.`,
        });
      } catch (error) {
        toast({
          title: "Errore",
          description: "Errore nel caricamento del file Excel.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsArrayBuffer(uploadedFile);
  };

  const processData = () => {
    if (!data.length || !fromPath || !toPath) return;

    const processedData = data.map((row) => {
      const originalKeys = Object.keys(row);
      
      // Create new row with fixed structure: NAME, LAST_MOD_DATE, PATH, VALUE
      const newRow: ExcelRow = {};
      
      // Column A: NAME (always keep)
      if (originalKeys[0]) newRow.NAME = row[originalKeys[0]];
      
      // Column B: LAST_MOD_DATE (always keep)  
      if (originalKeys[1]) newRow.LAST_MOD_DATE = row[originalKeys[1]];
      
      // Column C: PATH (process for replacement)
      if (originalKeys[2] && row[originalKeys[2]] && typeof row[originalKeys[2]] === "string") {
        newRow.PATH = (row[originalKeys[2]] as string).replace(fromPath, toPath);
      } else if (originalKeys[2]) {
        newRow.PATH = row[originalKeys[2]];
      }
      
      // Column D: VALUE
      // If column E exists (translations), use E content and rename to VALUE
      // Otherwise, keep original column D content
      if (originalKeys[4]) {
        // Column E exists - use its content as VALUE
        newRow.VALUE = row[originalKeys[4]];
      } else if (originalKeys[3]) {
        // No column E - use original column D
        newRow.VALUE = row[originalKeys[3]];
      }
      
      return newRow;
    });

    setData(processedData);
    setIsProcessed(true);
    
    toast({
      title: "Elaborazione completata!",
      description: "I percorsi sono stati modificati e le colonne riorganizzate.",
    });
  };

  const downloadFile = () => {
    if (!data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modified Data");
    
    const fileName = `modified_${file?.name || 'data.xlsx'}`;
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: "Download completato!",
      description: "Il file modificato è stato scaricato.",
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="gradient-text">Path Editor</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Modifica i percorsi nei file Excel e riorganizza le colonne
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <Card className="glass-effect shadow-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Carica File Excel
            </CardTitle>
            <CardDescription>
              Seleziona un file Excel con colonne PATH (C), VALUE (D) e traduzione (E)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Carica
              </Button>
            </div>
            {file && (
              <p className="mt-2 text-sm text-muted-foreground">
                File caricato: {file.name} ({data.length} righe)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Path Configuration */}
        {data.length > 0 && (
          <Card className="glass-effect shadow-modern">
            <CardHeader>
              <CardTitle>Configurazione Percorsi</CardTitle>
              <CardDescription>
                Specifica il percorso da sostituire e il nuovo percorso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Percorso da sostituire
                  </label>
                  <Input
                    placeholder="/global/en"
                    value={fromPath}
                    onChange={(e) => setFromPath(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Nuovo percorso
                  </label>
                  <Input
                    placeholder="/it/it"
                    value={toPath}
                    onChange={(e) => setToPath(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={processData}
                disabled={!fromPath || !toPath || isProcessed}
                className="w-full gradient-primary text-white"
              >
                Elabora Dati
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Download */}
        {isProcessed && (
          <Card className="glass-effect shadow-modern">
            <CardHeader>
              <CardTitle>Download File Modificato</CardTitle>
              <CardDescription>
                Il file è stato elaborato e può essere scaricato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={downloadFile}
                className="w-full gradient-primary text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Scarica File Modificato
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        {data.length > 0 && (
          <Card className="glass-effect shadow-modern">
            <CardHeader>
              <CardTitle>Anteprima Dati</CardTitle>
              <CardDescription>
                Prime 5 righe del file caricato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(data[0] || {}).map((key) => (
                        <th key={key} className="text-left p-2 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="p-2 text-muted-foreground">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}