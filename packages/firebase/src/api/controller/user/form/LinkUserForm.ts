// eslint-disable-next-line max-classes-per-file
import { IsNotEmpty, Matches, ValidateNested } from "class-validator";

class LinkUserFormTwitterProvider {
  @Matches("twitter.com")
  id!: "twitter.com";

  @IsNotEmpty()
  userId!: string;

  // eslint-disable-next-line react/static-property-placement
  @IsNotEmpty()
  displayName!: string;

  @IsNotEmpty()
  photoUrl!: string;

  @IsNotEmpty()
  accessToken!: string;

  @IsNotEmpty()
  secret!: string;
}

export class LinkUserForm {
  duplicatedUid?: string;

  @ValidateNested()
  provider!: LinkUserFormTwitterProvider;
}
