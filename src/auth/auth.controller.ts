import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { AuthDTO } from './dto/auth.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('signup')
    async signUp(@Body() dto: RegisterDTO, @Res({ passthrough: true })response: Response){
        const token=await this.authService.signUp(dto)
        response.cookie('accessToken',token.accessToken,{
            httpOnly: true,
            secure: true,
            maxAge: 360000000
        });
        response.cookie('refreshToken',token.refreshToken,{
            httpOnly: true,
            secure: true,
            maxAge: 360000000
        });
        return token
    }
    @Post('signin')
    async signIn(@Body() dto: AuthDTO, @Res({ passthrough: true })response: Response){
        const token=await this.authService.signIn(dto)
        response.cookie('accessToken',token.accessToken,{
            httpOnly: true,
            secure: true,
            maxAge: 360000000
        });
        response.cookie('refreshToken',token.refreshToken,{
            httpOnly: true,
            secure: true,
            maxAge: 360000000
        });
        return token;
    }
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
        }

        const tokens = await this.authService.refreshToken(refreshToken);

        res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        });

        return tokens;
    }
}
