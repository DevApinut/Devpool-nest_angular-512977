// keycloak.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { KeycloakParamsDto } from './dto/keycloak-params.dto';
import client from 'openid-client';
import { KeycloakConfig } from './keycloak.config';
import { TokensDto } from './dto/tokens.dto';
import { KeycloakPayload } from './dto/keycloak-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@app/users/users.service';
import { LoggedInDto } from './dto/logged-in.dto';
import { AuthService } from './auth.service';

@Injectable()
export class KeycloakService {
  private config: client.Configuration;

  constructor(
    private keycloakConfig: KeycloakConfig,
    private jwtService: JwtService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  private async getConfig() {
    // if discovery already then return config
    if (this.config) {
      return this.config;
    }

    // read config
    const server = new URL(this.keycloakConfig.issuer);
    const clientId = this.keycloakConfig.clientId;
    const clientSecret = this.keycloakConfig.clientSecret;

    
    // discovery
    this.config = await client.discovery(server, clientId, clientSecret);

    // this config
    return this.config;
  }

  async getRedirectLoginUrl(): Promise<KeycloakParamsDto> {
    // state & codeVerifier are rand
    const state = client.randomState();
    const codeVerifier = client.randomPKCECodeVerifier();

    // url build from config & params
    const redirectUri = this.keycloakConfig.callbackUrl;
    const scope = this.keycloakConfig.scope;
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    const parameters: Record<string, string> = {
      redirect_uri: redirectUri,
      scope,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    };

    const config = await this.getConfig();
    const redirectTo: URL = client.buildAuthorizationUrl(config, parameters);

    return { state, codeVerifier, url: decodeURIComponent(redirectTo.href) };
  }

  async login(
    keycloakParamsDto: KeycloakParamsDto,
  ): Promise<{ idToken: string; tokensDto: TokensDto }> {
    // get idToken & keycloakPayload
    const { idToken, keycloakPayload } =
      await this.authorizationByCode(keycloakParamsDto);
    // upsert user by keycloakId
    const user = await this.usersService.upsertByKeycloakId(
      keycloakPayload.preferred_username,
      keycloakPayload.sub,
    );

    // generate TokensDto { accessToken, refreshToken }
    const loggedInDto: LoggedInDto = {
      username: user.username,
      role: user.role,
    };

    const tokensDto = this.authService.generateTokens(loggedInDto);

    return { idToken, tokensDto };
  }

  private async authorizationByCode(
    keycloakParamsDto: KeycloakParamsDto,
  ): Promise<{ idToken: string; keycloakPayload: KeycloakPayload }> {
    // call keycloak for tokens
    const tokens: client.TokenEndpointResponse =
      await client.authorizationCodeGrant(
        await this.getConfig(),
        new URL(`${this.keycloakConfig.callbackUrl}?${keycloakParamsDto.url}`),
        {
          pkceCodeVerifier: keycloakParamsDto.codeVerifier,
          expectedState: keycloakParamsDto.state,
        },
      );

    if (!tokens.id_token) {
      throw new UnauthorizedException('tokens.id_token should be not blank');
    }

    const idToken = tokens.id_token;
    const keycloakPayload = await this.jwtService.decode(idToken);

    return { idToken, keycloakPayload };
  }

  async logout(idToken: string): Promise<string> {
    const config = await this.getConfig();

    const logoutUrl = client.buildEndSessionUrl(config, {
      id_token_hint: idToken,
      post_logout_redirect_uri: this.keycloakConfig.postLogoutRedirectUri,
    });

    console.log('logoutUrl', logoutUrl);
    return decodeURIComponent(logoutUrl.href);
  }
}
