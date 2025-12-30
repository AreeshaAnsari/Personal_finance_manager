"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./entities/user.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const budget_entity_1 = require("./entities/budget.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const budgets_module_1 = require("./modules/budgets/budgets.module");
const auth_guard_1 = require("./guards/auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [user_entity_1.User, transaction_entity_1.Transaction, budget_entity_1.Budget],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, transaction_entity_1.Transaction, budget_entity_1.Budget]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
            auth_module_1.AuthModule,
            transactions_module_1.TransactionsModule,
            budgets_module_1.BudgetsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, auth_guard_1.AuthGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map