import { describe, expect, test } from '@jest/globals';
import { DataSource, DeleteResult } from 'typeorm';
import isEqual from 'lodash.isequal';

import { Child1Entity, Child2Entity, Parent1Entity, Parent2Entity } from '../server/Entities.js';

let dataSource: DataSource = null;

function getDataSource(): DataSource {
    return new DataSource({
        type: "postgres",
        database: "typeorm",
        schema: "public",
        entities: [Child1Entity, Child2Entity, Parent1Entity, Parent2Entity ],
        synchronize: true,
        logging: false,
        url: "postgres://postgres:password42@localhost:5432/typeorm"
    });
}

beforeAll(async () => {
    const ds = getDataSource();

    dataSource = await ds.initialize();
})

afterAll(async () => { 
    if (dataSource != null) {
        await dataSource.destroy();
    }
})

describe("Entity Tests", () => {

    test("Test Parent1", async () => {
        const repository = dataSource.getRepository(Parent1Entity);
        const initialCount: number = await repository.count();
        const parent1: Parent1Entity = new Parent1Entity();

        parent1.name = "Fred";
        parent1.children = [];

        [0, 1].forEach(value => {
            const child1: Child1Entity = new Child1Entity();

            child1.name = "Child "+value;
            parent1.children.push(child1);
        })

        const entity: Parent1Entity = await repository.save(parent1);

        expect(await repository.count()).toEqual(initialCount+1);
        expect(isEqual(entity, parent1)).toBeTruthy();

        const newName = "Blah";

        entity.name = newName;
        entity.children[0].name = newName;

        const updatedEntity: Parent1Entity = await repository.save(entity);

        expect(updatedEntity.name).toEqual(newName);
        expect(updatedEntity.children[0].name).toEqual(newName);

        const result: DeleteResult = await repository.delete({ id: entity.id });

        expect(result.affected).toEqual(1);
        expect(await repository.count()).toEqual(initialCount);
    })

    test("Test Parent2", async () => {
        const repository = dataSource.getRepository(Parent2Entity);
        const initialCount: number = await repository.count();
        const parent2: Parent2Entity = new Parent2Entity();

        parent2.name = "Fred";
        parent2.children = [];

        [0, 1].forEach((value, index) => {
            const child2: Child2Entity = new Child2Entity();

            child2.name = "Child "+value;
            child2.position = index;
            parent2.children.push(child2);
        })

        const entity: Parent2Entity = await repository.save(parent2);

        expect(await repository.count()).toEqual(initialCount+1);
        expect(isEqual(entity, parent2)).toBeTruthy();

        const newName = "Blah";

        entity.name = newName;
        entity.children[0].name = newName;

        const updatedEntity: Parent2Entity = await repository.save(entity);

        expect(updatedEntity.name).toEqual(newName);
        expect(updatedEntity.children[0].name).toEqual(newName);

        const result: DeleteResult = await repository.delete({ id: entity.id });

        expect(result.affected).toEqual(1);
        expect(await repository.count()).toEqual(initialCount);
    })

})
    