// chargement des librairies
import accueil from "/src/js/accueil.js";
import niveauboss from "/src/js/niveauboss.js"; 
import niveau1 from "/src/js/niveau1.js";
import niveau2 from "/src/js/niveau2.js";
import selection from "/src/js/selection.js"; 
//import victoire from "/src/js/victoire.js";

// création et lancement du   // configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 1500, // largeur en pixels
  height: 1000, // hauteur en pixels
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 600 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: false // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [accueil, selection, niveauboss, niveau1, niveau2] 
  
};


var game = new Phaser.Game(config);
game.scene.start("accueil"); // lancement de la scene accueil

