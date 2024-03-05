var dragon;
var nombre;
var armes;

export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveauboss" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {

    this.load.image("tuiles1", "src/assets/spooky.png");
    this.load.image("tuiles2", "src/assets/boss_plat.png");
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
    const ts1 = map2.addTilesetImage("fond", "tuiles1");
    const ts2 = map2.addTilesetImage("boss_plateforme", "tuiles2");

    // chargement du calque fond_boss
    const calque_fond = map2.createLayer(
      "fond_boss",
      [ts1, ts2]
    );
    // chargement du calque fond_2
    const calque_fond_2 = map2.createLayer(
      "fond_2",
      [ts1, ts2]
    );

    // chargement du calque platform
    const platform = map2.createLayer(
      "platform",
      [ts1, ts2]
    );
    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    platform.setCollisionByProperty({ estSolide: true });


    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Battez le dragon des monartistes...", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });


    dragon = this.physics.add.sprite(1376, 525, 'img_dragon');
    dragon.setCollideWorldBounds(true);
    dragon.setBounce(0.2);
    dragon.setCollideWorldBounds(true);

    this.player = this.physics.add.sprite(128, 525, "img_perso");
    this.player.direction = 'right'; 
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

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
    armes = this.physics.add.group();
    this.physics.add.collider(this.player, dragon, touchedragon, null, this);
    this.physics.add.overlap(armes, dragon, attaque, null,this);
  
  }



  update() {

    if (nombre==1 ) {
      dragon.anims.play("dragon_droite", true);
      dragon.setVelocityX(200);
      dragon.direction = "doite";
    } else if (nombre==10){
      dragon.anims.play("anim_danse", true);
     } else if (nombre==2){
      dragon.anims.play("dragon_gauche", true);
      dragon.setVelocityX(-200);
      dragon.direction = "gauche";
     } else {
      dragon.anims.play("anim_dragon", true);
      dragon.setVelocityX(0);
    }

    if (this.clavier.right.isDown) {
      this.player.direction = 'right';
      this.player.setVelocityX(200);
      if (this.player.body.blocked.down) {
        this.player.anims.play("anim_tourne_droite", true);
      } else {
        this.player.anims.play("anim_saut_droite", true);
      }
    }
    else if (this.clavier.left.isDown) {
      this.player.direction = 'left';
      this.player.setVelocityX(-200);
      if (this.player.body.blocked.down) {
        this.player.anims.play("anim_tourne_gauche", true);
      } else {
        this.player.anims.play("anim_saut_gauche", true);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('anim_face', true);
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-500);
      if (this.clavier.right.isDown) {
        this.player.anims.play("anim_saut_droite", true);
      } else if (this.clavier.left.isDown) {
        this.player.anims.play("anim_saut_gauche", true);
      }
    }
    if (this.gameOver){
      this.player.anims.play("mort", true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.boutonFeu)) {
      tirer(this.player);
    }
  }
}

function nomb_alea() {
  nombre = Phaser.Math.Between(0, 2);
  //console.log(nombre);
  var temps = this.time.delayedCall(1375, dragonattend, null, this);
  var timer = this.time.delayedCall(3000, nomb_alea, null, this); 
} 

function dragonattend(){
  nombre=0;
}

function touchedragon(player, dragon) {
  this.physics.pause();
  var base = this.time.delayedCall(3000, revenirabase, null, this)
  this.gameOver = true
} 

function revenirabase(){
  this.scene.restart();
  this.scene.switch("selection");
  this.gameOver = false;
}

function attaque (arme, dragon) {
  arme.destroy(); // destruction de la balle
  dragon.setTint(0xff0000);
  dragon.anims.play("anim_face");  
  this.time.delayedCall(500, 
    function () {
    dragon.clearTint();
  },
  null, this); 
} 

function tirer(player) {
  var coefDir;
if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
  // on crée la balle a coté du joueur
  var arme = armes.create(player.x + (25 * coefDir), player.y - 4, 'arme');
  // parametres physiques de la balle.
  arme.setCollideWorldBounds(true);
  arme.body.allowGravity =false;
  arme.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
}  