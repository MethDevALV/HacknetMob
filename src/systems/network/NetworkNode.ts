
export interface NetworkNode {
  ip: string;
  hostname: string;
  type: string;
  security: string;
  os: string;
  discovered: boolean;
  compromised: boolean;
  ports: Array<{
    number: number;
    service: string;
    cracked: boolean;
  }>;
  services?: Array<{
    port: number;
    name: string;
    exploitRequired: string;
  }>;
  fileSystem: Map<string, Array<{
    name: string;
    type: 'file' | 'directory';
    content?: string;
    size: number;
    permissions: string;
    modified: string;
    encrypted?: boolean;
  }>>;
}
