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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mail_util_1 = require("../../../modules/utils/mail.util");
let CronService = class CronService {
    // Runs every day at 9 AM
    async sendDailyMail() {
        try {
            await (0, mail_util_1.sendMail)({
                to: 'test@gmail.com',
                subject: 'Daily Report',
                text: 'This is an automated daily mail from Cron Job',
            });
            console.log('Daily mail sent successfully');
        }
        catch (error) {
            console.error('Cron mail error:', error);
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendDailyMail", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)()
], CronService);
//# sourceMappingURL=cron.service.js.map