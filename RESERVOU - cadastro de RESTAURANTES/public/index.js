const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, '..', 'img');
const dbDir = path.join(__dirname, '..', 'db');
const jsonFile = path.join(dbDir, 'db.json');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));
app.use('/img', express.static(uploadDir));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
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
  let restaurantes = [];

  if (fs.existsSync(jsonFile)) {
    const data = fs.readFileSync(jsonFile, 'utf-8');
    restaurantes = data ? JSON.parse(data) : [];
  }

  const novoRestaurante = {
    nome: req.body.nome,
    imagemUrl: req.file ? `img/${req.file.originalname}` : 'img/default.jpg',
    endereco: req.body.endereco,
    telefone: req.body.telefone,
    capacidade: parseInt(req.body.capacidade),
    categoria: req.body.categoria,
    email: req.body.email,
    password: req.body.senha
  };

  restaurantes.push(novoRestaurante);

  fs.writeFileSync(jsonFile, JSON.stringify(restaurantes, null, 2));
  
  res.json({ mensagem: 'Restaurante cadastrado com sucesso!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  
  if (!fs.existsSync(jsonFile)) {
    fs.writeFileSync(jsonFile, '[]');
  }
});