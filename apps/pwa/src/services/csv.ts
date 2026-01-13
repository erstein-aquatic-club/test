import { ExcelSettings, PieceRecord } from '../types';

type CsvRow = Record<string, string>;

type ParsedCsv = {
  rows: CsvRow[];
  headers: string[];
};

const parseLine = (line: string, delimiter: string) => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((value) => value.trim());
};

const detectDelimiter = (line: string) => (line.includes(';') ? ';' : ',');

export const parseCsv = (content: string): ParsedCsv => {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { rows: [], headers: [] };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseLine(lines[0], delimiter).map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line, delimiter);
    return headers.reduce<CsvRow>((acc, header, index) => {
      acc[header] = values[index] ?? '';
      return acc;
    }, {});
  });

  return { rows, headers };
};

const normalizeText = (value: string | undefined) => (value ?? '').trim();

export const parsePiecesCsv = (content: string): PieceRecord[] => {
  const { rows } = parseCsv(content);
  return rows
    .map((row) => {
      const partNumber = normalizeText(row.PartNumber ?? row['Part Number']);
      const serialNumber = normalizeText(row.SerialNumber ?? row['Serial Number']);
      const orderNumber = normalizeText(row.OrderNumber ?? row['N° OT/OF'] ?? row.Order);
      const designation = normalizeText(row.Designation ?? row.Description);
      const comment = normalizeText(row.Comment ?? row.Commentaire);
      const currentLocation = normalizeText(row.CurrentLocation ?? row.EmplacementActuel ?? row.Location);
      const initialLocation = normalizeText(row.InitialLocation ?? row.EmplacementInitial ?? row.Initial);
      const lastUpdated = normalizeText(row.LastUpdated ?? row.DateMaj ?? row['Last Updated']);

      if (!partNumber && !serialNumber && !orderNumber) {
        return null;
      }

      return {
        id: crypto.randomUUID(),
        partNumber,
        serialNumber,
        orderNumber,
        designation,
        comment,
        currentLocation: currentLocation || 'Zone A',
        initialLocation: initialLocation || 'Zone A',
        lastUpdated: lastUpdated || new Date().toLocaleString('fr-FR'),
      } satisfies PieceRecord;
    })
    .filter((row): row is PieceRecord => row !== null);
};

export const parseSettingsCsv = (content: string): Partial<ExcelSettings> => {
  const { rows } = parseCsv(content);
  return rows.reduce<Partial<ExcelSettings>>((acc, row) => {
    const key = normalizeText(row.Key ?? row.Cle ?? row.Parametre).toLowerCase();
    const value = normalizeText(row.Value ?? row.Valeur ?? row.Donnee);
    if (!key) {
      return acc;
    }
    if (key === 'zonea') {
      acc.zoneA = value || 'Zone A';
    }
    if (key === 'zoneb') {
      acc.zoneB = value || 'Zone B';
    }
    if (key === 'recipients' || key === 'destinataires') {
      acc.recipients = value;
    }
    return acc;
  }, {});
};

const escapeCsvValue = (value: string) => {
  if (value.includes('"') || value.includes(',') || value.includes(';') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const buildPiecesCsv = (pieces: PieceRecord[]) => {
  const headers = [
    'PartNumber',
    'SerialNumber',
    'OrderNumber',
    'Designation',
    'Comment',
    'CurrentLocation',
    'InitialLocation',
    'LastUpdated',
  ];
  const rows = pieces.map((piece) => [
    piece.partNumber,
    piece.serialNumber,
    piece.orderNumber,
    piece.designation,
    piece.comment,
    piece.currentLocation,
    piece.initialLocation,
    piece.lastUpdated,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value ?? '')).join(';'))
    .join('\n');
};

export const buildSettingsCsv = (settings: ExcelSettings) => {
  const rows = [
    ['Key', 'Value'],
    ['ZoneA', settings.zoneA || 'Zone A'],
    ['ZoneB', settings.zoneB || 'Zone B'],
    ['Recipients', settings.recipients],
  ];

  return rows.map((row) => row.map((value) => escapeCsvValue(value ?? '')).join(';')).join('\n');
};

export const downloadCsv = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
