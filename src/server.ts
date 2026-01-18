import express, { Application } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { initDb } from './config/database';
import swaggerSpec from './config/swagger';
import tripRoutes from './routes/tripRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation with enhanced UI options
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    requestSnippetsEnabled: true,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6 }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 4px; }
  `,
  customSiteTitle: 'LittleLifeTrip Trips API Documentation',
  customfavIcon: '/favicon.ico',
};

app.use(
  '/trip/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions),
);

// Routes
app.use('/api/v1', tripRoutes);

// Health check
app.get('/trip/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    await initDb();
    console.log('Database synced successfully.');

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to start:', error);
    process.exit(1);
  }
};

startServer();
