const utils = require("./Utils");

cc.Class({
  extends: cc.Component,

  properties: {
    // label: {
    //   default: null,
    //   type: cc.Label,
    // },
    // // defaults, set visually when attaching this script to the Canvas
    // text: "Hello, World!",
    light: cc.Node,
    bgMusic: {
      default: null,
      type: cc.AudioClip,
    },
  },

  // use this for initialization
  onLoad: function () {
    cc.audioEngine.playMusic(this.bgMusic, true);
    cc.tween(this.light)
      .repeatForever(cc.tween().to(1, { opacity: 0 }).to(1, { opacity: 255 }))
      .start();

    this.atlas = null;
    cc.resources.load("atlas/general-sheet", cc.SpriteAtlas, (err, atlas) => {
      if (err) {
        // reject('资源加载失败');
      } else {
        // resolve();
        this.atlas = atlas;
        const animation = utils.addAnimation(
          cc.find("Canvas/miner/leg"),
          this.atlas,
          "miner-leg-",
          3
        );
        animation.play("miner-leg-");
        const animation2 = utils.addAnimation(
          cc.find("Canvas/miner/face"),
          this.atlas,
          "miner-face-whistle-",
          3
        );
        animation2.play("miner-face-whistle-");
      }
    });
  },

  // called every frame
  update: function (dt) {},

  onClickStart() {
    cc.director.loadScene("Game");
  },
});

// node.addComponent(cc.Animation);
// var animation = node.getComponent(cc.Animation);
// var frames = [];
// cc.loader.loadResDir(path, cc.SpriteFrame, (err, assets, urls) => {
//   if (err) {
//     return;
//   }
//   frames = assets;
//   // frames 这是一个 SpriteFrame 的数组.
//   var clip = cc.AnimationClip.createWithSpriteFrames(frames, 20);
//   clip.name = "anim_node";
//   clip.wrapMode = cc.WrapMode.Loop;

//   animation.addClip(clip);
//   animation.play("anim_node");
// });

// cc.loader.loadRes('pokercard', cc.SpriteAtlas, (err, atlas) => {
//   if (err) {
//     // reject('资源加载失败');
//   } else {
//     // resolve();
//   }
// });
// this.atlas = cc.loader.getRes('pokercard', cc.SpriteAtlas);
// this.spBg.spriteFrame = this.atlas.getSpriteFrame('pokercard_back');
