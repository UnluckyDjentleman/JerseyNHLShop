import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string|undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try{
        const token=request.cookies.accessToken;
        console.log(token);
        if(!token){
            throw new UnauthorizedException('You\'re not authorized');
        }
        if(data){
          return request.user[data];
        }
        return request.user;
    }
    catch(err){
        throw new UnauthorizedException('You\'re not authorized');
    }
  },
);