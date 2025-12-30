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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("../../dtos/create-transaction.dto");
const auth_guard_1 = require("../../guards/auth.guard");
const get_user_decorator_1 = require("../../decorators/get-user.decorator");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    createTransaction(createTransactionDto, user) {
        return this.transactionsService.createTransaction(user.sub, createTransactionDto);
    }
    getTransactionsByUser(user) {
        return this.transactionsService.getTransactionsByUser(user.sub);
    }
    getTransactionsByUserAndFilters(user, month, category, type, search) {
        return this.transactionsService.getTransactionsByUserAndFilters(user.sub, {
            month,
            category,
            type,
            search,
        });
    }
    getMonthlyReport(user, month) {
        return this.transactionsService.getMonthlyReport(user.sub, month);
    }
    updateTransaction(id, updateTransactionDto, user) {
        return this.transactionsService.updateTransaction(user.sub, parseInt(id), updateTransactionDto);
    }
    deleteTransaction(id, user) {
        return this.transactionsService.deleteTransaction(user.sub, parseInt(id));
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "getTransactionsByUser", null);
__decorate([
    (0, common_1.Get)('/filter'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "getTransactionsByUserAndFilters", null);
__decorate([
    (0, common_1.Get)('/report/:month'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "updateTransaction", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "deleteTransaction", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map