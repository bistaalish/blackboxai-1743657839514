export interface OLTDevice {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  ip: string;
  model?: string;
  location?: string;
  lastSeen?: string;
}

export interface ONUDevice {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  connectedTo: string;
  signalStrength?: number;
  macAddress?: string;
}