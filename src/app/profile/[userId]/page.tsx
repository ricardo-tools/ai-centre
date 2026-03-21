import { ProfileContent } from './ProfileContent';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  return <ProfileContent userId={userId} />;
}
