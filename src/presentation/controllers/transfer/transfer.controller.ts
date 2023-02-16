import { Controller, Param, Post, Get, Delete, Query } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { TransferService } from 'src/business/services';
import { DataRangeModel, PaginationModel } from 'src/data/models';
import { TransferEntity } from 'src/data/persistence';
import { CreateTransferDTO } from 'src/business/dtos/create-transfer.dto';
import { PaginationModelAndDataRange } from 'src/data/models/pagination-and-data-range.model';


@Controller('transfer')
export class TransferController {
    constructor(private readonly transferService: TransferService) {

    }

    @Post('/create')
    createTransfer(@Body() transfer: CreateTransferDTO): TransferEntity {
        return this.transferService.createTransfer(transfer);
    }

    @Get('/find-all')
    findAll(@Body() paginator: PaginationModel): TransferEntity[] {
        return this.transferService.findAll(paginator);
    }

    @Post('/get-history-out/:id')
    getHistoryOut(@Param('id') id: string,@Body() data: PaginationModelAndDataRange): TransferEntity[] {
        return this.transferService.getHistoryOut(id, data);
    }

    @Post('/get-history-in/:id')
    getHistoryIn(@Param('id') id: string, @Body() data: PaginationModelAndDataRange): TransferEntity[] {
        return this.transferService.getHistoryIn(id, data);
    }
    
    @Post('/get-history/:id')
    getHistory(@Param('id') id: string, @Body() data: PaginationModelAndDataRange): TransferEntity[] {
        return this.transferService.getHistory(id, data);
    }

    @Delete('/soft-delete/:id')
    softDeleteTransfer(@Param('id') id: string): void {
        this.transferService.deleteTransfer(id, true);
    }

    @Delete('/hard-delete/:id')
    hardDeleteTransfer(@Param('id') id: string): void {
        this.transferService.deleteTransfer(id);
    }
}
