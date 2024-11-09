const express = require('express');
const sqlite3 = require('sqlite3'); 
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./itemsdb.sqlite',(err) => {
    if(err){
        console.err('Deu erro');
    } else {
        console.log('Deu certo!')
    }
});

db.run(`CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, descricao TEXT, dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP)`,(err) =>{
    if(err) {
        console.error('Deu erro criar a tabela');
    } else {
        console.log('Deu certo!')
    }
});

app.post('/items', (req,res) => {
    const { name, descricao } = req.body;
    const query = `INSERT INTO items(name,descricao) VALUES (?,?)`;

    db.run(query, [name,descricao], (err) => {
        if(err) {
            res.status(400).json({message:err.message});
        } else{
            res.status(201).json({id: this.lastID, name, descricao});
        }
    })
});

app.listen(port, () => {
    console.log("O servidor rodando na porta http://localhost:3000 ")
});

app.get('/items', (req, res) => {
    const query = `SELECT * FROM items`;
    db.all(query, [], (err,rows) => {
        if(err) {
            res.status(400).json({message:'Erro ao encontrar item'});
        } else{
            res.status(200).json(rows);
        }
    });
});

//Atividade CRUD 

app.get('/items/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM items WHERE id = ?`;
    db.get(query, [id], (err,row) => {
        if(err) {
            res.status(400).json({message:'Erro ao buscar item'});
        } else{
            res.status(200).json(row);
        }
    });
});

app.delete('/item/:id', (req,res) =>{
    const {id} = req.params;
    const query = `DELETE FROM items WHERE id = ?`;
    db.run(query, [id], (err,row) => {
        if(err) {
            res.status(400).json({message:'Erro ao deletar item'});
        } else{
            res.status(200).json(row);
        }
    });
});

app.patch('/items/:id', (req, res) => {
    const {id} = req.params;
    const {name, descricao} = req.body;
    const query = 'UPDATE items SET name = ?, descricao = ? WHERE id = ?';

    db.run(query, [name, descricao, id], (err) => {
        if(err){
            res.status(400).json({message:'Erro ao atualizar item'});  
        } else {
            res.status(200).json({id,name,descricao});
        }
    });
});

app.put('/items/:id', (req,res) => {
    const {id} = req.params;
    const {name, descricao} = req.body;
    const query = `UPDATE items SET name = ?, descricao = ? WHERE id = ?`;
    db.run(query, [name, descricao, id], (err) => {
        if(err) {
            res.status(400).json({message:'Erro ao atualizar o item.'})
        } else { 
            res.status(200).json({id,name, descricao});
        }
    });
});