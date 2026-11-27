import { Model, PopulateOptions, QueryFilter, UpdateQuery } from "mongoose";
import { IUser } from "../../common/types/user.type";
import { ConflictException } from "../../common/exceptions/error.exception";

export class DatabaseRepository<TRaw> {
  private readonly model: Model<TRaw>;
  constructor(model: Model<TRaw>) {
    this.model = model;
  }

  create(data: TRaw): Promise<TRaw> {
    return this.model.create(data);
  }
  findOne({
    filter,
    select,
    populate,
  }: {
    filter: QueryFilter<TRaw>;
    select?: string | null;
    populate?: PopulateOptions | PopulateOptions[] | undefined;
  }) {
    let query = this.model.findOne(filter);
    if (select) {
      query = query.select(select);
    }
    if (populate) {
      query = query.populate(populate);
    }
    return query;
  }
  findAll({
    filter,
    select,
    populate,
  }: {
    filter: QueryFilter<TRaw>;
    select?: string | null;
    populate?: PopulateOptions | PopulateOptions[] | undefined;
  }) {
    let query = this.model.find(filter);
    if (select) {
      query = query.select(select);
    }
    if (populate) {
      query = query.populate(populate);
    }
    return query;
  }
  updateOne(query: QueryFilter<TRaw>, body: UpdateQuery<TRaw>) {
    return this.model.updateOne(query, body);
  }
  deleteOne(query: QueryFilter<TRaw>) {
    return this.model.deleteOne(query);
  }
}
