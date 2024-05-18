Window_Base.prototype.standardFontFace = function() {
    return 'GameFont';
};
//BGSの選択肢を省略
Window_Options.prototype.addVolumeOptions = function() {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume');
    //this.addCommand(TextManager.bgsVolume, 'bgsVolume');
    this.addCommand(TextManager.meVolume, 'meVolume');
    this.addCommand(TextManager.seVolume, 'seVolume');
};


//初期音量
ConfigManager.readVolume = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return Number(value).clamp(0, 100);
    } else {
    	if (name == 'cvVolume') {
    		return 100;
    	} else {
    		return 40;
        }
    }
};
//タイトル画面のコンティニューを消す
Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    //this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.options,   'options');
};
Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    //this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};
//タイトルコマンドのウィンドウの幅
Window_TitleCommand.prototype.windowWidth = function() {
    if (DKTools.Localization.locale === 'zh-tw') {
        return 180;
    } else {
    	return 220;}
};
//タイトルコマンドのy軸を調整
Window_TitleCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 146;
};

//MPを表示しない
Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 315);
};

//パーティコマンドを飛ばし、直接アクター0のアクターコマンドを表示
Scene_Battle.prototype.changeInputWindow = function() {
    if (BattleManager.isInputting()) {
       BattleManager._actorIndex = 0;
        this.startActorCommandSelection();
    } else {
        this.endCommandSelection();
    }
};

//アクターのステートアイコンの位置を変える
Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
//    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    var icons = actor.allIcons().slice(0, 1);
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i - 157, y + 38);
    }
};
// HPゲージの描画
var _Window_Base_prototype_drawGauge = Window_Base.prototype.drawGauge;
Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate) ;
    var gaugeY = y + this.lineHeight() - 8;
    var gaugeBB = y + this.lineHeight() - 9;
    this.contents.fillRect(x - 1, gaugeBB - 1, width + 2, 8, this.textColor(0));
    this.contents.fillRect(x, gaugeY - 1, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY - 1, fillW, 6, color1, color2);
};
//  HPゲージ位置調整
Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x+70, y, width-70, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x+70, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};
// 名前表示の広さ調整
Window_Base.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.hpColor(actor));
    this.drawText(actor.name(), x, y, width+50);
};


// バトル時のウィンドウの幅調整
Window_ActorCommand.prototype.windowWidth = function() {
    return 288;
};
Window_BattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - 288;
};
Window_PartyCommand.prototype.windowWidth = function() {
    return 288;
};

//ヘルプウィンドウ(スキル説明)の改変
Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 1);
    Window_Base.prototype.initialize.call(this, 0, 372, width, height);
    this._text = '';
};

//ヘルプウィンドウの表示、非表示
Window_Selectable.prototype.setHelpWindow = function(helpWindow) {
 　if($gameSwitches.value(6)){
 　	   this._helpWindow = helpWindow;
 　	   this.callUpdateHelp();
    }
};

//常時ダッシュの項目を消す
Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.commandRemember, 'commandRemember');
};

//行動順のランダム性を無くす
Game_Action.prototype.speed = function() {
    var agi = this.subject().agi;
    //var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    var speed = agi;
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};
