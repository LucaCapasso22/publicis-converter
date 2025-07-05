# Welcome to publicis Converter

This tool has been developed by Luca Capasso @ https://github.com/LucaCapasso22

# How does this tool work

**Path Editor – Excel File Management**
Secure Upload
The Excel file is processed entirely in your browser, using the XLSX.js library.
It’s never uploaded and is immediately converted to JSON for editing.

Smart Processing
Columns A to D (and optionally E) are auto-detected.
In the PATH column, only the specified part (e.g., /global/en) is replaced.
If column E (translations) exists:

Column D (VALUE) is removed.

Column E replaces it as the new D.

New column D is renamed to VALUE.

Final structure: NAME, LAST_MOD_DATE, PATH, VALUE

Direct Download
The new Excel file is generated in memory and downloaded instantly.
The original file is never modified.

Technologies:
FileReader API, XLSX.js, Blob, URL.createObjectURL

**Image Converter – Image Handling in Browser**
How it Works
Drag & Drop Upload + Preview
Preview images instantly without uploading.
File type is automatically validated.

In-Browser Editing via Canvas
Resize while keeping proportions, compress, and convert to JPEG, PNG, or WebP using HTML5 Canvas.

Privacy Controls

Temporary URLs are revoked after 30 seconds.

Browser memory handles and clears all temporary data.

Privacy & Security
Zero-Server Architecture: No backend, no database, no logs.

Browser-Native Tech: All processing uses built-in APIs (FileReader, Canvas, Blob, URL).

Ephemeral Data: Files are handled in RAM and deleted automatically—no data is ever stored.

"Your files are completely safe—because we never see them."
This is not a slogan. It’s a design decision:
No server, no storage, no tracking. 100% client-side.

Privacy isn’t optional—it’s the foundation of the system.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- XLSX.js
- HTML5 Canvas
- shadcn-ui
- Tailwind CSS
