const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database : 'lugares'
});

//Conectarnos a la base de datos
connection.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Anahi Rivas Valdez");
});

app.get('/caracteristicas', (req, res) => {
  //Consultar los caracteristicas
  connection.query('SELECT * FROM caracteristicas', function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
    }
    //Regresar un objeto json con el listado de las caracteristicas.
    res.status(200).json(results);
  });
});


app.get('/caracteristicas/:id', (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) {
    res.status(400).json({ error: 'parametros no validos.'});
    return;
  }
  //Consultar las caracteristicas
  connection.query(`SELECT * FROM caracteristicas WHERE id=?`, [id] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    if(results.length === 0) {
      res.status(404).json({ error: 'caracteristicas no existente.'});
      return;
    }
    //Regresar un objeto json con el listado de las caracteristicas
    res.status(200).json(results);
  });
});

app.post('/caracteristicas', (req, res) => {
  console.log("req", req.body);
  const titulo = req.body.titulo;
  const estado= req.body.estado;
  const pais = req.body.pais;
  connection.query(`INSERT INTO caracteristicas (titulo,estado,pais) VALUES (?,?,?)`, [titulo,estado,pais] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});