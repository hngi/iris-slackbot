"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var ConvoSchema = new Schema({
    user: { type: String, required: true },
    conversations: [{ type: Schema.Types.Mixed }]
}, { timestamps: true });
exports.Convo = mongoose_1.default.model('Convo', ConvoSchema);
