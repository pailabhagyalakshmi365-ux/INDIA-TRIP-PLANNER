import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_DESTINATIONS } from './src/data/destinationsData';
import {
  INITIAL_GUIDES,
  INITIAL_HOTELS,
  INITIAL_TICKETS,
  INITIAL_TRANSPORT,
} from './src/data/servicesData';
import { BookingRecord } from './src/types/travel';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store initialized with structured Indian travel demo data
  const store = {
    destinations: [...INITIAL_DESTINATIONS],
    hotels: [...INITIAL_HOTELS],
    tickets: [...INITIAL_TICKETS],
    transport: [...INITIAL_TRANSPORT],
    guides: [...INITIAL_GUIDES],
    bookings: [] as BookingRecord[],
  };

  // REST API Integration Endpoints (Ready to connect external travel APIs)
  app.get('/api/destinations', (_req, res) => {
    res.json({ status: 'ok', mode: 'demo', data: store.destinations });
  });

  app.get('/api/hotels', (req, res) => {
    const { destinationId } = req.query;
    const list = destinationId
      ? store.hotels.filter((h) => h.destinationId === destinationId)
      : store.hotels;
    res.json({ status: 'ok', mode: 'demo_estimated_prices', data: list });
  });

  app.get('/api/tickets', (req, res) => {
    const { destinationId } = req.query;
    const list = destinationId
      ? store.tickets.filter((t) => t.destinationId === destinationId)
      : store.tickets;
    res.json({ status: 'ok', mode: 'demo', data: list });
  });

  app.get('/api/transport', (_req, res) => {
    res.json({ status: 'ok', mode: 'demo', data: store.transport });
  });

  app.get('/api/guides', (req, res) => {
    const { destinationId } = req.query;
    const list = destinationId
      ? store.guides.filter((g) => g.destinationId === destinationId)
      : store.guides;
    res.json({ status: 'ok', mode: 'demo', data: list });
  });

  app.get('/api/bookings', (_req, res) => {
    res.json({ status: 'ok', mode: 'demo', data: store.bookings });
  });

  app.post('/api/bookings', (req, res) => {
    const booking = req.body as BookingRecord;
    if (!booking || !booking.bookingId) {
      res.status(400).json({ status: 'error', message: 'Invalid booking payload' });
      return;
    }
    store.bookings.unshift(booking);
    res.status(201).json({
      status: 'ok',
      message: 'Demo booking successful',
      bookingId: booking.bookingId,
      data: booking,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`India Trip Planner server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
