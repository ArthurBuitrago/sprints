const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const jsonFilePath = path.join(__dirname, '..', 'db', 'db.json');

    if (!fs.existsSync(jsonFilePath)) {
      return res.json({ success: false, message: 'Erro: Banco de dados não encontrado.' });
    }

    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    const restaurantes = JSON.parse(data);
    
    const restaurante = restaurantes.find(r => r.email === email);
    
    if (!restaurante) {
      return res.json({ success: false, message: 'Email não encontrado.' });
    }
    
    const senhaValida = await bcrypt.compare(password, restaurante.password);
    
    if (!senhaValida) {
      return res.json({ success: false, message: 'Senha incorreta.' });
    }
    
    const usuarioLogado = {
      nome: restaurante.nome,
      email: restaurante.email,
      imagemUrl: restaurante.imagemUrl
    };

    res.json({ success: true, message: 'Login realizado com sucesso!', user: usuarioLogado });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ success: false, message: 'Ocorreu um erro no servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});