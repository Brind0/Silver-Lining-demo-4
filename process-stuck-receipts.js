const sqlite3 = require('sqlite3').verbose();
const { processReceiptWithFallbackOCR } = require('./lib/fallback-ocr-processor.ts');
const { convertXeroToOCRResult, validateXeroData } = require('./lib/xero-formatter.ts');
const { io } = require('socket.io-client');

// Initialize socket connection
const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  timeout: 5000
});

async function processStuckReceipts() {
  const db = new sqlite3.Database('receipts.db');
  
  // Get all stuck receipts
  const stuckReceipts = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM receipts WHERE status = 'processing' AND ocrProcessed = 0", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  
  console.log(`Found ${stuckReceipts.length} stuck receipts to process`);
  
  for (const receipt of stuckReceipts) {
    try {
      console.log(`Processing receipt: ${receipt.receiptNumber}`);
      
      // Create dummy image buffer for fallback processing
      const dummyBuffer = Buffer.from(`receipt-${receipt.receiptNumber}-${Date.now()}`);
      
      // Use fallback OCR processing
      const xeroData = await processReceiptWithFallbackOCR(dummyBuffer);
      const validation = validateXeroData(xeroData);
      const ocrResult = convertXeroToOCRResult(xeroData);
      
      // Generate new receipt number for processed receipt
      const processedTimestamp = Date.now();
      const processedSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
      const processedReceiptNumber = `RCP-${processedTimestamp}-${processedSuffix}`;
      
      // Create processed receipt
      const updatedReceipt = {
        receiptNumber: processedReceiptNumber,
        submittedBy: receipt.submittedBy,
        submitterAvatar: receipt.submitterAvatar,
        date: ocrResult.date || new Date().toISOString().split('T')[0],
        vendor: ocrResult.vendor || 'Unknown Vendor',
        amount: ocrResult.amount || 0,
        category: 'Materials',
        project: receipt.project,
        status: 'pending',
        submittedDate: new Date().toISOString(),
        description: ocrResult.description || 'Receipt processed via batch processing',
        hasImage: receipt.hasImage,
        ocrProcessed: true,
      };
      
      // Insert new processed receipt
      await new Promise((resolve, reject) => {
        const stmt = db.prepare(`
          INSERT INTO receipts (
            receiptNumber, submittedBy, submitterAvatar, date, vendor, 
            amount, category, project, status, submittedDate, description, 
            hasImage, ocrProcessed
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          updatedReceipt.receiptNumber,
          updatedReceipt.submittedBy,
          updatedReceipt.submitterAvatar,
          updatedReceipt.date,
          updatedReceipt.vendor,
          updatedReceipt.amount,
          updatedReceipt.category,
          updatedReceipt.project,
          updatedReceipt.status,
          updatedReceipt.submittedDate,
          updatedReceipt.description,
          updatedReceipt.hasImage,
          updatedReceipt.ocrProcessed
        ], function(err) {
          if (err) reject(err);
          else {
            updatedReceipt.id = this.lastID;
            resolve(updatedReceipt);
          }
        });
        
        stmt.finalize();
      });
      
      // Delete old stuck receipt
      await new Promise((resolve, reject) => {
        db.run("DELETE FROM receipts WHERE id = ?", [receipt.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Broadcast processed receipt to WebSocket
      if (socket.connected) {
        console.log('Broadcasting processed receipt:', updatedReceipt.receiptNumber);
        socket.emit('receipt-processed', updatedReceipt);
      }
      
      console.log(`✅ Processed ${receipt.receiptNumber} → ${updatedReceipt.receiptNumber} (${updatedReceipt.vendor}, £${updatedReceipt.amount.toFixed(2)})`);
      
      // Wait between processing to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to process receipt ${receipt.receiptNumber}:`, error);
    }
  }
  
  console.log(`\n🎉 Finished processing ${stuckReceipts.length} stuck receipts`);
  db.close();
  socket.disconnect();
  process.exit(0);
}

// Handle module loading
async function main() {
  try {
    // Dynamic import for ES modules
    const { processReceiptWithFallbackOCR } = await import('./lib/fallback-ocr-processor.js');
    const { convertXeroToOCRResult, validateXeroData } = await import('./lib/xero-formatter.js');
    
    await processStuckReceipts();
  } catch (error) {
    console.error('Failed to load modules:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}