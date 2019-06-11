"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var fs = require("fs");
var StateMachine = require("javascript-state-machine");
var _ = require("lodash");
var readline = require("readline");
var NcCodes_1 = require("../NcCodes");
var CannedCycle_1 = require("./CannedCycle");
var Toolpath_1 = require("./Toolpath");
var typings_1 = require("../typings");
var transitions = [
    { name: "start-toolpath", from: "idle", to: "toolpathing" },
    { name: "end-toolpath", from: "toolpathing", to: "idle" },
    { name: "start-canned-cycle", from: "toolpathing", to: "in-canned-cycle" },
    { name: "end-canned-cycle", from: "in-canned-cycle", to: "toolpathing" }
];
var Program = /** @class */ (function () {
    function Program(filepath) {
        this.fsm();
        this.rawLines = [];
        this.blocks = [];
        this.fileStream = readline.createInterface({
            crlfDelay: Infinity,
            input: fs.createReadStream(filepath)
        });
        this.position = {
            curr: { X: 0, Y: 0, Z: 0, B: 0 },
            prev: { X: 0, Y: 0, Z: 0, B: 0 }
        };
        this.absinc = NcCodes_1.MODALS.ABSOLUTE;
        this.toolpaths = [];
    }
    Program.prototype.toString = function () {
        return this.rawLines.join("\n");
    };
    Program.prototype.getToolpathCount = function () {
        return this.toolpaths.length;
    };
    Program.prototype.getPosition = function () {
        return this.position.curr;
    };
    Program.prototype.getPrevPosition = function () {
        return this.position.prev;
    };
    Program.prototype.updatePosition = function (block) {
        var _this = this;
        var axes = ["B", "X", "Y", "Z"];
        var position = block.getPosition();
        this.position.prev = this.position.curr;
        axes.forEach(function (axis) {
            if (position[axis]) {
                if (_this.absinc === NcCodes_1.MODALS.INCREMENTAL) {
                    _this.position.curr[axis] += position[axis];
                }
                if (_this.absinc === NcCodes_1.MODALS.ABSOLUTE) {
                    _this.position.curr[axis] = position[axis];
                }
            }
        });
    };
    Program.prototype.process = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var toolpath, _b, _c, line, block, cannedCycle, point, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        toolpath = null;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _b = __asyncValues(this.fileStream);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                        line = _c.value;
                        if (line !== "") {
                            block = new typings_1.Block(line);
                            this.blocks.push(block);
                            this.rawLines.push(line);
                            this.setModals(block);
                            if (block.O) {
                                this.number = block.O;
                                this.title = block.comment;
                            }
                            if (block.hasMovement()) {
                                this.updatePosition(block);
                            }
                            if (block.isStartOfCannedCycle() && this.is("toolpathing")) {
                                this.startCannedCycle();
                                cannedCycle = new CannedCycle_1.CannedCycle(block);
                                toolpath.cannedCycles.push(cannedCycle);
                            }
                            if (this.is("in-canned-cycle") && block.G80 === true) {
                                this.endCannedCycle();
                            }
                            if (this.is("in-canned-cycle") && block.hasMovement()) {
                                point = _.clone(this.position.curr);
                                _.last(toolpath.cannedCycles).addPoint(point);
                            }
                            if (line[0] === "N") {
                                if (this.is("toolpathing")) {
                                    this.endToolpath();
                                    this.toolpaths.push(toolpath);
                                }
                                if (this.is("idle")) {
                                    toolpath = new Toolpath_1.Toolpath(line);
                                    this.startToolpath();
                                }
                            }
                            // If we're toolpathing and `line` is not empty, save it to the toolpath
                            if ((this.is("toolpathing") || this.is("in-canned-cycle")) &&
                                line !== "" &&
                                line !== " ") {
                                toolpath.lines.push(line);
                            }
                        }
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(_b)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        this.endToolpath();
                        this.toolpaths.push(toolpath);
                        return [2 /*return*/];
                }
            });
        });
    };
    Program.prototype.describe = function (options) {
        var output = "Program #" + this.number + " " + this.title + "\n";
        output +=
            "---------------------------------------------------------------------------------------\n";
        this.toolpaths.forEach(function (toolpath) {
            if (toolpath.hasFeedrates()) {
                // const feedrates = toolpath.getFeedrates()
                output += chalk.magenta("T" + _.padEnd(toolpath.tool.num, 3));
                output += " | ";
                output += chalk.blue(toolpath.tool.desc + "\n");
                if (options.cannedCycles && toolpath.cannedCycles.length > 0) {
                    toolpath.cannedCycles.forEach(function (cannedCycle) {
                        output += chalk(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{greenBright ", "}"], ["{greenBright ", "}"])), cannedCycle.retractCommand);
                        output += chalk(templateObject_2 || (templateObject_2 = __makeTemplateObject([", {greenBright ", "}"], [", {greenBright ", "}"])), cannedCycle.cycleCommand);
                        output += chalk(templateObject_3 || (templateObject_3 = __makeTemplateObject([" with {yellow ", "} points\n"], [" with {yellow ", "} points\\n"])), cannedCycle.getPointCount());
                        if (options.cannedPoints) {
                            cannedCycle.getPoints().forEach(function (position) {
                                output += "X" + position.X + ", Y" + position.Y + "\n";
                            });
                        }
                    });
                }
                // const minFeedrate = chalk.red.bold(_.min(feedrates).toFixed(3))
                // const average = _.sum(feedrates) / feedrates.length
                // const averageFeedrate = chalk.red.bold(average.toFixed(3))
                // const meanFeedrate = chalk.red.bold(_.mean(feedrates).toFixed(3))
                // const maxFeedrate = chalk.red.bold(_.max(feedrates).toFixed(3))
                // console.log(`${toolNum} | ${toolDesc} | MIN: ${minFeedrate} MAX: ${maxFeedrate} MEAN: ${meanFeedrate}`)
            }
        });
        return output;
    };
    Program.prototype.setModals = function (block) {
        if (block.G00) {
            this.rapfeed = NcCodes_1.MODALS.RAPID;
        }
        if (block.G01) {
            this.rapfeed = NcCodes_1.MODALS.FEED;
        }
        if (block.G90) {
            this.absinc = NcCodes_1.MODALS.ABSOLUTE;
        }
        if (block.G91) {
            this.absinc = NcCodes_1.MODALS.INCREMENTAL;
        }
    };
    return Program;
}());
exports.default = StateMachine.factory(Program, {
    init: "idle",
    transitions: transitions
});
var templateObject_1, templateObject_2, templateObject_3;
