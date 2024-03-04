
var groupe_plateformes;
var player; // désigne le sprite du joueur
var clavier; 

// définition de la classe "selection"
export default class selection extends Phaser.Scene {
 
    constructor() {
       super({key : "selection"}); // mettre le meme nom que le nom de la classe
    }
  
    preload() {  
      this.load.image("img_ciel", "src/assets/sky.png");
    this.load.image("img_plateforme", "src/assets/platform2.png");
    this.load.image("img_perso","src/assets/perso2.png");
    this.load.spritesheet("img_perso_droite", "src/assets/marchedroite.png", {
      frameWidth: 36,
      frameHeight: 48
    });
    this.load.spritesheet("img_perso_gauche", "src/assets/marchegauche.png", {
      frameWidth: 36,
      frameHeight: 48
    });
    this.load.image('img_porte1', 'src/assets/door1.png');
    this.load.image('img_porte2', 'src/assets/door2.png');
    this.load.image('img_porte3', 'src/assets/door3.png'); 
  }
  
    create()  {
      this.add.image(400, 300, "img_ciel");
    groupe_plateformes = this.physics.add.staticGroup();
    groupe_plateformes.create(200, 584, "img_plateforme");
    groupe_plateformes.create(600, 584, "img_plateforme");
    groupe_plateformes.create(50, 300, "img_plateforme");
    groupe_plateformes.create(600, 450, "img_plateforme");
    groupe_plateformes.create(750, 270, "img_plateforme");
    this.porte1 = this.physics.add.staticSprite(600, 414, "img_porte1");
    this.porte2 = this.physics.add.staticSprite(50, 264, "img_porte2");
    this.porte3 = this.physics.add.staticSprite(750, 234, "img_porte3");
  
    player = this.physics.add.sprite(100, 450, 'img_perso'); 
    player.setCollideWorldBounds(true); 
    this.physics.add.collider(player, groupe_plateformes); 
    player.setBounce(0.2); 
  
    clavier = this.input.keyboard.createCursorKeys(); 
  
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso_gauche", { start: 0, end: 7 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    }); 
  
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso_droite",{start: 0, end:7}),
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    }); 
  }
   
    update()  { 
      if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("anim_tourne_droite", true);
    } 
    else if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("anim_tourne_gauche", true);
    } else {
      player.setVelocityX(0);
      player.anims.play('anim_face');
    } 
    if (clavier.space.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
   } 
   if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
    if (this.physics.overlap(player, this.porte1)) this.scene.switch("niveau1");
    if (this.physics.overlap(player, this.porte2)) this.scene.switch("niveau2");
    if (this.physics.overlap(player, this.porte3)) this.scene.switch("niveau3");
  } 
  }
  
  }
