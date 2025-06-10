import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import ratelimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import Fastify, { FastifyInstance } from 'fastify';
import { utilizacaoVeiculosRoutes } from './routes/controleDeVeiculos.route';
import { motoristaRoutes } from './routes/motorista.routes';
import { pingRoutes } from './routes/ping.route';
import { veiculoRoutes } from './routes/veiculo.routes';

interface IFramework {
  iniciar: (porta: number, host?: string) => void;
  parar: () => void;
}

class FastifyFramework implements IFramework {
  constructor(private fastify: FastifyInstance) {}

  async iniciar(porta: number, host: string = 'localhost'): Promise<void> {
    try {
      await this.fastify.listen({ port: porta, host: host });
      console.log(`Servidor rodando em http://${host}:${porta}`);
    } catch (err) {
      console.error('Erro ao iniciar o servidor:', err);
      process.exit(1);
    }
  }

  parar(): void {
    this.fastify.close(() => {
      console.log('Servidor parado.');
    });
  }
}

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed by CORS'), []);
  },
  credentials: true, // se estiver usando cookies/autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // útil se estiver usando ferramentas como Canvas, WebAssembly etc.
});

fastify.register(ratelimit, {
  max: 120,
  timeWindow: '1 minute',
});

fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Minha API',
      description: 'Documentação da API com Swagger',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Mais sobre o Swagger',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list', // 'none', 'full'
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

fastify.register(motoristaRoutes);
fastify.register(veiculoRoutes);
fastify.register(pingRoutes);
fastify.register(utilizacaoVeiculosRoutes);

export default fastify;

export const app = new FastifyFramework(fastify);
