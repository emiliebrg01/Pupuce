import * as fct from "/src/js/fonction.js";
var porte_suivante;
var argent_joueur;
var texte_argent;

export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1"
    });
  }
  preload() {
    this.load.image("lestuiles1", "src/assets/fond_base.jpg");
    this.load.image("lestuiles2", "src/assets/nuages_fond.png");
    this.load.image("lestuiles3", "src/assets/plateformes1.png");
    // chargement de la carte
    this.load.tilemapTiledJSON("niveau1", "src/assets/niveau_1.tmj");
    this.load.tilemapTiledJSON("niveau1bis", "src/assets/niveau_1bis.tmj")
    this.load.image("mort", "src/assets/perso_mort.png");
    this.load.image("argent", "src/assets/or.png");
  }

  create() {
    const map3 = this.add.tilemap("niveau1");
    const ts1 = map3.addTilesetImage("fondN", "lestuiles1");
    const ts2 = map3.addTilesetImage("nuagesN", "lestuiles2");
    const ts3 = map3.addTilesetImage("platformN", "lestuiles3");
    const fond = map3.createLayer(
      "calqueN_fond",
      [ts1, ts2, ts3]
    );
    const nuage1 = map3.createLayer(
      "calqueN_nuage1",
      [ts1, ts2, ts3]
    );
    const nuages2 = map3.createLayer(
      "calqueN_nuage2",
      [ts1, ts2, ts3]
    );
    const plateforme = map3.createLayer(
      "calqueN_plateforme",
      [ts1, ts2, ts3]
    );
    plateforme.setCollisionByProperty({ estSolide: true });

    this.add.text(400, 100, "Vous êtes dans le niveau 1", {
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
          this.physics.pause();
          this.time.delayedCall(1000, fct.revenirabase, null, this)
          this.gameOver = true
        }
      },
      this
    );

    this.anims.create({
      key: "mort",
      frames: [{ key: "mort" }],
      frameRate: 20
    });

    argent_joueur = this.add.image(100, 125, "argent").setDepth(1);
    argent_joueur.setScrollFactor(0);
    texte_argent = this.add.text(150, 110, this.game.config.argent, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_argent.setScrollFactor(0);
    this.time.delayedCall(500, affiche_stat, null, this);
  }

  update() {
    fct.deplacement_perso(this.player, this.clavier, this.boutonFeu, this.arme)
    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, porte_suivante)) {
        porte_suivante.anims.play("ouverture_porte");
        this.time.delayedCall(1000,
          function () {
            this.game.config.niveau = 2
            this.game.config.argent += 200;
            this.scene.switch("niveau2");
          },
          null, this);
      }
    }
    if (this.gameOver) {
      this.player.anims.play("mort", true);
    }
  }
}

function affiche_stat(){
  texte_argent.setVisible(false)
  texte_argent = this.add.text(150, 110, this.game.config.argent, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt"
  }); texte_argent.setScrollFactor(0);
  this.time.delayedCall(500, affiche_stat, null, this);
}