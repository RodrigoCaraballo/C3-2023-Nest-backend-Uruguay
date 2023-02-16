import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import {
  AccountTypeRepository,
  CustomerEntity,
  CustomerRepository,
} from 'src/data/persistence';
import { CreateAccountDTO, SignInDTO, SignUpDTO } from 'src/business/dtos';
import { AccountService } from '../account';
import * as jwt from 'jsonwebtoken';
import { DocumentTypeRepository } from '../../../data/persistence/repositories/document-type.repository';
import { NotAcceptableException } from '@nestjs/common/exceptions';
import { CustomerService } from '../customer/customer.service';
import { DocumentTypeContext, NationalIdStrategy, PassportStrategy } from '../../../data/StrategyPattern/DocumentType/document-type-strategy';
import { SignInGoogleDTO } from '../../dtos/sign-in.dto';

@Injectable()
export class SecurityService {
  private logger = new Logger('SecurityService');

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountService: AccountService,
    private readonly accountTypeRepository: AccountTypeRepository,
    private readonly customerService: CustomerService,
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  /**
   * Identificarse en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  signIn(user: SignInDTO): string {
    const answer = this.customerRepository.findOneByEmailAndPassword(
      user.username,
      user.password,
    );

    if (!answer) throw new UnauthorizedException();

    const finalUser = this.customerRepository.findByEmail(user.username)

    return jwt.sign(
      {id: finalUser.id},
      process.env.TOKEN_SECRET || 'tokentest',
    );
  }

  signInGoogle(user: SignInGoogleDTO): string {
    const answer = this.customerRepository.checkEmail(
      user.username,
    );

    if (!answer) throw new UnauthorizedException();

    const finalUser = this.customerRepository.findByEmail(user.username)

    return jwt.sign(
      {id: finalUser.id},
      process.env.TOKEN_SECRET || 'tokentest',
    );
  }

  /**
   * Crear usuario en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  signUp(user: SignUpDTO): string {
    const newCustomer = new CustomerEntity();

    if(user.documentType != 'National ID' && user.documentType != 'Passport ID') throw new NotAcceptableException();
    if(this.customerRepository.checkEmail(user.email)) throw new Error('This email is in use');

    if(user.documentType === 'National ID') {
      const strategy = new NationalIdStrategy();
      const context = new DocumentTypeContext(strategy);
      newCustomer.documentType = context.assignAccountTypeStrategy();

    }

    if(user.documentType === 'Passport ID') {
      const strategy = new PassportStrategy();
      const context = new DocumentTypeContext(strategy);
      newCustomer.documentType = context.assignAccountTypeStrategy();

    }


    newCustomer.document = user.document;
    newCustomer.fullName = user.fullName;
    newCustomer.email = user.email;
    newCustomer.phone = user.phone;
    newCustomer.password = user.password;

    this.documentTypeRepository.register(newCustomer.documentType);
    const customer = this.customerRepository.register(newCustomer);

    if (customer) {      
      const newAccount = new CreateAccountDTO();
      newAccount.customerId = customer.id;
            
      const account = this.accountService.createSavingAccount(newAccount);

      if (!account) throw new InternalServerErrorException();

      const finalUser = this.customerRepository.findByEmail(user.email)

      return jwt.sign(
        {id: finalUser.id},
        process.env.TOKEN_SECRET || 'tokentest',
      );
    } else throw new InternalServerErrorException();
  }

  /**
   * Salir del sistema
   *
   * @param {string} JWToken
   * @memberof SecurityService
   */
  signOut(JWToken: string): boolean {
    if(!jwt.verify(JWToken, process.env.TOKEN_SECRET || 'tokentest')) return false
    
    return true
  }
}