import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { SignUpDto } from '../../dtos/signup.dto';
import { LoginDto } from '../../dtos/login.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
