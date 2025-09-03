const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();

// Rate limiting for WebSocket connections
const connectionAttempts = new Map();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://yourdomain.com"] // Update for production
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  // Add connection rate limiting
  allowEIO3: false,
  pingTimeout: 60000,
  pingInterval: 25000
});

let connectedClients = 0;

// Connection rate limiting middleware
io.use((socket, next) => {
  const clientIP = socket.handshake.address;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxConnections = 10;
  
  if (!connectionAttempts.has(clientIP)) {
    connectionAttempts.set(clientIP, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  const attempts = connectionAttempts.get(clientIP);
  if (now > attempts.resetTime) {
    attempts.count = 1;
    attempts.resetTime = now + windowMs;
    return next();
  }
  
  if (attempts.count >= maxConnections) {
    console.warn(`[${new Date().toISOString()}] Connection rate limit exceeded for IP:`, clientIP);
    return next(new Error('Too many connection attempts'));
  }
  
  attempts.count++;
  next();
});

io.on('connection', (socket) => {
  connectedClients++;
  console.log(`[${new Date().toISOString()}] Client connected (${connectedClients} total)`, socket.id);

  // Send welcome message
  socket.emit('connected', {
    message: 'Connected to Silver Lining real-time server',
    timestamp: new Date().toISOString()
  });

  // Handle new receipt events from webhook
  socket.on('new-receipt', (receipt) => {
    console.log(`[${new Date().toISOString()}] Broadcasting new receipt:`, receipt.receiptNumber);
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('new-receipt', receipt);
  });

  // Handle receipt processed events
  socket.on('receipt-processed', (receipt) => {
    console.log(`[${new Date().toISOString()}] Broadcasting processed receipt:`, receipt.receiptNumber);
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('receipt-processed', receipt);
  });

  // Handle manual test events
  socket.on('test-receipt', (data) => {
    console.log(`[${new Date().toISOString()}] Test receipt received:`, data);
    
    const testReceipt = {
      id: `test-${Date.now()}`,
      receiptNumber: `RCP-TEST-${Math.floor(Math.random() * 1000)}`,
      submittedBy: data.submittedBy || 'Test User',
      submitterAvatar: '/placeholder.svg?height=32&width=32',
      date: new Date().toISOString().split('T')[0],
      vendor: data.vendor || 'Test Vendor',
      amount: data.amount || 99.99,
      category: 'Materials',
      project: 'Test Project',
      status: 'pending',
      submittedDate: new Date().toISOString(),
      description: data.description || 'Test receipt submission',
      hasImage: true,
      ocrProcessed: true,
    };

    // Broadcast to all clients
    io.emit('new-receipt', testReceipt);
  });

  socket.on('disconnect', (reason) => {
    connectedClients--;
    console.log(`[${new Date().toISOString()}] Client disconnected (${connectedClients} total)`, socket.id, reason);
  });

  socket.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Socket error:`, error);
  });
});

const PORT = process.env.WEBSOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Silver Lining WebSocket Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:3000`);
  console.log(`🕐 Started at: ${new Date().toISOString()}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});