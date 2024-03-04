
var groupe_plateformes;
var player; // désigne le sprite du joueur
var clavier; 

// définition de la classe "selection"
export default class selection extends Phaser.Scene {
 
    constructor() {
       super({key : "selection"}); // mettre le meme nom que le nom de la classe
    }
  
    preload() {  
      //this.load.image("img_ciel", "src/assets/sky.png");
    //this.load.image("img_plateforme", "src/assets/platform2.png");


    this.load.image("img_perso","src/assets/perso.png");
    this.load.spritesheet("img_perso_droite", "src/assets/courirdroite.png", {
      frameWidth: 38,
      frameHeight: 40
    });
    this.load.spritesheet("img_perso_gauche", "src/assets/courirgauche.png", {
      frameWidth: 38,
      frameHeight: 40
    });
    this.load.spritesheet("saut_droite", "src/assets/sautdroite.png",{
      frameWidth: 30,
      frameHeight: 40
    });
    this.load.spritesheet("saut_gauche", "src/assets/sautgauche.png",{
      frameWidth: 30,
      frameHeight: 40
    });
    //this.load.image('img_porte1', 'src/assets/door1.png');
    //this.load.image('img_porte2', 'src/assets/door2.png');
    //this.load.image('img_porte3', 'src/assets/door3.png');


    // chargement tuiles de jeu
    this.load.image("tuilesdejeu1", "src/assets/fond_base.png");
    this.load.image("tuilesdejeu2", "src/assets/nuages_fond.png");
    this.load.image("tuilesdejeu3", "src/assets/plateformes1.png");
    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/carte_base.tmj");  
  }
  


    create()  {
     // this.add.image(400, 300, "img_ciel");
    //groupe_plateformes = this.physics.add.staticGroup();
    //groupe_plateformes.create(200, 584, "img_plateforme");
    //groupe_plateformes.create(600, 584, "img_plateforme");
    //groupe_plateformes.create(50, 300, "img_plateforme");
    //groupe_plateformes.create(600, 450, "img_plateforme");
    //groupe_plateformes.create(750, 270, "img_plateforme");
    //this.porte1 = this.physics.add.staticSprite(600, 414, "img_porte1");
    //this.porte2 = this.physics.add.staticSprite(50, 264, "img_porte2");
    //this.porte3 = this.physics.add.staticSprite(750, 234, "img_porte3");

    // chargement de la carte du niveau
    const map = this.add.tilemap("carte");
    // chargement des jeux de tuiles
    const ts1 = map.addTilesetImage( "fond", "tuilesdejeu1");
    const ts2 = map.addTilesetImage( "nuages_fond", "tuilesdejeu2");
    const ts3 = map.addTilesetImage( "plateformes", "tuilesdejeu3");
    // chargement des calques
    const calque = map.createDynamicLayer( "tiled_calque", [ts1, ts2, ts3]);

    // chargement du calque calque_background
    const calque_fond = carteDuNiveau.createLayer(
      "calque_fond",
      calque
    );
    // chargement du calque calque_background_2
    const calque_fond_2 = carteDuNiveau.createLayer(
      "calque_fond_2",
      calque
    );
    const calque_fond_3 = carteDuNiveau.createLayer(
      "calque_fond_3",
      calque
    );
    const calque_fond_4 = carteDuNiveau.createLayer(
      "calque_fond_4",
      calque
    );
    // chargement du calque calque_plateformes
    const calque_plateformes = carteDuNiveau.createLayer(
      "calque_plateformes",
      calque
    );
    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    calque_plateformes.setCollisionByProperty({ estSolide: true });

  
    player = this.physics.add.sprite(100, 450, 'img_perso'); 
    player.setCollideWorldBounds(true); 
    this.physics.add.collider(player, groupe_plateformes); 
    player.setBounce(0.2); 

    // ajout d'une collision entre le joueur et le calque plateformes
    this.physics.add.collider(player, plateformes); 
  
    clavier = this.input.keyboard.createCursorKeys(); 
  
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso_gauche", { start: 5, end: 0, step: -1  }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    }); 
  
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso_droite",{start: 0, end:5}),
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: "anim_saut_droite",
      frames: this.anims.generateFrameNumbers("saut_droite",{start: 0, end:6}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_saut_gauche",
      frames: this.anims.generateFrameNumbers("saut_gauche",{start: 6, end:0, step: -1}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso" }],
      frameRate: 20
    }); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 1600, 2560);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 1600, 2560);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);  

  }
   
    update()  { 
      if (clavier.right.isDown) {
      player.setVelocityX(160);
      if (player.body.touching.down){
        player.anims.play("anim_tourne_droite", true);
      }
    } 
    else if (clavier.left.isDown) {
      player.setVelocityX(-160);
      if (player.body.touching.down){
        player.anims.play("anim_tourne_gauche", true);
      }
    } else {
      player.setVelocityX(0);
      player.anims.play('anim_face', true);
    } 
    if (clavier.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-330);
      if (clavier.right.isDown){
        player.anims.play("anim_saut_droite", true);
      } else if (clavier.left.isDown){
        player.anims.play("anim_saut_gauche", true);
      }
   } 
   //if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
    //if (this.physics.overlap(player, this.porte1)) this.scene.switch("niveau1");
    //if (this.physics.overlap(player, this.porte2)) this.scene.switch("niveau2");
    //if (this.physics.overlap(player, this.porte3)) this.scene.switch("niveau3");
  //} 
  }
  
  }
