import { http, HttpResponse } from 'msw';
import { skillFactory, archetypeFactory } from '../factories';

export const handlers = [
  http.get('/api/skills', () =>
    HttpResponse.json({ skills: [skillFactory.build(), skillFactory.build(), skillFactory.build()] })
  ),
  http.get('/api/skills/:slug', ({ params }) =>
    HttpResponse.json({ skill: skillFactory.build({ slug: params.slug as string }) })
  ),
  http.get('/api/archetypes', () =>
    HttpResponse.json({ archetypes: [archetypeFactory.build()] })
  ),
];
