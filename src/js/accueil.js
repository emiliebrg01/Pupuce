import * as fct from "/src/js/fonction.js";

export default class accueil extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
      super({
        key: "accueil" 
      });
    }
    preload() {
        this.load.image("tuiles1", "src/assets/fond_base.jpg");
      this.load.image("tuiles2", "src/assets/nuages_fond.png");
      this.load.image("tuiles3", "src/assets/plateformes1.png");
      this.load.image("tuiles4", "src/assets/boss_plat.png");
      this.load.image("tuiles5", "src/assets/chateau.png");
      this.load.image("play", "src/assets/bouton_debut.png");
      this.load.image("titre", "src/assets/titre.png");
      // chargement de la carte
      this.load.tilemapTiledJSON("accueil", "src/assets/accueil.tmj");
    }
    create() {
      const map_acc = this.add.tilemap("accueil");
      const ts1 = map_acc.addTilesetImage("fond", "tuiles1");
      const ts2 = map_acc.addTilesetImage("nuage", "tuiles2");
      const ts3 = map_acc.addTilesetImage("plateform", "tuiles3");
      const ts4 = map_acc.addTilesetImage("deco", "tuiles4");
      const ts5 = map_acc.addTilesetImage("chateau", "tuiles5");
      const fond = map_acc.createLayer(
        "calque_fond",
        [ts1, ts2, ts3, ts4, ts5]
      );
      const nuage1 = map_acc.createLayer(
        "calque_nuage",
        [ts1, ts2, ts3, ts4, ts5]
      );
      const nuages2 = map_acc.createLayer(
        "calque_chateau",
        [ts1, ts2, ts3, ts4, ts5]
      );
      const plateforme = map_acc.createLayer(
        "calque_plate",
        [ts1, ts2, ts3, ts4, ts5]
      );

      var bouton_play = this.add.image(650, 600, "play").setDepth(1);
      bouton_play.setInteractive();
      this.play = this.add.image(650, 130, "titre");

      bouton_play.on("pointerup",()=>{
        this.scene.switch("selection");
      })
    }
    update() {}
}