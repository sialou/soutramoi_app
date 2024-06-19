const express = require('express');
const mysql = require('mysql');

const app = express();

// Configurer la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'votre_utilisateur',
  password: 'votre_mot_de_passe',
  database: 'votre_base_de_donnees'
});

// Établir la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données');
  }
});

// Exemple de route pour récupérer des données depuis la base de données
app.get('/api/donnees', (req, res) => {
  const sql = 'SELECT * FROM table';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    } else {
      res.json(results);
    }
  });
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur API démarré sur le port 3000');
});
