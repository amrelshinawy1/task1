import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
export enum Status {
  PENDING = "PENDING",
  PICKEDUP = "PICKEDUP",
  DELIVERED = "DELIVERED"
}
interface Parcel extends Document {
   status: string;
   sender: string;
   biker: string;
   pickUpAddress: string;
   pickUpAt: string;
   deliveryAddress: string;
   deliveredAt: string;
}

type ParcelModel = Model<Parcel>;

const ParcelSchema = new Schema<Parcel>(
  {
    status: {type: SchemaTypes.String, enum: Status, required: true},
    sender: {type: SchemaTypes.Mixed, ref: 'User', required: true},
    biker: {type: SchemaTypes.Mixed, ref: 'User', required: false},
    pickUpAddress: {type: SchemaTypes.String, required: true},
    pickUpAt: {type: SchemaTypes.String, required: false},
    deliveryAddress: {type: SchemaTypes.String, required: true},
    deliveredAt: {type: SchemaTypes.String, required: false},
  },
  { timestamps: true },
);

const createParcelModel: (conn: Connection) => ParcelModel = (conn: Connection) =>
  conn.model<Parcel>('Parcel', ParcelSchema, 'Parcels');

export { Parcel, ParcelModel, createParcelModel };
