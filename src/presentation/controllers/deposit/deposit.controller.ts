import { Body, Controller, Delete, Get, Param, Post, Query, Put } from '@nestjs/common';
import { DepositService } from 'src/business/services';
import { DepositEntity } from 'src/data/persistence';
import { CreateDepositDTO } from 'src/business/dtos/create-deposit.dto';
import { Logger } from '@nestjs/common/services';
import { PaginationModel } from 'src/data/models';
import { PaginationModelAndDataRange } from 'src/data/models/pagination-and-data-range.model';
;

@Controller('deposit')
export class DepositController {

    constructor(private readonly depositService: DepositService) {}

    @Post('/create')
    createDeposit(@Body() deposit: CreateDepositDTO): DepositEntity {
        return this.depositService.createDeposit(deposit);
    }

    @Get('/find-all')
    findAll(@Body() pagination: PaginationModel): DepositEntity[] {
        return this.depositService.findAll(pagination);
    }

    @Delete('/soft-delete/:id')
    softDelete(@Param('id') id: string): void {
        this.depositService.deleteDeposit(id, true);
    }

    @Delete('/hard-delete/:id')
    hardDelete(@Param('id') id: string): void {
        this.depositService.deleteDeposit(id);
    }

    @Post('/get-history/:id')
    getHistory(@Param('id') id: string, @Body() search: PaginationModelAndDataRange): DepositEntity[] {
        return this.depositService.getAccountHistory(id, search);
    }

    
}
