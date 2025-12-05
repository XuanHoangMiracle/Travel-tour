import { VNPay } from 'vnpay';

const VNP_SECRET = process.env.VNP_SECRET;
const VNP_TMNCODE = process.env.VNP_TMNCODE;

// ✅ Throw error nếu thiếu - KHÔNG có fallback
if (!VNP_SECRET || !VNP_TMNCODE) {
  console.error('❌❌❌ VNPay Configuration Error:');
  console.error('VNP_SECRET:', VNP_SECRET || 'MISSING');
  console.error('VNP_TMNCODE:', VNP_TMNCODE || 'MISSING');
  console.error('Please check your .env file!');
  throw new Error('Missing VNPay credentials in .env');
}

console.log('✅ VNPay Initializing with:', {
  tmnCode: VNP_TMNCODE,
  secretFirst4Chars: VNP_SECRET.substring(0, 4),
  secretLength: VNP_SECRET.length,
  testMode: process.env.NODE_ENV !== 'production'
});

const vnpay = new VNPay({
  tmnCode: VNP_TMNCODE,
  secureSecret: VNP_SECRET,
  vnpayHost: process.env.NODE_ENV === 'production' 
    ? 'https://pay.vnpay.vn' 
    : 'https://sandbox.vnpayment.vn',
  testMode: process.env.NODE_ENV !== 'production',
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: console.log,
});

export default vnpay;
