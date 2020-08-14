module.exports = {
  addAnimation(
    node,
    atlas,
    spFrameStr,
    sample,
    clipName,
    wrapMode = cc.WrapMode.Loop
  ) {
    if (!clipName) {
      clipName = spFrameStr;
    }
    let animation = node.getComponent(cc.Animation);
    if (!animation) {
      animation = node.addComponent(cc.Animation);
    }
    let frames = [];
    for (let i = 0; i < sample; i++) {
      frames.push(atlas.getSpriteFrame(spFrameStr + i));
    }
    let clip = cc.AnimationClip.createWithSpriteFrames(frames, sample);
    clip.name = clipName;
    clip.wrapMode = wrapMode;

    animation.addClip(clip);
    // animation.play(clipName);
    // return { animation, clipName };
    return animation;
  },

  randomRange(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomRangeInt(min, max) {
    return Math.floor(this.randomRange(min, max));
  },
};
