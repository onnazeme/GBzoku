/*:
 * @plugindesc オプションに「もどる」コマンドを追加
 * @author hara
 *
 * @help
 * オプションに「もどる」コマンドを追加します。
 * 「もどる」コマンドを実行した時の動きは、オプション画面で
 * キャンセルを押した時のデフォルトの動きと同じです。
 * (表示中の設定が保存されます。)
 * 
 * ・利用規約
 * 禁止事項はありません。
 */


(function() {
    'use strict';

var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function() {
    _Window_Options_makeCommandList.call(this);
    this.addBackOptions();
};

Window_Options.prototype.addBackOptions = function() {
    this.addCommand(TextManager.cancel, 'back');
};

Window_Options.prototype.isBackSymbol = function(symbol) {
    return symbol == 'back';
};

var _Window_Options_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isBackSymbol(symbol)) {
        this.processCancel();
        return;
    }
    _Window_Options_processOk.call(this);
};

var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isBackSymbol(symbol)) return;
    _Window_Options_cursorRight.call(this, wrap);
};

var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isBackSymbol(symbol)) return;
    _Window_Options_cursorLeft.call(this, wrap);
};

var _Window_Options_drawItem = Window_Options.prototype.drawItem;
Window_Options.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var symbol = this.commandSymbol(index);
    this.resetTextColor();
    if (this.isBackSymbol(symbol)) {
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
    } else {
        _Window_Options_drawItem.call(this, index);
    }

};

})();