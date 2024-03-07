import * as fct from "/src/js/fonction.js";

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
    }
    update() {}
}