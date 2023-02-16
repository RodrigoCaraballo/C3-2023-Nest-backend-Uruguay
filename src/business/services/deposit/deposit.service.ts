import { Injectable } from '@nestjs/common';
import { DataRangeModel, PaginationModel } from 'src/data/models';
import { DepositEntity, DepositRepository } from 'src/data/persistence';
import { CreateDepositDTO } from 'src/business/dtos/create-deposit.dto';
import { AccountService } from '../account';
import { AccountDTO } from '../../dtos/account.dto';
import { Subject } from 'rxjs';
import { PaginationModelAndDataRange } from 'src/data/models/pagination-and-data-range.model';


@Injectable()
export class DepositService {

  private depositSubject = new Subject<DepositEntity>();

  get depositObservable() {
    return this.depositSubject.asObservable();
  }

    constructor(private readonly depositRepository: DepositRepository,
      private readonly accountService: AccountService) {}
    
    /**
   * Crear un deposito
   *
   * @param {DepositModel} deposit
   * @return {*}  {DepositEntity}
   * @memberof DepositService
   */
  createDeposit(deposit: CreateDepositDTO): DepositEntity {
    const newDeposit = new DepositEntity();

    const account = this.accountService.findOneById(deposit.accountId);
    const accountDTO = new AccountDTO();

    accountDTO.balance = deposit.amount;

    newDeposit.account = account;
    newDeposit.amount = deposit.amount;
    newDeposit.dateTime = Date.now();

    this.accountService.addBalance(account.id, accountDTO);

    return this.depositRepository.register(newDeposit);
  }

  findAll(pagination: PaginationModel): DepositEntity[] {
    return this.depositRepository.findAll(pagination);
  }


  /**
   * Borrar un deposito
   *
   * @param {string} depositId
   * @memberof DepositService
   */
  deleteDeposit(depositId: string, soft?: boolean): void {
    if(soft) this.depositRepository.delete(depositId, soft);
    
    if(!soft)this.depositRepository.delete(depositId);
  }


  /**
   * Obtener el historial de los depósitos en una cuenta
   *
   * @param {string} depositId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {DepositEntity[]}
   * @memberof DepositService
   */

  /*
  * In my opinion this method have an error, because if a make a search by depositId
  * always bring only one instance. Maybe we need an accountId or something like that, to search
  * all the deposits made by an account in a dateRange and with a Pagination.
  */
  getHistory(
    depositId: string,
    pagination?: PaginationModel,
    dataRange?: DataRangeModel,
  ): DepositEntity[] {
    throw new Error('This method is not implemented');
  }

  /**
   * This method in my opinion is better than getHistory method because bring us all the deposit
   * in a range and with pagination
   * 
   * @param accountId 
   * @param pagination 
   * @param dataRange 
   * @returns 
   */

  getAccountHistory(
    accountId: string,
    search: PaginationModelAndDataRange
  ): DepositEntity[] {    

    console.log(search.startItem);
    
    const pagination: PaginationModel = {offset: search.startItem || 0, limit: search.limitItem || 10}

    const dataRange: DataRangeModel = {
      dateStart: search.dateStart || 0,
      dateEnd: search.dateEnd || Date.now()
    }

    return this.depositRepository.findByAccountIdAndDataRange(pagination, accountId, dataRange.dateStart, dataRange.dateEnd);
  }

  private getDeposit(depositId: string): DepositEntity {
    return this.depositRepository.findOneById(depositId);
  }
}
