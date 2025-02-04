/*
 * --------------------------------------------------
 * MNKR_RandomEnemies.js
 *   Ver.1.0.5
 * Copyright (c) 2020 Munokura
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * --------------------------------------------------
 */

/*:
 * @target MZ MV
 * @url https://raw.githubusercontent.com/munokura/MNKR-MZ-plugins/master/MNKR_RandomEnemies.js
 * @plugindesc 敵グループの敵キャラをランダムに入れ替えます。
 * @help
 * 敵グループの敵キャラをランダムに入れ替えます。
 *
 * 敵キャラのメモ欄に下記のようにタグを入れてください。
 * <RandomEnemy:敵キャラID>
 * <RandomEnemy:敵キャラID,敵キャラID,敵キャラID>
 * 0は非表示になります。
 *
 * 例
 * <RandomEnemy:0,0,1,1,2,3>
 * 
 * 注意！
 * 下記のタグは無限ループが発生するため、使用しないでください。
 * <RandomEnemy:0>
 *
 * プラグインコマンドはありません。
 *
 *
 * 利用規約:
 *   MITライセンスです。
 *   https://licenses.opensource.jp/MIT/MIT.html
 *   作者に無断で改変、再配布が可能で、
 *   利用形態（商用、18禁利用等）についても制限はありません。
 */

(() => {
    'use strict';

    const _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function (troopId) {
        _Game_Troop_setup.call(this, troopId);
        let condition = true;
        while (condition) {
            this.clear();
            this._troopId = troopId;
            this._enemies = [];
            this.troop().members.forEach(function (member) {
                const randomEnemyId = selectEnemyId($dataEnemies[member.enemyId]);
                //const enemy = new Game_Enemy(randomEnemyId || member.enemyId, member.x, member.y);
                const enemy = new Game_Enemy(randomEnemyId || member.enemyId, member.x, member.y);
                if (randomEnemyId === 0 || member.hidden) {
                    enemy.hide();
                } else {
                    condition = false;
                };
                this._enemies.push(enemy);
            }, this);
            this.makeUniqueNames();
        };
    };

    function selectEnemyId(enemyArray) {
        if (!enemyArray.meta.RandomEnemy) {
            return null;
        };
        //const pool = enemyArray.meta.RandomEnemy.split(',').map(Number);
        //return Number(pool[Math.randomInt(pool.length)]);
        //自分用に改造、1の時は9番目のキャラ、それ以外は10番目のキャラ
        //ショータ7が10番目の場合だけ、ショータを左にする（でないと縄の命中判定がめんどい）
         if (enemyArray.meta.RandomEnemy == 1) {
         	 if ($gameVariables.value(11)[9] == 7) {
         	 	  return 7;
         	 } else {
         	 	 return $gameVariables.value(11)[8];
         	 };
         } else {
         	 if ($gameVariables.value(11)[9] == 7) {
         	 	 return $gameVariables.value(11)[8];
         	 } else {
         	 	 return $gameVariables.value(11)[9];
         	 };
        };
    };
})();
