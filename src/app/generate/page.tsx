import { getAllSkills } from '@/lib/skills';
import { GenerateClient } from './GenerateClient';

export default function GeneratePage() {
  const skills = getAllSkills();
  return <GenerateClient skills={skills} />;
}
