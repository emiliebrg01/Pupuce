import * as fct from "/src/js/fonction.js";
var dragon;
var nombre;
var gameOver;
var points_vie; var texte_vie;
var argent_joueur; var texte_argent;
var puissance_arme; var texte_arme;
var vie_restante;

export default class niveauboss extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveauboss" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {

    this.load.image("tuilesboss1", "src/assets/spooky.png");
    this.load.image("tuilesboss2", "src/assets/boss_plat.png");
    // chargement de la carte
    this.load.tilemapTiledJSON("carteboss", "src/assets/carte_boss.tmj");
    this.load.image("img_dragon", "src/assets/dragonattend.png");
    this.load.image("mort", "src/assets/perso_mort.png");
    this.load.image("pointvie", "src/assets/vie.png");
    this.load.image("argent", "src/assets/or.png");
    this.load.image("arme", "src/assets/tir.png");

    this.load.spritesheet("dragon_droite", "src/assets/dragondroite.png", {
      frameWidth: 175,
      frameHeight: 128
    });
    this.load.spritesheet("dragon_gauche", "src/assets/dragongauche.png", {
      frameWidth: 175,
      frameHeight: 128
    });

  }

  create() {

    // chargement de la carte du niveau
    const map2 = this.add.tilemap("carteboss");
    // chargement des jeux de tuiles
    const ts1 = map2.addTilesetImage("fond_boss", "tuilesboss1");
    const ts2 = map2.addTilesetImage("plateforme", "tuilesboss2");

    // chargement du calque fond_boss
    const calque_fond = map2.createLayer(
      "fond_boss",
      [ts1, ts2]
    );
    // chargement du calque fond_2
    const calque_fond_2 = map2.createLayer(
      "fond_boss2",
      [ts1, ts2]
    );

    // chargement du calque platform
    const platform = map2.createLayer(
      "plateforme_boss",
      [ts1, ts2]
    );
    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    platform.setCollisionByProperty({ estSolide: true });


    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Battez le dragon des MONARTISTES...", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });


    dragon = this.physics.add.sprite(1376, 525, 'img_dragon');
    dragon.setCollideWorldBounds(true);
    dragon.setBounce(0.2);
    dragon.setCollideWorldBounds(true);
    dragon.pointsVie=200;

    this.player = this.physics.add.sprite(128, 525, "img_perso");
    this.player.direction = 'right'; 
    this.player.refreshBody();
    this.player.setCollideWorldBounds(true);
    this.player.pointsVie = this.game.config.vie_joueur;

    this.clavier = this.input.keyboard.createCursorKeys();
    this.boutonFeu = this.input.keyboard.addKey('A'); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 1600, 640);
    this.cameras.main.setBounds(0, 0, 1600, 500);
    this.cameras.main.startFollow(this.player);
    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(dragon, platform);

    this.anims.create({
      key: "anim_dragon",
      frames: [{ key: "img_dragon" }],
      frameRate: 20
    });

    this.anims.create({
      key: "mort_perso",
      frames: [{ key: "mort" }],
      frameRate: 20
    });

    this.anims.create({
      key: "dragon_vadroite",
      frames: this.anims.generateFrameNumbers("dragon_droite", { start: 0, end: 10}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "dragon_vagauche",
      frames: this.anims.generateFrameNumbers("dragon_gauche", { start: 10, end: 0, step: -1}),
      frameRate: 8,
      repeat: 1
    })

    this.time.delayedCall(3000, nomb_alea, null, this); 
    this.arme = this.physics.add.group();
    this.physics.add.collider(this.player, dragon, touchedragon, null, this);
    this.physics.add.overlap( dragon, this.arme, attaque_drag, null,this);
  
    vie_restante = this.game.config.vie_joueur
    points_vie = this.add.image(100, 75, "pointvie").setDepth(1);
    points_vie.setScrollFactor(0);
    argent_joueur = this.add.image(100, 125, "argent").setDepth(1);
    argent_joueur.setScrollFactor(0);
    puissance_arme = this.add.image(100, 175, "puissance").setDepth(1);
    puissance_arme.setScrollFactor(0);
    texte_vie = this.add.text(150, 75, vie_restante, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_vie.setScrollFactor(0);
    texte_argent = this.add.text(150, 125, this.game.config.argent, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_argent.setScrollFactor(0);
    texte_arme = this.add.text(150, 175, this.game.config.attaque, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    }); texte_arme.setScrollFactor(0);
    this.time.delayedCall(500, affiche_stat, null, this);

    if (gameOver==true){
      this.player.anims.play("mort_perso");
    }
  }



  update() {

    if (nombre==3 ) {
      dragon.anims.play("dragon_vadroite", true);
      dragon.setVelocityX(350);
      dragon.direction = "doite";
     } else if (nombre==1){
      dragon.anims.play("dragon_vagauche", true);
      dragon.setVelocityX(-350);
      dragon.direction = "gauche";
     } else if(nombre==2){
      dragon.anims.play("dragon_vagauche", true);
      dragon.setVelocityX(-350);
      dragon.setVelocityY(-200);
     }else if(nombre==4){
      dragon.anims.play("dragon_vadroite", true);
      dragon.setVelocityX(350);
      dragon.setVelocityY(-200);
     }else {
      dragon.anims.play("anim_dragon", true);
      dragon.setVelocityX(0);
    }

    fct.deplacement_perso(this.player, this.clavier, this.boutonFeu, this.arme)
  }
}

function nomb_alea() {
    if (dragon.x < 384) {
      nombre = Phaser.Math.Between(3, 4);
    } else if(dragon.x > 1248){
      nombre = Phaser.Math.Between(1, 2);
    }else{
      nombre = Phaser.Math.Between(1, 4);
    }
  this.time.delayedCall(1375, dragonattend, null, this);
  this.time.delayedCall(3000, nomb_alea, null, this); 
} 

function dragonattend(){
  nombre=0;
}

function touchedragon() {
  var peutetretoucher = true;
  if (peutetretoucher == true) {
    this.player.setTint(0xff0000);  
    this.time.delayedCall(500, 
      function () {
      this.player.clearTint();
    },
    null, this);
    peutetretoucher = false; 
    this.player.pointsVie-=1;   
}
    this.time.delayedCall(2000,
       function () {
        peutetretoucher = true;
    },
    null, this);
    if(this.player.pointsVie<=0){
    this.physics.pause();
    this.time.delayedCall(3000, fct.revenirabase, null, this)
    gameOver = true;
    }  
} 

function attaque_drag ( dragon, arme) {
  dragon.pointsVie -= this.game.config.attaque;
  if (dragon.pointsVie<=0) {
    dragon.disableBody(true, true); 
    this.scene.switch("victoire");
  }

  arme.destroy();
 // arme.destroy(); // destruction de la balle
  dragon.setTint(0xff0000);
  dragon.anims.play("anim_face");  
  this.time.delayedCall(500, 
    function () {
    dragon.clearTint();
  },
  null, this); 

}

function affiche_stat(){
  texte_vie.setVisible(false);
  texte_vie = this.add.text(150, 60, this.player.pointsVie, {
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