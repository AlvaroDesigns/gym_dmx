import { useState, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelToJson() {
  const [jsonData, setJsonData] = useState<any[]>([]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result) return;
      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Tomar la primera hoja
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir a JSON
      const json = XLSX.utils.sheet_to_json(sheet);
      setJsonData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Convertir XLSX a JSON</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
}
