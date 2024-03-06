import * as fct from "/src/js/fonction.js";
var player; // désigne le sprite du joueur
var clavier;
var boutonFeu;
var boutonAcheter;
var arme;
var gameOver = false;
var grenouille;
var text_gren;
var hist;

// définition de la classe "selection"
export default class selection extends Phaser.Scene {

  constructor() {
    super({ key: "selection" }); // mettre le meme nom que le nom de la classe
  }

  preload() {
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
    this.load.image('img_porteboss', 'src/assets/boss_door.png');
    this.load.image("arme", "src/assets/shuriken.png");
    this.load.spritesheet('img_porte2', 'src/assets/porte_niveaux.png',{
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

    this.load.image("text_hist1", "src/assets/img_hist1.png"); 
    this.load.image("text_hist2", "src/assets/img_hist2.png"); 
    this.load.image("text_hist3", "src/assets/img_hist3.png"); 
    this.load.image("text_hist4", "src/assets/img_hist4.png"); 
    this.load.image("text_hist5", "src/assets/img_hist5.png")
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


    this.porteboss = this.physics.add.staticSprite(448, 426, "img_porteboss");
    this.porte2 = this.physics.add.staticSprite(960, 2058, "img_porte2");
    player = this.physics.add.sprite(448, 1792, 'img_perso');
    player.direction = 'right';
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    grenouille = this.physics.add.staticSprite(1408, 1184, 'img_gren_saut');

    // ajout d'une collision entre le joueur et le calque plateformes
    this.physics.add.collider(player, calque_plateformes);

    clavier = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey('A');
    boutonAcheter = this.input.keyboard.addKey('$');


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

    //pour variable locale
    arme = this.physics.add.group();
    var timer = this.time.delayedCall(900, saut_grenouille, null, this);
    this.text_gren = this.add.image(800, 500, "text_gren");
    this.text_gren.setScrollFactor(0);
    this.text_gren.setVisible(false);
    this.text_gren.estVisible = false;  

    this.text_hist = this.add.image(800, 500, "text_hist1");
    this.text_hist.setScrollFactor(0);
    hist=1;
    /*
    this.add.text(960, 1920, "Niveau" + this.game.config.niveau {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });
    */

    //pour variable globale
    this.game.config.niveau=1;
    this.game.config.vie_joueur=1;
    this.game.config.argent=0;


      
  }

  update() {
    fct.deplacement_perso(player, clavier, boutonFeu, arme)
      
    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
      if (hist==1 ){
        this.text_hist.setVisible(false);
        this.text_hist = this.add.image(800, 500, "text_hist2");
        this.text_hist.setScrollFactor(0);
        hist=2;
    
      } else if (hist==2){
          this.text_hist.setVisible(false);
          this.text_hist = this.add.image(800, 500, "text_hist3");
          this.text_hist.setScrollFactor(0);
          hist=3;
        }
       else if (hist==3){
          this.text_hist.setVisible(false);
          this.text_hist = this.add.image(800, 500, "text_hist4");
          this.text_hist.setScrollFactor(0);
          hist=4;
        } else if (hist==4){
          this.text_hist.setVisible(false);
          this.text_hist = this.add.image(800, 500, "text_hist5");
          this.text_hist.setScrollFactor(0);
          hist=5;
        } else if (hist==5){
          this.text_hist.setVisible(false);
        }

      if (this.physics.overlap(player, this.porteboss)) {this.scene.switch("niveauboss");}

      if (this.physics.overlap(player, this.porte2)) {
        this.porte2.anims.play("ouverture_porte");
        var timerniveau = this.time.delayedCall(1000,
          function () {
            if (this.game.config.niveau==1){
              this.scene.switch("niveau1");
            }
          }, 
       null, this);}
      
       if (this.physics.overlap(player, grenouille)){
        if ( this.text_gren.estVisible == true){
          this.text_gren.setVisible(false);
          this.text_gren.estVisible = false;
        } else {this.text_gren.setVisible(true);
          this.text_gren.estVisible = true;
        }
        


      if (this.physics.overlap(player, grenouille) && Phaser.Input.Keyboard.JustDown(boutonAcheter)){
        console.log("nombre");
      }
      //if (this.physics.overlap(player, this.porte2)) this.scene.switch("niveau2");
      //if (this.physics.overlap(player, this.porte3)) this.scene.switch("niveau3");
    }
  }
}
}

function saut_grenouille(){;
  grenouille.anims.play("saut_gren");
  var timer= this.time.delayedCall(1125, saut_grenouille, null, this);
}

function Histoire(hist){
  if (hist==1 ){
    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true){
      this.text_hist = this.add.image(800, 500, "text_hist2");
      this.text_hist.setScrollFactor(0);
      hist=2;
    }
  } else if (hist==2){
    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true){
      this.text_hist = this.add.image(800, 500, "text_hist3");
      this.text_hist.setScrollFactor(0);
      hist=3;
    }
  } else if (hist==3){
    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true){
      this.text_hist = this.add.image(800, 500, "text_hist4");
      this.text_hist.setScrollFactor(0);
      hist=4;
    } else if (hist==2){
      if (Phaser.Input.Keyboard.JustDown(clavier.space) == true){
        this.text_hist = this.add.image(800, 500, "text_hist3");
        this.text_hist.setScrollFactor(0);
        hist=3;
      }
    } else {
      this.text_hist.setVisible(false);
    }
  }
}