// chargement des librairies
import niveauboss from "/src/js/niveauboss.js"; 
import niveau2 from "/src/js/niveau2.js";
import niveau3 from "/src/js/niveau3.js";
import selection from "/src/js/selection.js"; 

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
        y: 450 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: false // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [selection, niveauboss, niveau2, niveau3] 
  
};


var game = new Phaser.Game(config);
game.scene.start("selection"); // lancement de la scene selection

