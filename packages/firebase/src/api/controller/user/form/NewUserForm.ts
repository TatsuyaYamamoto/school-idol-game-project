import { IsNotEmpty } from "class-validator";

export class NewUserForm {
  @IsNotEmpty()
  uid!: string;

  debug?: boolean;
}
