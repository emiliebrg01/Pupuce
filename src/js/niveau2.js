import * as fct from "/src/js/fonction.js";
var porte_suivante;

export default class niveau2 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
      super({
        key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
      });
    }
    preload() {
      this.load.image("tuiles1n2", "src/assets/fond_base.jpg");
      this.load.image("tuiles2n2", "src/assets/nuages_fond.png");
      this.load.image("tuiles3n2", "src/assets/plateformes1.png");
      // chargement de la carte
      this.load.tilemapTiledJSON("niveau2", "src/assets/niveau_2.tmj");
    }
  
    create() {
      const map4 = this.add.tilemap("niveau2");
      const ts1 = map4.addTilesetImage("fondN2", "tuiles1n2");
      const ts2 = map4.addTilesetImage("nuagesN2", "tuiles2n2");
      const ts3 = map4.addTilesetImage("platformN2", "tuiles3n2");
      const fond = map4.createLayer(
        "calqueN2_fond",
        [ts1, ts2, ts3]
      );
      const nuage1 = map4.createLayer(
        "calqueN2_nuage1",
        [ts1, ts2, ts3]
      );
      const nuages2 = map4.createLayer(
        "calqueN2_nuages2",
        [ts1, ts2, ts3]
      );
      const plateforme = map4.createLayer(
        "calqueN2_plateforme",
        [ts1, ts2, ts3]
      );
      plateforme.setCollisionByProperty({ estSolide: true });

      this.add.text(400, 100, "Vous êtes dans le niveau 2", {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        fontSize: "22pt"
      });
  
      porte_suivante = this.physics.add.staticSprite(1440, 512, "img_porte2"); 

      this.player = this.physics.add.sprite(128, 525, "img_perso");
      this.player.direction = 'right'; 
      this.player.refreshBody();
      this.player.setCollideWorldBounds(true);
  
      this.clavier = this.input.keyboard.createCursorKeys();
      this.boutonFeu = this.input.keyboard.addKey('A');
      this.physics.world.setBounds(0, 0, 1600, 640);
      this.cameras.main.setBounds(0, 0, 1600, 640);
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
          this.player.setTint(0xff0000);
          this.time.delayedCall(1000,
            function () {
              this.player.clearTint();
            },
            null, this);
          this.physics.pause();
          this.time.delayedCall(1000, fct.revenirabase, null, this)
          this.gameOver = true
        }
      },
      this
    ); 
    }
  
    update() {
      fct.deplacement_perso(this.player, this.clavier, this.boutonFeu, this.arme)
      if(Phaser.Input.Keyboard.JustDown(this.clavier.space) == true){
        if (this.physics.overlap(this.player, porte_suivante)) {
          porte_suivante.anims.play("ouverture_porte");
          this.time.delayedCall(1000,
            function () {
              this.game.config.niveau=3
              this.scene.switch("selection");
            }, 
         null, this);}
      }
    }
  }
   