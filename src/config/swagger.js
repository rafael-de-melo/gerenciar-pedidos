// src/config/swagger.js
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Gerenciar Pedidos API',
    version: '1.0.0',
    description: 'API - Gerenciar Pedidos e Itens (Desafio Técnico)',
  },
  servers: [
    { url: 'http://localhost:3000' },
  ],
  paths: {
    '/order': {
      post: {
        summary: 'Cria um novo pedido',
        tags: ['Pedidos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Pedido criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          400: { description: 'Payload inválido' },
          500: { description: 'Erro interno' },
        },
      },
    },
    '/order/{orderId}': {
      get: {
        summary: 'Obter os dados do pedido passando por parâmetro na URL o número do pedido',
        tags: ['Pedidos'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Pedido encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: { description: 'Pedido não encontrado' },
          500: { description: 'Erro interno' },
        },
      },
      put: {
        summary: 'Atualizar o pedido passando por parâmetro na url o número do pedido que será atualizado',
        tags: ['Pedidos'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateOrderItemsRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Itens atualizados com sucesso' },
          400: { description: 'Item não existe no pedido / payload inválido' },
          404: { description: 'Pedido não existe' },
          500: { description: 'Erro interno' },
        },
      },
      delete: {
        summary: 'Delete o pedido passando por parâmetro na url o número do pedido que será deletado',
        tags: ['Pedidos'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Pedido removido com sucesso' },
          404: { description: 'Pedido não encontrado' },
          500: { description: 'Erro interno' },
        },
      },
    },
    '/orders': {
      get: {
        summary: 'Listar todos os pedidos',
        tags: ['Pedidos'],
        responses: {
          200: {
            description: 'Lista de pedidos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/OrderResponse' },
                },
              },
            },
          },
          500: { description: 'Erro interno' },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateOrderRequest: {
        type: 'object',
        required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
        properties: {
          numeroPedido: { type: 'string' },
          valorTotal: { type: 'number' },
          dataCriacao: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['idItem', 'quantidadeItem', 'valorItem'],
              properties: {
                idItem: { type: 'integer' },
                quantidadeItem: { type: 'integer' },
                valorItem: { type: 'number' },
              },
            },
          },
        },
      },
      UpdateOrderItemsRequest: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['idItem', 'quantidadeItem', 'valorItem'],
              properties: {
                idItem: { type: 'integer' },
                quantidadeItem: { type: 'integer' },
                valorItem: { type: 'number' },
              },
            },
          },
        },
      },
      OrderItemResponse: {
        type: 'object',
        properties: {
          idItem: { type: 'integer' },
          quantidadeItem: { type: 'integer' },
          valorItem: { type: 'number' },
        },
      },
      OrderResponse: {
        type: 'object',
        properties: {
          numeroPedido: { type: 'string' },
          valorTotal: { type: 'number' },
          dataCriacao: { type: 'string', format: 'date' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItemResponse' },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;