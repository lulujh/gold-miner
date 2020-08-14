const utils = require("./Utils");
const config = require("./Config");

const HOOK_ROTATE = 0;
const HOOK_EMIT = 1;
const HOOK_PULL = 2;

cc.Class({
  extends: cc.Component,

  properties: {
    //钩子速度
    speed: {
      default: 4,
      displayName: "钩子速度",
    },
    //钩子旋转速度
    rotateSpeed: {
      default: 1.5,
      displayName: "钩子旋转速度",
    },
    //钩子范围
    hookRange: {
      default: 70,
      displayName: "钩子旋转角度范围",
    },
    hook: cc.Node,
    hookItem: cc.Node,
    scoreLabel: cc.Label,
    targetLabel: cc.Label,
    levelLabel: cc.Label,
    timerLabel: cc.Label,
    // itemPanel: cc.Node,
    // bgMusic: {
    //   default: null,
    //   type: cc.AudioClip,
    // },
  },

  onLoad() {
    // cc.audioEngine.playMusic(this.bgMusic, true);
    let manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
    // manager.enabledDrawBoundingBox = true;
    this.time = 60;
    this.level = 1;
    this.score = 0;
    this.target = 0;
    this.hookHeight = this.hook.height;

    this.itemPanel = cc.find("Canvas/item-panel");
    this.itemPanel.getComponent(cc.Widget).updateAlignment();
    this.itemArr = [];
    let children = cc.find("Canvas/item-temp").children;
    for (let i = 0; i < children.length; i++) {
      children[i].active = false;
      this.itemArr.push(children[i]);
    }

    this.setLevelInfo();
    this.addAnimation();
  },

  addAnimation() {
    cc.resources.load("atlas/miner-sheet-1", cc.SpriteAtlas, (err, atlas) => {
      if (!err) {
        this.atlas = atlas;
        this.minerAnimation = utils.addAnimation(
          cc.find("Canvas/miner"),
          this.atlas,
          "miner-pull-light-",
          6,
          "pull"
        );
        // this.minerAnimation.play("pull");
      }
    });
  },

  update(dt) {
    switch (this.hookState) {
      case HOOK_ROTATE:
        if (this.hook.angle >= this.hookRange) {
          this.rotateSpeed = -this.rotateSpeed;
        } else if (this.hook.angle <= -this.hookRange) {
          this.rotateSpeed = Math.abs(this.rotateSpeed);
        }
        this.hook.angle += this.rotateSpeed;
        break;
      case HOOK_EMIT:
        this.hook.height += this.speed;
        break;
      case HOOK_PULL:
        if (this.hook.height <= this.hookHeight) {
          this.resetState();
          this.score += this.gainScore;
          this.scoreLabel.string = this.score;
          if (this.itemPanel.children.length == 0) {
            this.unschedule(this.timerCallback);
            this.gameOver();
          }
        } else {
          this.hook.height -= this.speed;
        }
        break;
    }
  },

  resetState() {
    this.hookState = HOOK_ROTATE;
    this.hook.height = this.hookHeight;
    this.minerAnimation && this.minerAnimation.stop("pull");
    this.speed = 4;
    this.hookItem.removeAllChildren();
  },

  emitHook() {
    if (this.hookState) return;
    this.hookState = HOOK_EMIT;
  },

  catchItem(item) {
    if (this.hookState != HOOK_EMIT) return;
    // cc.log(item);
    this.gainScore = 0;
    this.hookState = HOOK_PULL;
    this.minerAnimation && this.minerAnimation.play("pull");
    this.speed = 4;
    if (item.group === "Wall") return;
    item.group = "default";
    item.x = 0;
    item.y = 0;
    item.angle = -this.hook.angle;
    item.parent = this.hookItem;
    item.anchorY = 0.9;
    this.speed = config[item.name].speed;
    this.gainScore = config[item.name].score;
  },

  setLevelInfo() {
    this.itemPanel.removeAllChildren();
    this.hookState = HOOK_ROTATE;
    this.setTimer();
    this.levelLabel.string = this.level;
    this.score = 0;
    this.scoreLabel.string = this.score;
    this.target = 1000 + (this.level - 1) * 500;
    this.targetLabel.string = this.target;

    let itemsScore = this.target * 1.5;
    let tempScore = 0;
    while (tempScore < itemsScore) {
      const n = utils.randomRangeInt(0, this.itemArr.length);
      const node = cc.instantiate(this.itemArr[n]);
      node.parent = this.itemPanel;
      node.position = this.randomPos();
      node.active = true;
      tempScore += config[node.name].score;
    }
    cc.log(this.itemPanel.width);
    cc.log(this.itemPanel.getContentSize());
  },

  randomPos() {
    let randX = ((this.itemPanel.width - 30) / 2) * utils.randomRange(-1, 1);
    let randY = ((this.itemPanel.height - 30) / 2) * utils.randomRange(-1, 1);
    return cc.v2(randX, randY);
  },

  setTimer() {
    this.time = 60;
    this.timerLabel.string = this.time;
    this.timerCallback = function () {
      this.time--;
      this.timerLabel.string = this.time;
      if (this.time == 0) {
        this.unschedule(this.timerCallback);
        this.gameOver();
      }
    };
    this.schedule(this.timerCallback, 1);
  },

  gameOver() {
    cc.director.pause();
    const gameOver = cc.find("Canvas/game-over");
    if (this.score >= this.target) {
      this.bSuccess = true;
      cc.find("btn-next/label", gameOver).getComponent(cc.Label).string =
        "下一关";
    } else {
      this.bSuccess = false;
      cc.find("btn-next/label", gameOver).getComponent(cc.Label).string =
        "退出游戏";
    }
    gameOver.active = true;
  },

  onClickRestart() {
    cc.find("Canvas/game-over").active = false;
    cc.director.resume();
    this.resetState();
    this.setLevelInfo();
  },

  onClickNext() {
    if (this.bSuccess) {
      cc.find("Canvas/game-over").active = false;
      cc.director.resume();
      this.resetState();
      this.level++;
      this.setLevelInfo();
    } else {
      cc.director.resume();
      cc.director.loadScene("Home");
    }
  },
});
