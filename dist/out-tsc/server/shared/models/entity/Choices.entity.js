"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var PlayerOwned_1 = require("./PlayerOwned");
var Choice_1 = require("../Choice");
var Choices = /** @class */ (function (_super) {
    tslib_1.__extends(Choices, _super);
    function Choices() {
        var _this = _super.call(this) || this;
        if (!_this.choices)
            _this.choices = [];
        return _this;
    }
    Object.defineProperty(Choices.prototype, "$choicesData", {
        get: function () {
            return { choices: this.choices, size: this.size };
        },
        enumerable: true,
        configurable: true
    });
    // basic functions
    Choices.prototype.calcSize = function (player) {
        return player.$statistics.get('Game/Premium/Upgrade/ChoiceLogSize');
    };
    Choices.prototype.init = function (player) {
        this.updateSize(player);
        this.choices = this.choices.map(function (choice) {
            var choiceRef = new Choice_1.Choice();
            choiceRef.init(choice);
            return choiceRef;
        });
        this.choices = this.choices.filter(function (x) { return x.id !== 'PartyLeave'; });
    };
    Choices.prototype.updateSize = function (player) {
        this.size = this.calcSize(player);
    };
    Choices.prototype.removeAllChoices = function () {
        this.choices = [];
    };
    Choices.prototype.removeChoice = function (choice) {
        lodash_1.pull(this.choices, choice);
    };
    Choices.prototype.getChoice = function (choiceId) {
        return lodash_1.find(this.choices, { id: choiceId });
    };
    Choices.prototype.addChoice = function (player, choice) {
        this.choices.unshift(choice);
        if (this.choices.length > this.size) {
            var poppedChoice = lodash_1.last(this.choices);
            player.increaseStatistic("Character/Choose/Ignore", 1);
            this.makeDecision(player, poppedChoice, poppedChoice.choices.indexOf(poppedChoice.defaultChoice));
        }
    };
    Choices.prototype.makeDecision = function (player, choice, decisionSlot, doRemove) {
        if (doRemove === void 0) { doRemove = true; }
        player.increaseStatistic("Character/Choose/Choice/" + choice.choices[decisionSlot], 1);
        player.increaseStatistic("Character/Choose/Total", 1);
        if (player.$personalities.isActive('Affirmer')) {
            player.increaseStatistic("Character/Choose/Personality/Affirmer", 1);
        }
        if (player.$personalities.isActive('Denier')) {
            player.increaseStatistic("Character/Choose/Personality/Denier", 1);
        }
        if (player.$personalities.isActive('Indecisive')) {
            player.increaseStatistic("Character/Choose/Personality/Indecisive", 1);
        }
        if (doRemove)
            this.removeChoice(choice);
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Choices.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Choices.prototype, "choices", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Choices.prototype, "size", void 0);
    Choices = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Choices);
    return Choices;
}(PlayerOwned_1.PlayerOwned));
exports.Choices = Choices;
//# sourceMappingURL=Choices.entity.js.map