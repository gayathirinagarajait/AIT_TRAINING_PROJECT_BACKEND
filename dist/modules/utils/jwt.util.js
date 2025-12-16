"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = (jwtService, payload) => {
    return jwtService.sign(payload);
};
exports.generateToken = generateToken;
//# sourceMappingURL=jwt.util.js.map