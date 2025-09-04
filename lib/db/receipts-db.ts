import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export interface Receipt {
  id: string;
  receiptNumber: string;
  submittedBy: string;
  submitterAvatar?: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  project: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  submittedDate: string;
  description: string;
  hasImage: boolean;
  ocrProcessed: boolean;
  approver?: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

async function getDB() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'receipts.db'),
      driver: sqlite3.Database
    });

    // Create receipts table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY,
        receiptNumber TEXT UNIQUE,
        submittedBy TEXT,
        submitterAvatar TEXT,
        date TEXT,
        vendor TEXT,
        amount REAL,
        category TEXT,
        project TEXT,
        status TEXT,
        submittedDate TEXT,
        description TEXT,
        hasImage BOOLEAN,
        ocrProcessed BOOLEAN,
        approver TEXT,
        approvedDate TEXT,
        rejectedDate TEXT,
        rejectionReason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed with existing data if empty
    const count = await db.get('SELECT COUNT(*) as count FROM receipts');
    if (count.count === 0) {
      await seedData();
    }
  }
  return db;
}

async function seedData() {
  if (!db) return;
  
  const seedReceipts: Receipt[] = [
    {
      id: '1',
      receiptNumber: 'RCP-2024-001',
      submittedBy: 'John Smith',
      submitterAvatar: '/placeholder.svg?height=32&width=32',
      date: '2024-02-15',
      vendor: 'B&Q Hardware',
      amount: 234.5,
      category: 'Materials',
      project: 'Kitchen Renovation - Maple Street',
      status: 'pending',
      submittedDate: '2024-02-15T10:30:00Z',
      description: 'Screws, bolts, and hardware supplies',
      hasImage: true,
      ocrProcessed: true,
    },
    {
      id: '2',
      receiptNumber: 'RCP-2024-002',
      submittedBy: 'Sarah Wilson',
      submitterAvatar: '/placeholder.svg?height=32&width=32',
      date: '2024-02-14',
      vendor: 'Wickes',
      amount: 1250.0,
      category: 'Materials',
      project: 'Bathroom Refit - Oak Avenue',
      status: 'approved',
      submittedDate: '2024-02-14T14:20:00Z',
      description: 'Bathroom tiles and adhesive',
      hasImage: true,
      ocrProcessed: true,
      approver: 'Emily Johnson',
      approvedDate: '2024-02-14T16:45:00Z',
    },
    {
      id: '3',
      receiptNumber: 'RCP-2024-003',
      submittedBy: 'Mike Johnson',
      submitterAvatar: '/placeholder.svg?height=32&width=32',
      date: '2024-02-13',
      vendor: 'Electrical Supplies Ltd',
      amount: 89.99,
      category: 'Materials',
      project: 'Office Refurbishment',
      status: 'rejected',
      submittedDate: '2024-02-13T09:15:00Z',
      description: 'Electrical cables and connectors',
      hasImage: true,
      ocrProcessed: true,
      approver: 'Emily Johnson',
      rejectedDate: '2024-02-13T11:30:00Z',
      rejectionReason: 'Receipt unclear, please resubmit with better quality image',
    },
    {
      id: '4',
      receiptNumber: 'RCP-2024-004',
      submittedBy: 'Emma Davis',
      submitterAvatar: '/placeholder.svg?height=32&width=32',
      date: '2024-02-12',
      vendor: 'Tool Station',
      amount: 45.75,
      category: 'Equipment',
      project: 'Garden Landscaping',
      status: 'processing',
      submittedDate: '2024-02-12T16:00:00Z',
      description: 'Hand tools and safety equipment',
      hasImage: true,
      ocrProcessed: false,
    },
    {
      id: '5',
      receiptNumber: 'RCP-2024-005',
      submittedBy: 'Tom Brown',
      submitterAvatar: '/placeholder.svg?height=32&width=32',
      date: '2024-02-11',
      vendor: 'Screwfix',
      amount: 156.3,
      category: 'Materials',
      project: 'Kitchen Renovation - Maple Street',
      status: 'approved',
      submittedDate: '2024-02-11T13:45:00Z',
      description: 'Plumbing fittings and pipes',
      hasImage: true,
      ocrProcessed: true,
      approver: 'John Smith',
      approvedDate: '2024-02-11T15:20:00Z',
    },
  ];

  for (const receipt of seedReceipts) {
    await db.run(
      `INSERT INTO receipts (
        id, receiptNumber, submittedBy, submitterAvatar, date, vendor, 
        amount, category, project, status, submittedDate, description, 
        hasImage, ocrProcessed, approver, approvedDate, rejectedDate, rejectionReason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        receipt.id, receipt.receiptNumber, receipt.submittedBy, receipt.submitterAvatar,
        receipt.date, receipt.vendor, receipt.amount, receipt.category, receipt.project,
        receipt.status, receipt.submittedDate, receipt.description, receipt.hasImage,
        receipt.ocrProcessed, receipt.approver, receipt.approvedDate, receipt.rejectedDate,
        receipt.rejectionReason
      ]
    );
  }
}

export async function getAllReceipts(): Promise<Receipt[]> {
  const database = await getDB();
  const receipts = await database.all('SELECT * FROM receipts ORDER BY created_at DESC');
  return receipts;
}

export async function addReceipt(receipt: Omit<Receipt, 'id'>): Promise<Receipt> {
  const database = await getDB();
  const id = `receipt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await database.run(
    `INSERT INTO receipts (
      id, receiptNumber, submittedBy, submitterAvatar, date, vendor, 
      amount, category, project, status, submittedDate, description, 
      hasImage, ocrProcessed, approver, approvedDate, rejectedDate, rejectionReason
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, receipt.receiptNumber, receipt.submittedBy, receipt.submitterAvatar,
      receipt.date, receipt.vendor, receipt.amount, receipt.category, receipt.project,
      receipt.status, receipt.submittedDate, receipt.description, receipt.hasImage,
      receipt.ocrProcessed, receipt.approver, receipt.approvedDate, receipt.rejectedDate,
      receipt.rejectionReason
    ]
  );

  return { id, ...receipt };
}

export async function getReceiptStats() {
  const receipts = await getAllReceipts();
  
  return {
    total: receipts.length,
    pending: receipts.filter(r => r.status === 'pending').length,
    approved: receipts.filter(r => r.status === 'approved').length,
    rejected: receipts.filter(r => r.status === 'rejected').length,
    processing: receipts.filter(r => r.status === 'processing').length,
    totalValue: receipts.reduce((sum, r) => sum + r.amount, 0),
    pendingValue: receipts.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
  };
}