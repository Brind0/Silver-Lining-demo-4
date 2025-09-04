import { createWorker } from 'tesseract.js';
import sharp from 'sharp';

export interface XeroReceiptData {
  supplier: {
    name: string;
    address?: string;
    vatNumber?: string;
  };
  receiptDate: string;
  receiptNumber?: string;
  totalAmount: number;
  vatAmount: number;
  netAmount: number;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
  }>;
  paymentMethod?: string;
  category: string;
  confidence: number;
  rawText: string;
}

// UK major retailers and their patterns
const UK_VENDORS = {
  'B&Q': {
    patterns: [/b\s*&\s*q/i, /b&q/i, /diy/i],
    category: 'Materials',
    vatNumber: 'GB486184287'
  },
  'Wickes': {
    patterns: [/wickes/i, /wickes\.co\.uk/i],
    category: 'Materials', 
    vatNumber: 'GB238321881'
  },
  'Screwfix': {
    patterns: [/screwfix/i, /screw\s*fix/i],
    category: 'Equipment',
    vatNumber: 'GB238380715'
  },
  'Travis Perkins': {
    patterns: [/travis\s*perkins/i, /tp\s*travis/i, /tradepointtrade/i],
    category: 'Materials',
    vatNumber: 'GB434307919'
  },
  'Toolstation': {
    patterns: [/toolstation/i, /tool\s*station/i],
    category: 'Equipment',
    vatNumber: 'GB238380715'
  },
  'Jewson': {
    patterns: [/jewson/i, /saint\s*gobain/i],
    category: 'Materials',
    vatNumber: 'GB674555888'
  },
  'Homebase': {
    patterns: [/homebase/i, /home\s*base/i],
    category: 'Materials',
    vatNumber: 'GB238321881'
  },
  'Selco': {
    patterns: [/selco/i, /selco\s*bw/i],
    category: 'Materials',
    vatNumber: 'GB434307919'
  }
};

// Amount parsing patterns (UK currency formats)
const AMOUNT_PATTERNS = [
  // £123.45, £1,234.56
  /£\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,
  // 123.45, 1,234.56 (when near "total", "amount", etc.)
  /(?:total|amount|sum|due|pay)\s*:?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi,
  // Standalone currency amounts
  /(\d{1,3}(?:,\d{3})*\.\d{2})(?=\s*(?:gbp|£|total|cash|card))/gi
];

// UK date patterns
const DATE_PATTERNS = [
  // DD/MM/YYYY, DD/MM/YY
  /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g,
  // DD-MM-YYYY, DD-MM-YY  
  /(\d{1,2})-(\d{1,2})-(\d{2,4})/g,
  // DD.MM.YYYY
  /(\d{1,2})\.(\d{1,2})\.(\d{2,4})/g,
  // DD MMM YYYY (e.g., 15 Aug 2024)
  /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{4})/gi
];

// VAT patterns
const VAT_PATTERNS = [
  /vat\s*:?\s*£?\s*(\d+\.\d{2})/gi,
  /tax\s*:?\s*£?\s*(\d+\.\d{2})/gi,
  /(\d+\.\d{2})\s*vat/gi
];

export async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Enhance image for better OCR recognition
    return await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .sharpen()
      .threshold(128)
      .png()
      .toBuffer();
  } catch (error) {
    console.error('Image preprocessing failed:', error);
    return imageBuffer; // Return original if preprocessing fails
  }
}

export function recognizeVendor(text: string): { name: string; category: string; vatNumber?: string } | null {
  const cleanText = text.toLowerCase();
  
  for (const [vendorName, vendorData] of Object.entries(UK_VENDORS)) {
    for (const pattern of vendorData.patterns) {
      if (pattern.test(cleanText)) {
        return {
          name: vendorName,
          category: vendorData.category,
          vatNumber: vendorData.vatNumber
        };
      }
    }
  }
  
  return null;
}

export function extractAmounts(text: string): { total?: number; vat?: number; net?: number; confidence: number } {
  const amounts: number[] = [];
  let vatAmount: number | undefined;
  
  // Extract all potential amounts
  for (const pattern of AMOUNT_PATTERNS) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const amountStr = match[1];
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0 && amount < 10000) { // Reasonable range
        amounts.push(amount);
      }
    }
  }
  
  // Extract VAT
  for (const pattern of VAT_PATTERNS) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const vat = parseFloat(match[1]);
      if (!isNaN(vat) && vat > 0) {
        vatAmount = vat;
        break;
      }
    }
  }
  
  if (amounts.length === 0) {
    return { confidence: 0 };
  }
  
  // Find the likely total (usually the largest amount)
  const total = Math.max(...amounts);
  
  // Calculate or validate VAT
  if (!vatAmount && total > 0) {
    // Assume 20% VAT if not found
    vatAmount = Math.round((total * 0.2 / 1.2) * 100) / 100;
  }
  
  const netAmount = total - (vatAmount || 0);
  
  return {
    total,
    vat: vatAmount,
    net: netAmount,
    confidence: amounts.length > 1 ? 0.9 : 0.7
  };
}

export function extractDate(text: string): { date: string; confidence: number } | null {
  const today = new Date();
  
  for (const pattern of DATE_PATTERNS) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      try {
        let day: number, month: number, year: number;
        
        if (match.length === 4) { // DD MMM YYYY format
          day = parseInt(match[1]);
          month = getMonthNumber(match[2]);
          year = parseInt(match[3]);
        } else {
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = parseInt(match[3]);
          
          // Handle 2-digit years
          if (year < 100) {
            year += year < 50 ? 2000 : 1900;
          }
        }
        
        // Validate date
        if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 2000 && year <= today.getFullYear()) {
          const date = new Date(year, month - 1, day);
          if (date <= today && date >= new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)) { // Within 90 days
            return {
              date: date.toISOString().split('T')[0],
              confidence: 0.9
            };
          }
        }
      } catch (error) {
        continue;
      }
    }
  }
  
  return null;
}

function getMonthNumber(monthStr: string): number {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return months.findIndex(m => monthStr.toLowerCase().startsWith(m)) + 1;
}

export function extractLineItems(text: string, vendorName?: string): Array<{description: string; quantity: number; unitPrice: number; vatRate: number}> {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const items: Array<{description: string; quantity: number; unitPrice: number; vatRate: number}> = [];
  
  // Look for lines that contain both description and price
  for (const line of lines) {
    const priceMatch = line.match(/(\d+\.\d{2})$/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      const description = line.replace(/\s*\d+\.\d{2}$/, '').trim();
      
      if (description.length > 3 && price > 0 && price < 1000) {
        items.push({
          description: description.substring(0, 100), // Limit description length
          quantity: 1,
          unitPrice: price,
          vatRate: 20 // Standard UK VAT rate
        });
      }
    }
  }
  
  return items.slice(0, 10); // Limit to 10 items
}

export async function processReceiptWithTesseract(imageBuffer: Buffer): Promise<XeroReceiptData> {
  let worker;
  
  try {
    // Preprocess image
    const enhancedImage = await preprocessImage(imageBuffer);
    
    // Initialize Tesseract worker
    worker = await createWorker('eng');
    
    // Perform OCR
    const { data: { text, confidence } } = await worker.recognize(enhancedImage);
    
    // Extract vendor information
    const vendor = recognizeVendor(text) || { name: 'Unknown Vendor', category: 'Materials' };
    
    // Extract amounts
    const amounts = extractAmounts(text);
    
    // Extract date
    const dateInfo = extractDate(text) || { date: new Date().toISOString().split('T')[0], confidence: 0.3 };
    
    // Extract line items
    const lineItems = extractLineItems(text, vendor.name);
    
    // Calculate overall confidence
    const overallConfidence = Math.min(
      confidence / 100,
      amounts.confidence,
      dateInfo.confidence,
      vendor.name !== 'Unknown Vendor' ? 0.9 : 0.5
    );
    
    const result: XeroReceiptData = {
      supplier: {
        name: vendor.name,
        vatNumber: vendor.vatNumber
      },
      receiptDate: dateInfo.date,
      totalAmount: amounts.total || 0,
      vatAmount: amounts.vat || 0,
      netAmount: amounts.net || amounts.total || 0,
      lineItems: lineItems.length > 0 ? lineItems : [{
        description: `${vendor.category} supplies`,
        quantity: 1,
        unitPrice: amounts.total || 0,
        vatRate: 20
      }],
      category: vendor.category,
      confidence: Math.round(overallConfidence * 100) / 100,
      rawText: text
    };
    
    console.log('OCR Processing Results:', {
      vendor: vendor.name,
      confidence: result.confidence,
      totalAmount: result.totalAmount,
      itemsFound: result.lineItems.length
    });
    
    return result;
    
  } catch (error) {
    console.error('Tesseract OCR failed:', error);
    
    // Return fallback data
    return {
      supplier: { name: 'Unknown Vendor' },
      receiptDate: new Date().toISOString().split('T')[0],
      totalAmount: 0,
      vatAmount: 0,
      netAmount: 0,
      lineItems: [],
      category: 'Materials',
      confidence: 0,
      rawText: 'OCR processing failed'
    };
    
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}