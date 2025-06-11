
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ProbeResult {
  ports: string[];
  security: string;
  blocked: boolean;
  services: string[];
  vulnerabilities: string[];
}

interface DeviceProbingProps {
  deviceId: string;
  probeCommand: () => ProbeResult;
  onClose?: () => void;
}

export const DeviceProbing: React.FC<DeviceProbingProps> = ({
  deviceId,
  probeCommand,
  onClose
}) => {
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<ProbeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProbe = async () => {
    setIsProbing(true);
    setError(null);
    setProbeResult(null);

    try {
      // Simulate probing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = probeCommand();
      setProbeResult(result);
    } catch (err) {
      setError('Probe failed: ' + (err as Error).message);
    } finally {
      setIsProbing(false);
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSecurityIcon = (security: string) => {
    switch (security.toLowerCase()) {
      case 'low': return <CheckCircle size={16} className="text-green-400" />;
      case 'medium': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'high': return <Shield size={16} className="text-red-400" />;
      default: return <Search size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-black border border-matrix-green/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-matrix-cyan flex items-center gap-2">
          <Search size={20} />
          Device Probe: {deviceId}
        </h3>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-matrix-green hover:bg-matrix-green/20"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {!probeResult && !isProbing && (
        <div className="text-center py-8">
          <Search size={48} className="text-matrix-green/50 mx-auto mb-4" />
          <p className="text-matrix-green/70 mb-4">
            Ready to probe device {deviceId}
          </p>
          <Button
            onClick={handleProbe}
            className="bg-matrix-green/20 border-matrix-green text-matrix-green hover:bg-matrix-green/30"
            variant="outline"
          >
            <Search size={16} className="mr-2" />
            Start Probe
          </Button>
        </div>
      )}

      {isProbing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-matrix-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-matrix-green animate-pulse">
            Probing device... Scanning ports and services...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded p-4 mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} />
            <span className="font-semibold">Probe Error</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
          <Button
            onClick={handleProbe}
            variant="outline"
            className="mt-3 border-red-500 text-red-400 hover:bg-red-500/20"
          >
            Retry Probe
          </Button>
        </div>
      )}

      {probeResult && (
        <div className="space-y-4">
          {/* Security Level */}
          <div className="bg-gray-900/50 border border-matrix-green/20 rounded p-4">
            <h4 className="font-semibold text-matrix-green mb-2 flex items-center gap-2">
              {getSecurityIcon(probeResult.security)}
              Security Level
            </h4>
            <div className={`font-bold ${getSecurityColor(probeResult.security)}`}>
              {probeResult.security.toUpperCase()}
            </div>
            {probeResult.blocked && (
              <div className="text-red-400 mt-2 flex items-center gap-2">
                <X size={16} />
                Probe Blocked - Limited Information
              </div>
            )}
          </div>

          {/* Open Ports */}
          <div className="bg-gray-900/50 border border-matrix-green/20 rounded p-4">
            <h4 className="font-semibold text-matrix-green mb-2">Open Ports</h4>
            {probeResult.ports.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {probeResult.ports.map((port, index) => (
                  <div
                    key={index}
                    className="bg-black/50 border border-matrix-green/30 rounded px-2 py-1 text-sm text-matrix-green text-center"
                  >
                    {port}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-matrix-green/70">No open ports detected</p>
            )}
          </div>

          {/* Services */}
          {probeResult.services.length > 0 && (
            <div className="bg-gray-900/50 border border-matrix-green/20 rounded p-4">
              <h4 className="font-semibold text-matrix-green mb-2">Running Services</h4>
              <div className="space-y-1">
                {probeResult.services.map((service, index) => (
                  <div
                    key={index}
                    className="text-sm text-matrix-green bg-black/30 rounded px-2 py-1"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vulnerabilities */}
          {probeResult.vulnerabilities.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
              <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Potential Vulnerabilities
              </h4>
              <div className="space-y-1">
                {probeResult.vulnerabilities.map((vuln, index) => (
                  <div
                    key={index}
                    className="text-sm text-red-300 bg-black/30 rounded px-2 py-1"
                  >
                    {vuln}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleProbe}
            variant="outline"
            className="w-full border-matrix-green text-matrix-green hover:bg-matrix-green/20"
          >
            <Search size={16} className="mr-2" />
            Probe Again
          </Button>
        </div>
      )}
    </div>
  );
};
