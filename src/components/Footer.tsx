export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 Publicis Converter.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              I tuoi file vengono elaborati localmente e cancellati
              automaticamente per garantire la privacy aziendale.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              Created by Luca Capasso
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
