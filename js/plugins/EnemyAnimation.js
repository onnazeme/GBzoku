//=============================================================================
// Sprite_Enemy メソッド拡張
//=============================================================================
Sprite_Enemy.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = '';
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this._spriteCnt = 1;
    this._sleepCnt = 0;
    this.createStateIconSprite();
};

Sprite_Enemy.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var enemy = $dataEnemies[this._enemy._enemyId];
    var nownumber = 0;
     //最終戦の場合だけ特殊。10番目のキャラなら1。10番目が7の場合以外
      if(this._enemy._enemyId == $gameVariables.value(11)[9] && this._enemy._enemyId !=7){
              nownumber = 1;}
    //最終戦の場合だけ特殊。10番目が7の場合,9番目のキャラなら1。
      if(this._enemy._enemyId == $gameVariables.value(11)[8] && $gameVariables.value(11)[9] == 7){
              nownumber = 1;}
     //敵アニメのコマ数
    var animation = $gameVariables.value(2)[nownumber];
    var name = this._enemy.battlerName();
    var hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue || (animation && enemy.meta.baseName)) {
           if(animation && enemy.meta.baseName){
     	 	 // スピード
                if(this._sleepCnt > $gameVariables.value(3)[nownumber]){
                    this._spriteCnt = animation > this._spriteCnt ? ++this._spriteCnt : 1;
                    this._sleepCnt = 0;
                }else{
                    this._sleepCnt++;
                }
                var baseNm = enemy.meta.baseName;
                name = baseNm + this._spriteCnt;
            }
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name, hue);
        /* ここをコメントアウトでアニメーションしながら消えるアニメーションが行われるようになったけどなぜかよくわかってない← */
        //this.initVisibility();
    }
};

Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.initLoadPictures();
    this.setHome(battler.screenX(), battler.screenY());
    this._stateIconSprite.setup(battler);
};

Sprite_Enemy.prototype.initLoadPictures = function() {
    var enemy = $dataEnemies[this._enemy._enemyId];
    var nownumber = 0;
     //最終戦の場合だけ特殊。10番目のキャラなら1
    if(this._enemy._enemyId == $gameVariables.value(11)[9]){
              nownumber = 1;}
    var animation = $gameVariables.value(2)[nownumber];
    if (animation && enemy.meta.baseName) {
        for(var i = 1; i <= animation; i++){
            var baseNm = enemy.meta.baseName;
            var name = baseNm + i;
            this.loadBitmap(name, this._enemy.battlerHue());
        }
    }
};
