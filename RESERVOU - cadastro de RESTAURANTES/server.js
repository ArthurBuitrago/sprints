const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/salvar', upload.single('foto'), (req, res) => {
  const jsonFile = 'restaurantes.json';
  let restaurantes = [];

  if (fs.existsSync(jsonFile)) {
    const data = fs.readFileSync(jsonFile);
    restaurantes = JSON.parse(data);
  }

  const novoRestaurante = {
    nome: req.body.nome,
    imagemUrl: req.file ? `img/${req.file.originalname}` : 'img/default.jpg',
    endereco: req.body.endereco,
    telefone: req.body.telefone,
    capacidade: parseInt(req.body.capacidade),
    categoria: req.body.categoria,
    email: req.body.email
  };

  restaurantes.push(novoRestaurante);

  fs.writeFileSync(jsonFile, JSON.stringify(restaurantes, null, 2));
  
  fs.writeFileSync('db.js', `const restaurantes = ${JSON.stringify(restaurantes, null, 2)};`);
  
  res.json({ mensagem: 'Restaurante cadastrado com sucesso!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  
  if (!fs.existsSync('img')) {
    fs.mkdirSync('img');
  }
  
  const jsonFile = 'restaurantes.json';
  if (fs.existsSync(jsonFile)) {
    const data = fs.readFileSync(jsonFile);
    const restaurantes = JSON.parse(data);
    fs.writeFileSync('db.js', `const restaurantes = ${JSON.stringify(restaurantes, null, 2)};`);
  } else {
    fs.writeFileSync('db.js', 'const restaurantes = [];');
  }
});