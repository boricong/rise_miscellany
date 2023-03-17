import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
}

class UserModel {
  private _model: mongoose.Model<IUser>;

  constructor() {
    const schema = new Schema({
      name: String,
      email: String,
    });
    this._model = mongoose.model<IUser>('User', schema);
  }

  public create(user: IUser) {
    return this._model.create(user);
  }

  public findById(id: string) {
    return this._model.findById(id).exec();
  }

  // 다른 메서드 정의
}

export default new UserModel();