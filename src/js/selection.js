import * as fct from "/src/js/fonction.js";
var player; // désigne le sprite du joueur
var clavier;
var boutonFeu;
var boutonAcheter;
var arme;
var grenouille;
var toucan;
var lion;
var loup;
var hist;
var text_niv;
var bout;
var bouton_regle;
var points_vie; var texte_vie;
var argent_joueur; var texte_argent;
var puissance_arme; var texte_arme;

// définition de la classe "selection"
export default class selection extends Phaser.Scene {

  constructor() {
    super({ key: "selection" }); // mettre le meme nom que le nom de la classe
  }

  preload() {
    //personnages
    this.load.image("img_perso", "src/assets/perso.png");
    this.load.spritesheet("img_perso_droite", "src/assets/courir_droite.png", {
      frameWidth: 61,
      frameHeight: 64
    });
    this.load.spritesheet("img_perso_gauche", "src/assets/courir_gauche.png", {
      frameWidth: 61,
      frameHeight: 64
    });
    this.load.spritesheet("saut_droite", "src/assets/sautdroite.png", {
      frameWidth: 48,
      frameHeight: 64
    });
    this.load.spritesheet("saut_gauche", "src/assets/sautgauche.png", {
      frameWidth: 48,
      frameHeight: 64
    });
    this.load.spritesheet("img_gren_saut", "src/assets/grenouille.png", {
      frameWidth: 50,
      frameHeight: 192
    });
    this.load.image("toucan", "src/assets/imgtoucan.png");
    this.load.image("lion", "src/assets/lion.png");
    this.load.image("loup", "src/assets/loup.png");
    this.load.image('img_porteboss', 'src/assets/boss_door.png');
    this.load.image("arme", "src/assets/shuriken.png");
    this.load.spritesheet('img_porte2', 'src/assets/porte_niveaux.png', {
      frameWidth: 98.75,
      frameHeight: 128
    });


    // chargement tuiles de jeu
    this.load.image("tuilesdejeu1", "src/assets/fond_base.jpg");
    this.load.image("tuilesdejeu2", "src/assets/nuages_fond.png");
    this.load.image("tuilesdejeu3", "src/assets/plateformes1.png");
    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/carte_base.tmj");
    this.load.image("text_gren", "src/assets/img_text_gren.png");
    this.load.image("text_lion", "src/assets/img_text_lion.png");
    this.load.image("text_loup", "src/assets/img_text_loup.png");

    //histoire
    this.load.image("text_hist1", "src/assets/img_hist1.png");
    this.load.image("text_hist2", "src/assets/img_hist2.png");
    this.load.image("text_hist3", "src/assets/img_hist3.png");
    this.load.image("text_hist4", "src/assets/img_hist4.png");
    this.load.image("text_hist5", "src/assets/img_hist5.png");
    this.load.image("text_hist6", "src/assets/img_hist6.png");
    this.load.image("text_hist7", "src/assets/img_hist7.png")

    this.load.image("regle1", "src/assets/bouton_regle.png");
    this.load.image("regle2", "src/assets/bouton_regle2.png");
    this.load.image("texte_regle", "src/assets/regles.png");

    this.load.image("pointvie", "src/assets/vie.png");
    this.load.image("argent", "src/assets/or.png");
    this.load.image("puissance", "src/assets/tir.png");
  }





  create() {
    //this.porte3 = this.physics.add.staticSprite(750, 234, "img_porte3");

    // chargement de la carte du niveau
    const map = this.add.tilemap("carte");
    // chargement des jeux de tuiles
    const ts1 = map.addTilesetImage("fond", "tuilesdejeu1");
    const ts2 = map.addTilesetImage("nuages_fond", "tuilesdejeu2");
    const ts3 = map.addTilesetImage("plateformes", "tuilesdejeu3");


    // chargement du calque calque_background
    const calque_fond = map.createLayer(
      "calque_fond",
      [ts1, ts2, ts3]);
    // chargement du calque calque_background_2
    const calque_fond_2 = map.createLayer(
      "calque_fond_2",
      [ts1, ts2, ts3]);
    const calque_fond_3 = map.createLayer(
      "calque_fond_3",
      [ts1, ts2, ts3]);
    const calque_fond_4 = map.createLayer(
      "calque_fond_4",
      [ts1, ts2, ts3]);
    // chargement du calque calque_plateformes
    const calque_plateformes = map.createLayer(
      "calque_plateformes",
      [ts1, ts2, ts3]);
    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    calque_plateformes.setCollisionByProperty({ estSolide: true });

    grenouille = this.physics.add.staticSprite(1408, 1184, 'img_gren_saut');
    toucan = this.physics.add.staticSprite(608, 2048, "toucan");
    lion = this.physics.add.staticSprite(704, 448, "lion");
    loup = this.physics.add.staticSprite(288, 1152, "loup");

    this.porteboss = this.physics.add.staticSprite(448, 426, "img_porteboss");
    this.porte2 = this.physics.add.staticSprite(960, 2058, "img_porte2");
    player = this.physics.add.sprite(448, 1792, 'img_perso');
    player.direction = 'right';
    player.setCollideWorldBounds(true);

    // ajout d'une collision entre le joueur et le calque plateformes
    this.physics.add.collider(player, calque_plateformes);

    clavier = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A');
    boutonAcheter = this.input.keyboard.addKey('E');


    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 1600, 2560);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 1600, 2560);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);

    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso_gauche", { start: 5, end: 0, step: -1 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso_droite", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_saut_droite",
      frames: this.anims.generateFrameNumbers("saut_droite", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_saut_gauche",
      frames: this.anims.generateFrameNumbers("saut_gauche", { start: 6, end: 0, step: -1 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso" }],
      frameRate: 20
    });

    this.anims.create({
      key: "saut_gren",
      frames: this.anims.generateFrameNumbers("img_gren_saut", { start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: "ouverture_porte",
      frames: this.anims.generateFrameNumbers("img_porte2", { start: 0, end: 3 }),
      frameRate: 6,
      repeat: 0
    })

    this.anims.create({
      key: "fermeture_porte",
      frames: this.anims.generateFrameNumbers("img_porte2", { start: 3, end: 0, step: -1 }),
      frameRate: 6,
      repeat: 0
    })

    //pour variable locale
    arme = this.physics.add.group();
    this.time.delayedCall(900, saut_grenouille, null, this);
    this.text_gren = this.add.image(800, 500, "text_gren");
    this.text_gren.setScrollFactor(0);
    this.text_gren.setVisible(false);
    this.text_gren.estVisible = false;

    this.text_lion = this.add.image(800, 500, "text_lion");
    this.text_lion.setScrollFactor(0);
    this.text_lion.setVisible(false);
    this.text_lion.estVisible = false;

    this.text_loup = this.add.image(800, 500, "text_loup");
    this.text_loup.setScrollFactor(0);
    this.text_loup.setVisible(false);
    this.text_loup.estVisible = false;

    this.text_hist = this.add.image(800, 500, "text_hist1");
    this.text_hist.setScrollFactor(0);
    hist = 1;

    //pour variable globale
    this.game.config.niveau = 1;
    this.game.config.vie_joueur = 1;
    this.game.config.argent = 0;
    this.game.config.attaque = 1;

    text_niv = this.add.text(910, 1936, "Niveau " + this.game.config.niveau, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });
    this.time.delayedCall(500, affiche_niv, null, this);

    points_vie = this.add.image(100, 75, "pointvie").setDepth(1);
    points_vie.setScrollFactor(0);
    argent_joueur = this.add.image(100, 125, "argent").setDepth(1);
    argent_joueur.setScrollFactor(0);
    puissance_arme = this.add.image(100, 175, "puissance").setDepth(1);
    puissance_arme.setScrollFactor(0);
    texte_vie = this.add.text(150, 60, this.game.config.vie_joueur, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_vie.setScrollFactor(0);
    texte_argent = this.add.text(150, 110, this.game.config.argent, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_argent.setScrollFactor(0);
    texte_arme = this.add.text(150, 160, this.game.config.attaque, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_arme.setScrollFactor(0);
    this.time.delayedCall(500, affiche_stat, null, this);

    this.regle = this.add.image(800, 320, "texte_regle").setDepth(10);
    this.regle.setVisible(false)
    bouton_regle = this.add.image(1400, 100, "regle1").setDepth(1);
    bouton_regle.setInteractive();
    bouton_regle.setScrollFactor(0);
    bout = false;
    bouton_regle.on("pointerup",()=>{
      if(bout==true){
        this.regle.setVisible(false);
        bouton_regle.clearTint();
        bout = false;
      } else if (bout==false){
        this.regle.setVisible(true);
        this.regle.setScrollFactor(0);
        bouton_regle.setTint(0x808080);
        bout = true;
      }
    })
  }




  update() {
    fct.deplacement_perso(player, clavier, boutonFeu, arme)

    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
      if (hist == 1) {
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist2");
        this.text_hist.setScrollFactor(0);
        hist = 2;

      } else if (hist == 2) {
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist3");
        this.text_hist.setScrollFactor(0);
        hist = 3;
      }
      else if (hist == 3) {
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist4");
        this.text_hist.setScrollFactor(0);
        hist = 4;
      } else if (hist == 4) {
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist5");
        this.text_hist.setScrollFactor(0);
        hist = 5;
      } else if (hist == 5) {
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist6");
        this.text_hist.setScrollFactor(0);
        hist = 6;
      } else if (hist == 6) {
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist7").setDepth(10);
        this.text_hist.setScrollFactor(0);
        hist = 7;
      } else if (hist == 7) {
        this.text_hist.setVisible(false);
        this.time.delayedCall(1125, function () {
          this.text_hist.estVisible = false
        }, null, this);
      }

      if (this.physics.overlap(player, this.porteboss)) { this.scene.switch("niveauboss"); }

      if (this.physics.overlap(player, this.porte2)) {
        this.porte2.anims.play("ouverture_porte");
        this.time.delayedCall(1000,
          function () {
            if (this.game.config.niveau == 1) {
              this.scene.switch("niveau1");
              this.porte2.anims.play("fermeture_porte");
            } else if (this.game.config.niveau == 2) {
              this.scene.switch("niveau2");
              this.porte2.anims.play("fermeture_porte");
            }
          },
          null, this);
      }
      if (this.physics.overlap(player, toucan) && this.text_hist.estVisible == false) {
        hist = 5
        this.text_hist.estVisible = true;
      }

      if (this.physics.overlap(player, grenouille)) {
        if (this.text_gren.estVisible == true) {
          this.text_gren.setVisible(false);
          this.text_gren.estVisible = false;
        } else {
          this.text_gren.setVisible(true);
          this.text_gren.estVisible = true;
        }
      }
      if (this.physics.overlap(player, lion)) {
        if (this.text_lion.estVisible == true) {
          this.text_lion.setVisible(false);
          this.text_lion.estVisible = false;
        } else {
          this.text_lion.setVisible(true);
          this.text_lion.estVisible = true;
        }
      }
      if (this.physics.overlap(player, loup)) {
        if (this.text_loup.estVisible == true) {
          this.text_loup.setVisible(false);
          this.text_loup.estVisible = false;
        } else {
          this.text_loup.setVisible(true);
          this.text_loup.estVisible = true;
        }
      }
    }
    if (Phaser.Input.Keyboard.JustDown(boutonAcheter)) {
      if (this.physics.overlap(player, grenouille)) {
        if(this.game.config.argent>=50){
        this.game.config.attaque += 3;
        this.game.config.argent-=50;
        }
      }
    }
    if (Phaser.Input.Keyboard.JustDown(boutonAcheter)) {
      if (this.physics.overlap(player, loup)) {
        if(this.game.config.argent>=50){
        this.game.config.vie_joueur += 3;
        this.game.config.argent-=50;
        }
      }
    }

  }
}

function saut_grenouille() {
  ;
  grenouille.anims.play("saut_gren");
  this.time.delayedCall(1125, saut_grenouille, null, this);
}

function affiche_niv() {
  text_niv.setVisible(false);
  text_niv = this.add.text(910, 1936, "Niveau " + this.game.config.niveau, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt"
  });
  this.time.delayedCall(300, affiche_niv, null, this);
}

function affiche_stat(){
  texte_vie.setVisible(false);
  texte_vie = this.add.text(150, 60, this.game.config.vie_joueur, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt"
  }); texte_vie.setScrollFactor(0);
  texte_argent.setVisible(false)
  texte_argent = this.add.text(150, 110, this.game.config.argent, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt"
  }); texte_argent.setScrollFactor(0);
  texte_arme.setVisible(false)
  texte_arme = this.add.text(150, 160, this.game.config.attaque, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt"
  }); texte_arme.setScrollFactor(0);
  this.time.delayedCall(500, affiche_stat, null, this);
}