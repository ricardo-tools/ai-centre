const adjectives = [
  'Turbo', 'Dizzy', 'Cosmic', 'Neon', 'Mango', 'Fuzzy', 'Snappy', 'Bouncy',
  'Crispy', 'Groovy', 'Zippy', 'Funky', 'Blazing', 'Chill', 'Spicy', 'Wobbly',
  'Mega', 'Hyper', 'Sleepy', 'Jazzy', 'Retro', 'Pixel', 'Stormy', 'Lunar',
  'Solar', 'Frosty', 'Rusty', 'Misty', 'Velvet', 'Gritty', 'Dapper', 'Swift',
];

const nouns = [
  'Falcon', 'Panda', 'Waffle', 'Penguin', 'Thunder', 'Pickle', 'Muffin',
  'Otter', 'Cactus', 'Comet', 'Badger', 'Moose', 'Taco', 'Rocket', 'Nugget',
  'Wombat', 'Phoenix', 'Kraken', 'Dolphin', 'Llama', 'Bison', 'Cobra',
  'Parrot', 'Mantis', 'Walrus', 'Squid', 'Gecko', 'Lemur', 'Hawk', 'Yeti',
];

export function generateName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
