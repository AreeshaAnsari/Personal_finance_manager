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
exports.BudgetsController = void 0;
const common_1 = require("@nestjs/common");
const budgets_service_1 = require("./budgets.service");
const create_budget_dto_1 = require("../../dtos/create-budget.dto");
const auth_guard_1 = require("../../guards/auth.guard");
const get_user_decorator_1 = require("../../decorators/get-user.decorator");
let BudgetsController = class BudgetsController {
    budgetsService;
    constructor(budgetsService) {
        this.budgetsService = budgetsService;
    }
    createBudget(createBudgetDto, user) {
        return this.budgetsService.createBudget(user.sub, createBudgetDto);
    }
    getBudgetsByUser(user) {
        return this.budgetsService.getBudgetsByUser(user.sub);
    }
    checkBudgetAlerts(user, month) {
        return this.budgetsService.checkBudgetAlerts(user.sub, month);
    }
    updateBudget(id, updateBudgetDto, user) {
        return this.budgetsService.updateBudget(user.sub, parseInt(id), updateBudgetDto);
    }
    deleteBudget(id, user) {
        return this.budgetsService.deleteBudget(user.sub, parseInt(id));
    }
};
exports.BudgetsController = BudgetsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_budget_dto_1.CreateBudgetDto, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "createBudget", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "getBudgetsByUser", null);
__decorate([
    (0, common_1.Get)('/alerts/:month'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "checkBudgetAlerts", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "updateBudget", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "deleteBudget", null);
exports.BudgetsController = BudgetsController = __decorate([
    (0, common_1.Controller)('budgets'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [budgets_service_1.BudgetsService])
], BudgetsController);
//# sourceMappingURL=budgets.controller.js.map