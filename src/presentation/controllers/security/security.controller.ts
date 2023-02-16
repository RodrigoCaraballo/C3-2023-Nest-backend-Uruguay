// Libraries
import { Controller, Post, Body, Param } from '@nestjs/common';
import { SecurityService } from 'src/business/services/security/security.service';
import { SignInDTO, SignUpDTO } from 'src/business/dtos';
import { SignOutDTO } from '../../../business/dtos/sign.out.dto';
import { SignInGoogleDTO } from '../../../business/dtos/sign-in.dto';


@Controller('security')
export class SecurityController {

    constructor(private readonly securityService: SecurityService) {}

    @Post('/signIn')
    signIn(@Body() user: SignInDTO): string {
        return this.securityService.signIn(user);
    }

    @Post('/signInGoogle')
    signInGoogle(@Body() user: SignInGoogleDTO): string {
        return this.securityService.signInGoogle(user);
    }

    @Post('/signUp')
    signUp(@Body() user: SignUpDTO) {
        return this.securityService.signUp(user);
    }

    @Post('/signOut')
    signOut(@Body() token: SignOutDTO): boolean {
        return this.securityService.signOut(token.token);
    }
}
