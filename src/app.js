import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use((req, res) => res.status(404).json({ error: 'not found' }));
app.use(errorHandler);

export default app;
