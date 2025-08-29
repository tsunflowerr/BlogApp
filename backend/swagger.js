// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BlogApp API',
    version: '1.0.0',
    description: 'API documentation for BlogApp',
  },
  servers: [
    {
      url: 'http://localhost:4000/api', // đổi nếu cần
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Tag: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
        }
      },
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' }
        }
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          author: { $ref: '#/components/schemas/User' },
          tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } },
          category: {type:'array', items:{$ref: '#/components/schemas/Category'} },
          thumbnail: { type: 'string' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' }
        }
      },
      Comment: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          postId: { type: 'string' },
          author: { $ref: '#/components/schemas/User' },
          content: { type: 'string' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // nếu swagger.js nằm khác, sửa đường dẫn
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
