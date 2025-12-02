import { SignJWT, jwtVerify } from 'jose';

export interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

export class TokenService {
  constructor(
    private readonly secret: string,
    private readonly algorithm: string,
    private readonly expiresIn: string
  ) { }

  public async sign(payload: TokenPayload): Promise<string> {
    const secretKey = new TextEncoder().encode(this.secret);

    return new SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setExpirationTime(this.expiresIn)
      .setIssuedAt()
      .sign(secretKey);
  }

  public async verify(token: string): Promise<TokenPayload> {
    const secretKey = new TextEncoder().encode(this.secret);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [this.algorithm]
    });

    return payload as unknown as TokenPayload;
  }
}
