cc.Class({
  extends: cc.Component,

  properties: {},

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {},

  // update (dt) {},

  onCollisionEnter: function (other, self) {
    cc.find("Canvas").getComponent("Game").catchItem(other.node);
  },
});
