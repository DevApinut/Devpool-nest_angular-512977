import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { KeycloakService } from './keycloak.service';

@Controller('keycloak')
export class KeycloakController {

  constructor(private keycloakService: KeycloakService) {}

  @Get('redirect-to-login')
  async redirectToLogin(
    @Res({ passthrough: true }) res: Response
  ) {

    // return state, codeVerifier, url
    const { state, codeVerifier, url } =
      await this.keycloakService.getRedirectLoginUrl()

    res.cookie('state', state) // what's req ?
    res.cookie('codeVerifier', codeVerifier) // who're you ?
    // res.redirect(url)  // where's keycloak ?
    return { url } ;
  }

  @Get('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response) {
    // state
    const state = req.cookies?.state;    
    // codeVerifier
    const codeVerifier = req.cookies?.codeVerifier;    
    // param of keycloak (code) ?state=q1dF056IwDvfmtN7leaZhn9o7sOjK1cpXkqWHvjs9jM&session_state=7d9afeef-c23d-4ba8-8d1b-201e6004741f&iss=https:%2F%2Fsso-dev.odd.works%2Frealms%2Fpea-devpool-2025&code=d336b0bb-208f-4548-8335-f56272bcec22.7d9afeef-c23d-4ba8-8d1b-201e6004741f.4538e692-ea08-4633-9ef9-d716c212b9dd
    const url = req.originalUrl.split('?')[1] || '';

    const { idToken, tokensDto } = 
      await this.keycloakService.login({
        state, codeVerifier, url
      });

    res.cookie('idToken', idToken)  
    res.cookie('refreshToken', tokensDto.refreshToken)

    res.clearCookie('state')
    res.clearCookie('codeVerifier')

    return { accessToken: tokensDto.accessToken } 
  }

}
