"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const transaction_entity_1 = require("../../entities/transaction.entity");
const user_entity_1 = require("../../entities/user.entity");
const transactions_service_1 = require("./transactions.service");
const transactions_controller_1 = require("./transactions.controller");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction, user_entity_1.User]),
            jwt_1.JwtModule.register({
                secret: 'finance_manager_secret_key',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        providers: [transactions_service_1.TransactionsService],
        controllers: [transactions_controller_1.TransactionsController],
        exports: [transactions_service_1.TransactionsService],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map