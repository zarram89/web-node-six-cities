import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
    @prop({ trim: true, required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

    @prop({ required: true, min: 1, max: 5 })
    public rating!: number;

    @prop({ required: true })
    public postDate!: Date;

    @prop({
      ref: UserEntity,
      required: true
    })
    public authorId!: Ref<UserEntity>;

    @prop({
      ref: OfferEntity,
      required: true
    })
    public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
