import { AuthService } from './auth.service';
import { SignUpDto } from '../../dtos/signup.dto';
import { LoginDto } from '../../dtos/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
