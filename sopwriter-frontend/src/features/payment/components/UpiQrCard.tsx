interface UpiQrCardProps {
    amount?: number;
}

export default function UpiQrCard({ amount }: UpiQrCardProps) {
    const upiUrl = import.meta.env.VITE_UPI_QR_URL || "/qr.jpg";

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-border/40 max-w-xs mx-auto w-full">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4 relative">
                {/* Placeholder if image fails or is missing in dev */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    QR Code
                </div>
                <img
                    src={upiUrl}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain relative z-10"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>
            <p className="font-medium text-center text-gray-900">Scan to Pay</p>

            {amount ? (
                <div className="text-center mt-4 w-full p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
                    <p className="text-xs uppercase font-bold tracking-wider text-green-600/80 mb-0.5">Total Amount</p>
                    <p className="text-3xl font-bold text-green-700">₹{amount.toLocaleString('en-IN')}</p>
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center mt-1">Accepts all UPI apps</p>
            )}

            <div className="flex gap-4 mt-4 opacity-70 grayscale">
                {/* Simple text placeholders or icons for GPay/PhonePe could go here if wanted, but text is fine */}
            </div>
        </div>
    );
}
