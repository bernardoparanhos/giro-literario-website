// server.js

// Importa os módulos necessários
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
const cors = require('cors');

// Adiciona a configuração do dotenv para carregar as variáveis de ambiente
require('dotenv').config();

// Inicializa o aplicativo Express
const app = express();
const port = 3000;

// Middleware para analisar o corpo da requisição em formato JSON
app.use(express.json());

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Define a URI de conexão com o MongoDB Atlas a partir da variável de ambiente
const uri = process.env.MONGO_URI;

// Cria um cliente MongoDB com as configurações de API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * Conecta-se ao MongoDB Atlas, seleciona o banco de dados e a coleção,
 * e inicia o servidor.
 */
async function run() {
  try {
    // Conecta o cliente ao servidor
    await client.connect();

    // Envia um ping para confirmar a conexão bem-sucedida
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Seleciona o banco de dados e a coleção
    const database = client.db('giro-literario');
    const books = database.collection('livros');

    /**
     * Define o endpoint para a busca de livros.
     * Recebe um termo de busca e retorna os livros correspondentes.
     */
    app.get('/search-books', async (req, res) => {
      const searchTerm = req.query.term;
      let query = {};

      // Se houver um termo de busca, constrói a consulta para o MongoDB
      if (searchTerm) {
        // CORREÇÃO APLICADA: Busca por termos que começam com o que foi digitado
        query = {
          $or: [
            { title: { $regex: `^${searchTerm}`, $options: 'i' } },
            { author: { $regex: `^${searchTerm}`, $options: 'i' } }
          ]
        };
      }

      // Encontra os livros que correspondem à consulta
      const booksFound = await books.find(query).toArray();
      res.json(booksFound);
    });

    /**
     * NOVO ENDPOINT ADICIONADO: Define a rota para buscar todos os livros.
     * Esta rota foi adicionada com base no seu código fornecido.
     */
    app.get('/api/books', async (req, res) => {
      try {
        const allBooks = await books.find({}).toArray();
        res.json(allBooks);
      } catch (e) {
        console.error(e);
        res.status(500).send("Erro ao buscar livros.");
      }
    });

    // Rota para servir arquivos estáticos do frontend (opcional)
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Inicia o servidor na porta definida
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });

  } finally {
    // A remoção de `await client.close()` garante que o servidor permaneça conectado
    // ao banco de dados enquanto estiver em execução.
    // O fechamento da conexão deve ser feito ao encerrar o aplicativo, não aqui.
  }
}

// Executa a função principal
run().catch(console.dir);
