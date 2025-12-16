"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const messages_constant_1 = require("../../constants/messages.constant");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(data) {
        try {
            // Validation
            if (!data.email || !data.password) {
                throw new common_1.BadRequestException(messages_constant_1.MESSAGES.REQUIRED_FIELDS_MISSING);
            }
            //Check existing user
            const existingUser = await this.userService.findByEmail(data.email);
            if (existingUser) {
                throw new common_1.ConflictException(messages_constant_1.MESSAGES.USER_ALREADY_EXISTS);
            }
            //Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);
            //Save user
            await this.userService.create({
                ...data,
                password: hashedPassword,
            });
            return {
                statusCode: 201,
                message: messages_constant_1.MESSAGES.USER_REGISTERED,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async login(data) {
        try {
            if (!data.email || !data.password) {
                throw new common_1.BadRequestException(messages_constant_1.MESSAGES.REQUIRED_FIELDS_MISSING);
            }
            const user = await this.userService.findByEmail(data.email);
            if (!user) {
                throw new common_1.UnauthorizedException(messages_constant_1.MESSAGES.INVALID_CREDENTIALS);
            }
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException(messages_constant_1.MESSAGES.INVALID_CREDENTIALS);
            }
            const token = this.jwtService.sign({
                id: user._id,
                role: user.role,
            });
            return {
                statusCode: 200,
                message: messages_constant_1.MESSAGES.LOGIN_SUCCESS,
                token,
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map