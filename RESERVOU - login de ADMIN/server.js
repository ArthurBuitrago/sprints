const express = require('express');
const path = require('path');
const restaurantes = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Email recebido:', email);
  console.log('Senha recebida:', password);
  console.log('Restaurantes disponíveis:', restaurantes.map(r => ({ email: r.email, password: r.password })));
  
  const restaurante = restaurantes.find(r => r.email === email);
  console.log('Restaurante encontrado:', restaurante);
  
  if (!restaurante) {
    return res.json({ success: false, message: 'Email não encontrado.' });
  }
  
  if (restaurante.password !== password) {
    console.log('Senha do banco:', restaurante.password);
    console.log('Senha digitada:', password);
    return res.json({ success: false, message: 'Senha incorreta.' });
  }
  
  res.json({ success: true, message: 'Login realizado com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});