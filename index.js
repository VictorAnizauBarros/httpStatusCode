// Importa o módulo express
const express = require("express");
// Instancia do Express na variável app
const app = express(); 
// Porta em que o servidor irá rodar
const port = 3000; 
// Array para armazenar os carros
const carros = []; 

app.use(express.json()); 

// Rota para a página inicial
app.get('/' , (req, res) => {
    res.status(200).send("Seja bem-vindo à página inicial."); 
}); 

// Rota para listar todos os carros
app.get('/carros' , (req, res) => {
    res.status(200).json(carros); 
});

// Rota para adicionar um carro ao array
app.post('/carros', (req, res) => {
    const carro = req.query.carro ? req.query.carro.toUpperCase() : null; 

    if (!carro) {
        // Status Code 400 - Bad Request - erro por parte do cliente ao não informar o parâmetro carro.
        return res.status(400).send("O parâmetro carro é obrigatório."); 
    }

    if (carros.includes(carro)) {
        // Status Code 409 - Conflict - a requisição feita está em conflito com o estado atual do servidor, ou seja, em caso de o carro já pertencer à lista, ele não será adicionado novamente.
        return res.status(409).send("O carro já pertence à lista."); 
    } else {
        carros.push(carro);
        // Status Code 201 - Created - a requisição de adicionar um novo carro ao array foi bem-sucedida.
        return res.status(201).send("Carro adicionado com sucesso.");
    }
});

// Rota para atualizar um carro
app.put('/carros' , (req, res) => {
    const carroAntigo = req.query.carroAntigo ? req.query.carroAntigo.toUpperCase() : null; 
    const carroNovo = req.query.carroNovo ? req.query.carroNovo.toUpperCase() : null;

    if (!carroAntigo || !carroNovo) {
        // Status Code 400 - Bad Request - erro por parte do cliente ao não informar os parâmetros carroAntigo ou carroNovo.
        return res.status(400).send("Erro ao informar a query: carroAntigo e carroNovo são obrigatórios.");   
    }
    
    const index = carros.indexOf(carroAntigo);

    if (index === -1) {
        // Status Code 404 - Not Found - o carro antigo não foi encontrado na lista.
        return res.status(404).send("O carro antigo não encontrado na lista."); 
    } 

    if (carros.includes(carroNovo)) {
        // Status Code 409 - Conflict - o carro novo já existe na lista, portanto, não será atualizado para evitar duplicação.
        return res.status(409).send("O carro novo já existe na lista."); 
    } 

    carros[index] = carroNovo; 
    // Status Code 200 - OK - a atualização foi bem-sucedida.
    res.status(200).send("Carro atualizado com sucesso."); 
});

// Rota para remover um carro da lista
app.delete('/carros' , (req, res) => {
    const carro = req.query.carro ? req.query.carro.toUpperCase() : null; 

    if (!carro) {
        // Status Code 400 - Bad Request - o cliente não informou o parâmetro carro que é obrigatório para a requisição.
        return res.status(400).send("O parâmetro carro é obrigatório.");
    }

    const index = carros.indexOf(carro); 

    if (index === -1) {
        // Status Code 404 - Not Found - o carro não foi encontrado na lista.
        return res.status(404).send("Carro não encontrado na lista.");
    }

    carros.splice(index, 1);
    // Status Code 200 - OK - o carro foi removido com sucesso.
    res.status(200).send("Carro removido com sucesso."); 
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server is running...`); 
});
