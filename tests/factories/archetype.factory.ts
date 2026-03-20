import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Archetype } from '@/platform/domain/Archetype';

export const archetypeFactory = Factory.define<Archetype>(() => {
  return new Archetype(
    faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
    faker.commerce.productName(),
    faker.lorem.sentence(),
    Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
      faker.helpers.slugify(faker.commerce.productName()).toLowerCase()
    ),
    faker.internet.emoji(),
  );
});
