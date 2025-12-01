import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './create-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserService {
    create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
    findById(userId: string): Promise<DocumentType<UserEntity> | null>;
    updateById(userId: string, dto: Partial<CreateUserDto>): Promise<DocumentType<UserEntity> | null>;
    exists(userId: string): Promise<boolean>;
}
