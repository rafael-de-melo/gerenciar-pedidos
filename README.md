# Gerenciar Pedidos - API em Node.js

API REST para cadastro e gerenciamento de pedidos, desenvolvida em Node.js com Express e MySQL.
Stack: Node.js, Express, MySQL, Nodemom (ambiente dev)

Modelo de dados:
```
CREATE TABLE Orders (
  orderId VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  creationDate DATE NOT NULL,
  PRIMARY KEY (orderId)
);

CREATE TABLE Items (
  orderId VARCHAR(50) NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (orderId, productId),
  FOREIGN KEY (orderId) REFERENCES Orders(orderId)
);
```

# Melhorias futuras (o que eu implementaria com mais tempo)

- **Autenticação e autorização**

    A API atualmente é aberta, mas o PDF cita autenticação como um recurso adicional opcional.
    Eu adicionaria: login com token JWT, expiração e renovação de tokens e controle de acesso baseado em perfis.
- **Validações mais detalhadas nos payloads**

    Hoje existem validações básicas no controller, mas com mais tempo eu aplicaria validação campo a campo com mensagens específicas.
    Isso deixaria a API mais robusta e evitaria falhas silenciosas.
- **Testes**

    Testes unitários nos repositories, testes da regra de negócio e teste end-to-end simulando as chamadas HTTP

# O que já foi implementado no projeto

Mesmo com o escopo limitado, já apliquei:
- CRUD completo.
- Mapeamento de resposta retornando em um formato mais amigável.
- Uso de transações ACID no MySQL (`BEGIN`, `COMMIT`, `ROLLBACK`)
- Separação clara entre controller, repositories, mappers, routes, configs, database
- Documentação via SWAGGER em `/api-docs`
- Recálculo automático do valor do pedido; Remoção do pedido com regras consistentes; Atualização parcial de itens com transação e rollback;
- Padronização de status codes

# Instalação e como rodar

```
npm install --save-dev nodemon
```
no `package.json`:
```
"scripts": {
  "dev": "nodemon index.js"
}
```

arquivo `.env` na raiz:
```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=gerenciar_pedidos

APP_PORT=3000
```

# Endpoints 
**1. Criar um novo pedido**

POST `/order`
```
body:
{
  "numeroPedido": "v10089016vdb",
  "valorTotal": 10000,
  "dataCriacao": "2024-01-01T10:00:00Z",
  "items": [
    { "idItem": 243, "quantidadeItem": 1, "valorItem": 200 }
  ]
}
```

**2. Obter os dados do pedido passando por parâmetro na URL o número do pedido**

GET `/order/:orderId`

- Se o pedido não existir, retorna `404`.

**3. Listar todos os pedidos**

GET `/orders`

**4. Atualizar o pedido passando por parâmetro na url o número do pedido que será atualizado**

PUT `/order/:orderId`

- Se o pedido não existir, retorna `404`.
- Se algum item não existir no pedido, rollback e retorna `400`.
- Só atualiza os itens enviados no body, os não enviados são ignorados.
-  Atualiza o `value` do pedido somando os `price` de cada item. Nunca atualiza a `creationDate`

```
body:
{
  "items": [
    { "idItem": 10, "quantidadeItem": 2, "valorItem": 150 }
  ]
}
```

**5. Delete o pedido passando por parâmetro na url o número do pedido que será deletado**

DELETE `/order/:orderId`

- Se o pedido não existir, retorna `404`.
- Se remover com sucesso, retorna `204`.
