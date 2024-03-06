import mongoose, { HydratedDocument } from 'mongoose';
import { IUsersSchema, UsersSchema } from './users.schema';

export const UsersModel = mongoose.model<IUsersSchema>('user', UsersSchema);

export type UsersModelType = HydratedDocument<IUsersSchema>;