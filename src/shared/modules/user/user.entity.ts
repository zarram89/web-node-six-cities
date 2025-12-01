import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../types/user.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: false, default: '' })
  public avatarUrl!: string;

  @prop({ required: true, default: '' })
  public name!: string;

  @prop({ required: true, default: '' })
  public password!: string;

  @prop({ required: true, default: UserType.Standard, enum: UserType })
  public type!: UserType;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl || '';
    this.name = userData.name;
    this.password = userData.password;
    this.type = userData.type;
  }
}

export const UserModel = getModelForClass(UserEntity);
