"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    findOne({ filter, select, populate, }) {
        let query = this.model.findOne(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    findAll({ filter, select, populate, }) {
        let query = this.model.find(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    updateOne(query, body) {
        return this.model.updateOne(query, body);
    }
    deleteOne(query) {
        return this.model.deleteOne(query);
    }
}
exports.DatabaseRepository = DatabaseRepository;
