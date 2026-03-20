import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Skill } from '@/platform/domain/Skill';

export const skillFactory = Factory.define<Skill>(() => {
  const title = faker.commerce.productName();
  const slug = faker.helpers.slugify(title).toLowerCase();
  return new Skill(
    slug,
    title,
    faker.lorem.sentence(),
    faker.datatype.boolean(),
    `${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 9 })}.0`,
    `# ${title}\n\n${faker.lorem.paragraphs(2)}`,
    { type: 'principle', domain: ['global'], layer: 'fullstack' },
  );
});
