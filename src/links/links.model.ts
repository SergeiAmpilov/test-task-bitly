import mongoose from 'mongoose';
import { LinksSchema } from './links.schema';

export const LinksModel = mongoose.model('link', LinksSchema);