import * as fct from "/src/js/fonction.js";

export default class niveau1 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
      super({
        key: "niveau1" 
      });
    }
    preload() {
      this.load.image("tuiles1", "src/assets/fond_base.jpg");
      this.load.image("tuiles2", "src/assets/nuages_fond.png");
      this.load.image("tuiles3", "src/assets/plateformes1.png");
      // chargement de la carte
      this.load.tilemapTiledJSON("niveau1", "src/assets/niveau_1.tmj");
    }
  
    create() {
      const map3 = this.add.tilemap("niveau1");
      const ts1 = map3.addTilesetImage("fond", "tuiles1");
      const ts2 = map3.addTilesetImage("nuages", "tuiles2");
      const ts3 = map3.addTilesetImage("platform", "tuiles3");
      const fond = map3.createLayer(
        "calque_fond",
        [ts1, ts2, ts3]
      );
      const nuage1 = map3.createLayer(
        "calque_nuage1",
        [ts1, ts2, ts3]
      );
      const nuages2 = map3.createLayer(
        "calque_nuage2",
        [ts1, ts2, ts3]
      );
      const plateforme = map3.createLayer(
        "calque_plateforme",
        [ts1, ts2, ts3]
      );
      plateforme.setCollisionByProperty({ estSolide: true });

      this.add.text(400, 100, "Vous êtes dans le niveau 1", {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        fontSize: "22pt"
      });
  
      this.porte_suivant = this.physics.add.staticSprite(1440, 512, "img_porte2"); 

      this.player = this.physics.add.sprite(128, 525, "img_perso");
      this.player.direction = 'right'; 
      this.player.refreshBody();
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
  
      this.clavier = this.input.keyboard.createCursorKeys();
      this.boutonFeu = this.input.keyboard.addKey('A');
      this.physics.world.setBounds(0, 0, 1600, 960);
      this.cameras.main.setBounds(0, 0, 1600, 960);
      this.cameras.main.startFollow(this.player);
      this.physics.add.collider(this.player, plateforme);
      this.arme = this.physics.add.group();

      this.player.body.onWorldBounds = true; 
      this.player.body.world.on(
        "worldbounds", // evenement surveillé
        function (body, up, down, left, right) {
          // on verifie si la hitbox qui est rentrée en collision est celle du player,
          // et si la collision a eu lieu sur le bord inférieur du player
          if (body.gameObject === this.player && down == true) {
            // si oui : GAME OVER on arrete la physique et on colorie le personnage en rouge
            this.physics.pause();
            player.setTint(0xff0000);
          }
        },
        this
      ); 
    }
  
    update() {
      fct.deplacement_perso(this.player, this.clavier, this.boutonFeu, this.arme)
    }
  }
   