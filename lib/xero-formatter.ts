import { XeroReceiptData } from './real-ocr-processor';

// Convert XeroReceiptData to existing OCR format for compatibility
export function convertXeroToOCRResult(xeroData: XeroReceiptData) {
  return {
    vendor: xeroData.supplier.name,
    amount: xeroData.totalAmount,
    date: xeroData.receiptDate,
    description: generateDescription(xeroData),
    confidence: xeroData.confidence,
    rawText: xeroData.rawText
  };
}

// Generate a business-friendly description from line items
function generateDescription(xeroData: XeroReceiptData): string {
  if (xeroData.lineItems.length === 0) {
    return `${xeroData.category} supplies`;
  }
  
  if (xeroData.lineItems.length === 1) {
    return xeroData.lineItems[0].description;
  }
  
  // For multiple items, create a summary
  const itemDescriptions = xeroData.lineItems.map(item => item.description);
  const firstThree = itemDescriptions.slice(0, 3);
  
  if (itemDescriptions.length > 3) {
    return `${firstThree.join(', ')} and ${itemDescriptions.length - 3} more items`;
  }
  
  return firstThree.join(', ');
}

// Generate Xero-compatible XML for API submission
export function generateXeroInvoiceXML(xeroData: XeroReceiptData, contactName: string = "Cash Supplier"): string {
  const invoiceXML = `<?xml version="1.0" encoding="utf-8"?>
<Invoices>
  <Invoice>
    <Type>ACCPAY</Type>
    <Contact>
      <Name>${contactName}</Name>
    </Contact>
    <Date>${xeroData.receiptDate}</Date>
    <DueDate>${xeroData.receiptDate}</DueDate>
    <Status>AUTHORISED</Status>
    <LineAmountTypes>Inclusive</LineAmountTypes>
    <LineItems>
      ${xeroData.lineItems.map(item => `
      <LineItem>
        <Description>${escapeXML(item.description)}</Description>
        <Quantity>${item.quantity}</Quantity>
        <UnitAmount>${item.unitPrice.toFixed(2)}</UnitAmount>
        <TaxType>INPUT2</TaxType>
        <AccountCode>400</AccountCode>
      </LineItem>`).join('')}
    </LineItems>
  </Invoice>
</Invoices>`;

  return invoiceXML;
}

// Generate Xero API JSON payload
export function generateXeroInvoiceJSON(xeroData: XeroReceiptData, projectCode?: string): object {
  return {
    Type: "ACCPAY",
    Contact: {
      Name: xeroData.supplier.name,
      ...(xeroData.supplier.vatNumber && { TaxNumber: xeroData.supplier.vatNumber })
    },
    Date: xeroData.receiptDate,
    DueDate: xeroData.receiptDate,
    Status: "AUTHORISED",
    LineAmountTypes: "Inclusive",
    LineItems: xeroData.lineItems.map(item => ({
      Description: item.description + (projectCode ? ` [${projectCode}]` : ''),
      Quantity: item.quantity,
      UnitAmount: item.unitPrice,
      TaxType: "INPUT2", // Standard UK VAT
      AccountCode: getAccountCode(xeroData.category)
    })),
    ...(projectCode && { Reference: `Project: ${projectCode}` })
  };
}

// Map categories to Xero account codes
function getAccountCode(category: string): string {
  const accountCodes = {
    'Materials': '400', // Cost of Sales
    'Equipment': '450', // Equipment & Tools
    'Labour': '500',    // Wages & Salaries  
    'Permits': '460',   // Licenses & Permits
    'Other': '400'      // Default to Cost of Sales
  };
  
  return accountCodes[category] || accountCodes['Other'];
}

// Escape XML special characters
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate a professional receipt summary for reporting
export function generateReceiptSummary(xeroData: XeroReceiptData, projectName?: string): string {
  const summary = [
    `Receipt processed from ${xeroData.supplier.name}`,
    `Date: ${new Date(xeroData.receiptDate).toLocaleDateString('en-GB')}`,
    `Total: £${xeroData.totalAmount.toFixed(2)}`,
    `VAT: £${xeroData.vatAmount.toFixed(2)}`,
    `Net: £${xeroData.netAmount.toFixed(2)}`,
    projectName ? `Project: ${projectName}` : '',
    `Category: ${xeroData.category}`,
    `Items: ${xeroData.lineItems.length}`,
    `Confidence: ${Math.round(xeroData.confidence * 100)}%`
  ].filter(Boolean).join('\n');
  
  return summary;
}

// Quality checks for Xero data
export function validateXeroData(xeroData: XeroReceiptData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!xeroData.supplier.name || xeroData.supplier.name === 'Unknown Vendor') {
    errors.push('Supplier name not recognized');
  }
  
  if (!xeroData.totalAmount || xeroData.totalAmount <= 0) {
    errors.push('Total amount not found or invalid');
  }
  
  if (xeroData.vatAmount < 0) {
    errors.push('VAT amount is negative');
  }
  
  if (Math.abs((xeroData.totalAmount - xeroData.netAmount) - xeroData.vatAmount) > 0.02) {
    errors.push('VAT calculation appears incorrect');
  }
  
  if (!xeroData.receiptDate) {
    errors.push('Receipt date not found');
  }
  
  if (xeroData.lineItems.length === 0) {
    errors.push('No line items extracted');
  }
  
  if (xeroData.confidence < 0.5) {
    errors.push('Low confidence in data extraction');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}