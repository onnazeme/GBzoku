//=============================================================================
// plugin Ayatam_AbsoluteAvoidHitState.js
// ■ 絶対回避・命中ステートMV 対応コアver 1.6.3
//
// (C)2022 ayatam
//=============================================================================
//  【更新内容】
//  2022/3/9 v0.01 試作完成。
//=============================================================================

var Imported = Imported || {};
Imported.Ayatam_AbsoAvoidHitState = true;

var Ayatam = Ayatam || {};
Ayatam.ABOSOAVOIDHIT = Ayatam.ABOSOAVOIDHIT || {};

/*:
 * @target MV
 * @plugindesc 絶対回避・命中ステートMV v0.01
 * ステートに絶対回避・命中の能力を付与する機能を追加
 * @author Ayatam (Another Young Animations)
 * 
 * @help ■ 絶対回避・命中ステートMV
 * 本プラグインは、Core ver 1.6.3 に対応。
 * 
 * 【利用規約】
 * ・改造はご自由に行ってください。
 * ・他サイト様の素材との競合によるエラーには基本、対応しません。
 * ・素材単体でのエラーには対応します。ただし、その責任は負いません。
 * ・アダルト・商業可。
 * 
 * 【素材を使用したゲーム等について】
 * ・作者名、サイト名、URLなどをread_meなどに分かりやすい形で記載してください。
 * 
 *   作者名:ayatam
 *   サイト名:Another Young Animations 公式サイト
 *   URL:https://ayatam.wixsite.com/index
 * 
 * =============================================================================
 *  【プラグイン使用方法】
 *  ・下記を参考の上、スクリプトコマンドを使用し、
 *    ゲーム内で絶対回避・命中ステートを実装してください。
 *  ・本プラグインにはプラグインコマンドはありません。
 *    スクリプトコマンドのみです。
 * 
 *  【仕様】
 *  ・本プラグインの「絶対回避」能力は、その名の通り、
 *    なんでも絶対回避します。
 *    そのため、メモ欄用のコマンドに「絶対回避無視」の
 *    コマンドを用意しました。
 *  ・このコマンドは、回復スキル/アイテムまたは強化スキル/アイテムに
 *    対して使用する目的のコマンドになります。
 *    絶対回避中は、このコマンドがない回復スキル/アイテム等は、
 *    すべて回避されますのでご注意ください。
 *  ・「絶対回避無視」のコマンドを個別化した理由は、
 *    どのスキル/アイテムが絶対回避無視されるべきか
 *    想定ができませんので、本プラグインを使用されるユーザーの方に
 *    設定していただく必要があります。
 *    ご了承の上、ご使用ください。
 * 
 * =============================================================================
 * 
 * =============================================================================
 * 
 *  スクリプトコマンド - メモ欄設定 -
 * 
 * =============================================================================
 * 
 *  ●ステート個別 「絶対命中」
 *  <aah absolute hit>
 *  
 *  ステートのメモ欄に記載することで、
 *  対象ステート付与中に限り、命中率が絶対命中になります。
 * 
 * 【例:1】 ステートID:4 に 絶対命中 効果を付与する場合
 *          ステートID:4 メモ欄に下記コマンドを記載する。
 *          <aah absolute hit>
 * 
 * -----------------------------------------------------------------------------
 * 
 *  ●ステート個別 「絶対回避」
 *  <aah absolute avoid>
 *  
 *  ステートのメモ欄に記載することで、
 *  対象ステート付与中に限り、回避率が絶対回避になります。
 * 
 * 【例:1】 ステートID:4 に 絶対回避 効果を付与する場合
 *          ステートID:4 メモ欄に下記コマンドを記載する。
 *          <aah absolute avoid>
 * 
 * -----------------------------------------------------------------------------
 * 
 *  ●スキル/アイテム個別 「絶対回避無視」
 *  <aah Ignore avoid>
 *  
 *  スキル・アイテムのメモ欄に記載することで、
 *  絶対回避ステートが付与されている対象への絶対回避無効化を行います。
 * 
 * 【例:1】 スキルID:4 に 絶対回避無視 効果を付与する場合
 *          スキルID:4 メモ欄に下記コマンドを記載する。
 *          <aah Ignore avoid>
 * 
 * 【例:1】 アイテムID:1 に 絶対回避無視 効果を付与する場合
 *          アイテムID:1 メモ欄に下記コマンドを記載する。
 *          <aah Ignore avoid>
 * 
 * =============================================================================
 */

//=============================================================================
//
// - プラグイン本体 - ここから下は変更禁止 -
//
//=============================================================================

//=============================================================================
// Game_Party - 絶対回避・命中ステートMV用のセットアップ
//=============================================================================

var _AbsoAvoidHitState_Game_Party_prototype_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    _AbsoAvoidHitState_Game_Party_prototype_initialize.call(this);
    this.aahSetup();
};

Game_Party.prototype.aahSetup = function() {
    this.getAahAllNoteInformation();
};
//--------------------------------------------------------------------------
// ● 全スキル/ステート/アイテムメモ設定の参照
//--------------------------------------------------------------------------
Game_Party.prototype.getAahAllNoteInformation = function() {
    $dataStates.forEach(state => {
        if(state) {
          this.getAahStateNoteInformation(state);  
        };
    });
    $dataSkills.forEach(skill => {
        if(skill) {
          this.getAahSkillNoteInformation(skill);  
        };
    });
    $dataItems.forEach(item => {
        if(item) {
          this.getAahItemNoteInformation(item);  
        };
    });
};
//--------------------------------------------------------------------------
// ● ステートメモ設定の取得
//--------------------------------------------------------------------------
Game_Party.prototype.getAahStateNoteInformation = function(state) {
    if($dataStates[state.id].aahNoteLoaded !== undefined) return;
    $dataStates[state.id].aahNoteLoaded = true;
    $dataStates[state.id].aahAbsoAvoid = false;
    $dataStates[state.id].aahAbsoHit = false;
    var lists = state.note.split(/[\r\n]+/);
    lists.forEach(note => {
        if(note !== "") {
            //絶対回避能力の取得
            if(note.match(/<aah absolute avoid>/i)) {
                $dataStates[state.id].aahAbsoAvoid = true;
            };
            //絶対命中能力の取得
            if(note.match(/<aah absolute hit>/i)) {
                $dataStates[state.id].aahAbsoHit = true;
            };
        };
    });
};
//--------------------------------------------------------------------------
// ● スキルメモ設定の取得
//--------------------------------------------------------------------------
Game_Party.prototype.getAahSkillNoteInformation = function(skill) {
    if($dataSkills[skill.id].aahNoteLoaded !== undefined) return;
    $dataSkills[skill.id].aahNoteLoaded = true;
    $dataSkills[skill.id].aahIgnore = false;
    var lists = skill.note.split(/[\r\n]+/);
    lists.forEach(note => {
        if(note !== "") {
            //絶対回避能力の無視の取得
            if(note.match(/<aah Ignore avoid>/i)) {
                $dataSkills[skill.id].aahIgnore = true;
            };
        };
    });
};
//--------------------------------------------------------------------------
// ● アイテムメモ設定の取得
//--------------------------------------------------------------------------
Game_Party.prototype.getAahItemNoteInformation = function(item) {
    if($dataItems[item.id].aahNoteLoaded !== undefined) return;
    $dataItems[item.id].aahNoteLoaded = true;
    $dataItems[item.id].aahIgnore = false;
    var lists = item.note.split(/[\r\n]+/);
    lists.forEach(note => {
        if(note !== "") {
            //絶対回避能力の無視の取得
            if(note.match(/<aah Ignore avoid>/i)) {
                $dataItems[item.id].aahIgnore = true;
            };
        };
    });
};

//=============================================================================
// Game_Party - 絶対回避・命中ステートMV用のセットアップ
//=============================================================================

var _AbsoAvoidHitState_Game_Action_prototype_itemEva = Game_Action.prototype.itemEva;
Game_Action.prototype.itemEva = function(target) {
    if (this.aahGetAbosoluteAvoidState(target) && !this.aahGetIgnoreAvoidState()) {
        return 100000000000;
    } else if (this.aahGetAbosoluteHitState()) {
        return 0;
    } else {
        return _AbsoAvoidHitState_Game_Action_prototype_itemEva.call(this,target);
    }
};

Game_Action.prototype.aahGetAbosoluteAvoidState = function(target) {
    var result = false;
    target._states.forEach(state => {
        if(state) {
            if($dataStates[state].aahAbsoAvoid) result = true;
        };
    });
    return result;
};

Game_Action.prototype.aahGetAbosoluteHitState = function() {
    var subject = this.subject();
    var result = false;
    subject._states.forEach(state => {
        if(state) {
            if($dataStates[state].aahAbsoHit) result = true;
        };
    });
    return result;
};

Game_Action.prototype.aahGetIgnoreAvoidState = function() {
    var item = this.item();
    var result = false;
    if(item.aahIgnore !== undefined) {
        if(item.aahIgnore) result = true;
    };
    return result;
};

//=============================================================================
// プラグイン終了 - End of file
//=============================================================================