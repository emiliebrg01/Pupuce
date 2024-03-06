export function deplacement_perso(player, clavier, boutonFeu, armes){
    if (clavier.right.isDown) {
        player.direction = 'right';
        player.setVelocityX(200);
        if (player.body.blocked.down) {
          player.anims.play("anim_tourne_droite", true);
        } else {
          player.anims.play("anim_saut_droite", true);
        }
      }
      else if (clavier.left.isDown) {
        player.direction = 'left';
        player.setVelocityX(-200);
        if (player.body.blocked.down) {
          player.anims.play("anim_tourne_gauche", true);
        } else {
          player.anims.play("anim_saut_gauche", true);
        }
      } else {
        player.setVelocityX(0);
        player.anims.play('anim_face', true);
      }
      if (clavier.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-500);
        if (clavier.right.isDown) {
          player.anims.play("anim_saut_droite", true);
        } else if (clavier.left.isDown) {
          player.anims.play("anim_saut_gauche", true);
        }
      }
  
      if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
        tirer(player, armes);
      }
}

export function tirer(player, armes) {
    var coefDir;
    if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
    // on crée la balle a coté du joueur
    var arme = armes.create(player.x + (25 * coefDir), player.y - 4, 'arme');
    // parametres physiques de la balle.
    arme.setCollideWorldBounds(true);
    arme.body.allowGravity = false;
    arme.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
  }  

export function revenirabase(){
    this.scene.restart();
    this.scene.switch("selection");
    this.gameOver = false;
    
  }