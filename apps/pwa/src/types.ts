export type ExcelSettings = {
  zoneA: string;
  zoneB: string;
  recipients: string;
};

export type PieceRecord = {
  id: string;
  partNumber: string;
  serialNumber: string;
  orderNumber: string;
  designation: string;
  comment: string;
  currentLocation: string;
  initialLocation: string;
  lastUpdated: string;
};
