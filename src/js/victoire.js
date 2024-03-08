import * as fct from "/src/js/fonction.js";
var boss;
var personnage;


export default class victoire extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
      super({
        key: "victoire" 
      });
    }
    preload() {
      this.load.image("tuilesvictoire1", "src/assets/boss_plat.png");
      this.load.image("tuilesvictoire2", "src/assets/paillette.png");
      //this.load.image("text_gagne", "src/assets/texte_gagne.png");
      // chargement de la carte
      this.load.tilemapTiledJSON("victoire", "src/assets/victoire.tmj");
      this.load.image("text_histfin1", "src/assets/img_histfin1.png"); 
      this.load.image("text_histfin2", "src/assets/img_histfin2.png");
      this.load.image("caca", "src/assets/caca.png")
      this.load.spritesheet("dragon_quidanse", "src/assets/dragondanse.png", {
        frameWidth: 230,
        frameHeight: 224
      });
      this.load.spritesheet("perso_danse", "src/assets/persodanse.png", {
        frameWidth: 60.75,
        frameHeight: 96
      });
    }
    create() {
      const map_fin = this.add.tilemap("victoire");
      const ts1 = map_fin.addTilesetImage("ile_victoire", "tuilesvictoire1");
      const ts2 = map_fin .addTilesetImage("fond_victoire", "tuilesvictoire2");
      const fond_vict = map_fin.createLayer(
        "calque_fondvictoire",
        [ts1, ts2]
      );
      const plateforme = map_fin.createLayer(
        "calque_platevictoire",
        [ts1, ts2]
      );

      this.caca = this.physics.add.staticSprite(1088, 576, "caca");
      boss = this.physics.add.staticSprite(650, 410, "dragon_quidanse");
      personnage = this.physics.add.staticSprite(800, 470, "perso_danse");
      this.clavier = this.input.keyboard.createCursorKeys();

      this.anims.create({
        key: "danse_perso",
        frames: this.anims.generateFrameNumbers("perso_danse", { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      })
  
      this.anims.create({
        key: "danse_dragon",
        frames: this.anims.generateFrameNumbers("dragon_quidanse", { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      })

      this.add.text(500, 100, "VICTOIRE!!!", {
        fontFamily: 'Cooper Black',
        fontSize: "40pt",
        color: 'black'
      });

      this.text_histoirefin = this.add.image(800, 300, "text_histfin1");
      this.text_histoirefin.setScrollFactor(0);
      this.histoire=1;
      this.time.delayedCall(500, animation, null, this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
            if (this.histoire==1 ){
              this.text_histoirefin.setVisible(false);
              this.text_histoirefin = this.add.image(700, 300, "text_histfin2");
              this.text_histoirefin.setScrollFactor(0);
              this.histoire=2;
            } else if (this.histoire==2){
                this.text_histoirefin.setVisible(false);
            }
        }
    }
} 

function animation(){
    boss.anims.play("danse_dragon")
    personnage.anims.play("danse_perso")
    this.time.delayedCall(500, animation, null, this);
}