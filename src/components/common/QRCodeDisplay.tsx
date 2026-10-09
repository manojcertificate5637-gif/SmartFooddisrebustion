import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  token: string;
  title?: string;
  subtitle?: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  token,
  title = 'Pickup Verification QR Code',
  subtitle = 'Present this QR code to the hotel dispatch staff upon pickup',
  size = 200,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    QRCode.toDataURL(token, {
      width: size,
      margin: 2,
      color: {
        dark: '#071c10',
        light: '#ffffff',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [token, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center flex flex-col items-center max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-1 text-emerald-800 font-bold text-sm">
        <QrCode className="w-4 h-4 text-emerald-600" />
        <span>{title}</span>
      </div>
      <p className="text-xs text-slate-500 mb-4">{subtitle}</p>

      {/* QR Display */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 shadow-inner flex items-center justify-center">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Pickup QR Code"
            className="w-48 h-48 rounded-lg shadow-2xs"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
            Generating Secure Token QR...
          </div>
        )}
      </div>

      {/* Token details */}
      <div className="mt-4 w-full bg-slate-100/80 rounded-lg p-2.5 border border-slate-200 text-left">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Opaque Verification Token
        </div>
        <div className="font-mono text-xs font-bold text-slate-800 break-all select-all mt-0.5">
          {token}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 w-full">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Token'}</span>
        </button>

        {dataUrl && (
          <a
            href={dataUrl}
            download={`FoodBridge-Pickup-${token}.png`}
            className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR</span>
          </a>
        )}
      </div>
    </div>
  );
};
