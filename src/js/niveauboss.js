import * as fct from "/src/js/fonction.js";
var dragon;
var nombre;

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

    this.load.spritesheet("dragon_danse", "src/assets/dragondanse.png", {
      frameWidth: 120,
      frameHeight: 128
    });
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
    dragon.pointsVie=10;

    this.player = this.physics.add.sprite(128, 525, "img_perso");
    this.player.direction = 'right'; 
    this.player.refreshBody();
    this.player.setBounce(0.2);
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
      key: "mort",
      frames: [{ key: "mort" }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_danse",
      frames: this.anims.generateFrameNumbers("dragon_danse", { start: 0, end: 3}),
      frameRate: 10,
      repeat: 1
    })

    this.anims.create({
      key: "dragon_droite",
      frames: this.anims.generateFrameNumbers("dragon_droite", { start: 0, end: 10}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "dragon_gauche",
      frames: this.anims.generateFrameNumbers("dragon_gauche", { start: 10, end: 0, step: -1}),
      frameRate: 8,
      repeat: 1
    })
    var timer = this.time.delayedCall(3000, nomb_alea, null, this); 
    this.arme = this.physics.add.group();
    this.physics.add.collider(this.player, dragon, touchedragon, null, this);
    this.physics.add.overlap( dragon, this.arme, attaque_drag, null,this);
  
  }



  update() {

    if (nombre==3 ) {
      dragon.anims.play("dragon_droite", true);
      dragon.setVelocityX(350);
      dragon.direction = "doite";
    } else if (nombre==10){
      dragon.anims.play("anim_danse", true);
     } else if (nombre==1){
      dragon.anims.play("dragon_gauche", true);
      dragon.setVelocityX(-350);
      dragon.direction = "gauche";
     } else if(nombre==2){
      dragon.anims.play("dragon_gauche", true);
      dragon.setVelocityX(-350);
      dragon.setVelocityY(-200);
     }else if(nombre==4){
      dragon.anims.play("dragon_droite", true);
      dragon.setVelocityX(350);
      dragon.setVelocityY(-200);
     }else {
      dragon.anims.play("anim_dragon", true);
      dragon.setVelocityX(0);
    }

    fct.deplacement_perso(this.player, this.clavier, this.boutonFeu, this.arme)

    if (this.gameOver){
      this.player.anims.play("mort", true);
    }
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

function touchedragon(player, dragon) {
  this.player.setTint(0xff0000);  
  this.time.delayedCall(500, 
    function () {
    this.player.clearTint();
  },
  null, this);
  this.player.pointsVie-=1;
  if(this.player.pointsVie==0){
  this.physics.pause();
  var base = this.time.delayedCall(3000, fct.revenirabase, null, this)
  this.gameOver = true
  }
} 

function attaque_drag ( dragon, arme) {
  dragon.pointsVie--;
  if (dragon.pointsVie==0) {
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
