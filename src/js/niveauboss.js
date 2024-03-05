
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
  }

  create() {


    // chargement de la carte du niveau
    const map2 = this.add.tilemap("carteboss");
    // chargement des jeux de tuiles
    const ts1 = map2.addTilesetImage( "fond", "tuiles1");
    const ts2 = map2.addTilesetImage( "boss_plateforme", "tuiles2");

    // chargement du calque fond_boss
    const calque_fond = map2.createLayer(
      "fond_boss",
      [ts1,ts2]
    );
    // chargement du calque fond_2
    const calque_fond_2 = map2.createLayer(
      "fond_2",
      [ts1,ts2]
    );

    // chargement du calque platform
    const platform = map2.createLayer(
      "platform",
      [ts1,ts2]
    );
    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    platform.setCollisionByProperty({ estSolide: true });


    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Battez le dragon des monartistes...", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });

    this.player = this.physics.add.sprite(128, 525, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 1600, 640);
    this.cameras.main.setBounds(0, 0, 1600, 500);
    this.cameras.main.startFollow(this.player); 
    this.physics.add.collider(this.player, platform);
  }

  update() {
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(200);
      if (this.player.body.blocked.down){
        this.player.anims.play("anim_tourne_droite", true);
      } else  {
        this.player.anims.play("anim_saut_droite", true);
      }
    } 
    else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-200);
      if (this.player.body.blocked.down){
        this.player.anims.play("anim_tourne_gauche", true);
      } else {
        this.player.anims.play("anim_saut_gauche", true);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('anim_face', true);
    } 
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-400);
      if (this.clavier.right.isDown){
        this.player.anims.play("anim_saut_droite", true);
      } else if (this.clavier.left.isDown){
        this.player.anims.play("anim_saut_gauche", true);
      }
   } 
  }
}
 