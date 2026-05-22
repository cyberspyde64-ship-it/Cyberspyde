import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
  coursePrice: number;
  studentEmail: string;
  onPaymentComplete: (transactionId: string) => void;
}

export default function PaymentModal({
  open,
  onClose,
  courseTitle,
  coursePrice,
  studentEmail,
  onPaymentComplete,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const upiId = '9080335749@fbl';
  const upiString = `upi://pay?pa=${upiId}&pn=CyberSpyde&am=${coursePrice}&tn=Course%20Enrollment%20-%20${encodeURIComponent(courseTitle)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirm = async () => {
    if (!transactionId.trim()) {
      alert('Please enter transaction ID');
      return;
    }
    setSubmitting(true);
    try {
      // Send payment notification to admin
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-payment-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_email: studentEmail,
          student_name: studentEmail.split('@')[0],
          course_title: courseTitle,
          payment_amount: coursePrice,
          transaction_id: transactionId,
          upi_id: upiId,
        }),
      });

      onPaymentComplete(transactionId);
      setTransactionId('');
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Payment Required</h2>
            <p className="text-cyan-100 text-sm">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-cyan-500/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Price */}
          <div className="text-center py-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-cyan-400">₹{coursePrice}</p>
          </div>

          {/* QR Code */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400 font-medium">Scan to Pay with UPI</p>
            <div className="bg-white p-4 rounded-xl mx-auto w-fit">
              <QRCodeSVG value={upiString} size={200} level="H" includeMargin={true} />
            </div>
            <p className="text-xs text-gray-500">Use any UPI app: Google Pay, PhonePe, Paytm, etc.</p>
          </div>

          {/* Manual UPI ID */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-medium">Or enter UPI ID manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={upiId}
                disabled
                className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white cursor-text"
              />
              <button
                onClick={handleCopyUPI}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-cyan-600 text-white hover:bg-cyan-500'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 inline mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 inline mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Transaction ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
              placeholder="Enter UPI transaction ID (e.g., 123456789ABC)"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500">Check your UPI app for transaction reference number</p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handlePaymentConfirm}
            disabled={submitting || !transactionId.trim()}
            className="w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Confirm Payment'}
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center pt-2">
            A confirmation email will be sent to {studentEmail}
          </p>
        </div>
      </div>
    </div>
  );
}
