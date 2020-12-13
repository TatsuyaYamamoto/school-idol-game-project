import { Injectable } from "@nestjs/common";
import { auth } from "firebase-admin";

type DecodedIdToken = auth.DecodedIdToken;

@Injectable()
export class AuthService {
  verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return auth().verifyIdToken(idToken);
  }
}
