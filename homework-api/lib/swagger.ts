import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Points to your API routes (e.g., app/api/student/route.ts)
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Homework API',
        version: '1.0.0',
        description: 'API for student homework submissions and teacher grading.',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Development server' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [], // Add auth if needed later
    },
  });
  return spec;
};