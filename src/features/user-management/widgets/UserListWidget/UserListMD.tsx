'use client';

import type { UserListSizeProps } from './UserListWidget';
import { UserListLG } from './UserListLG';

export function UserListMD(props: UserListSizeProps) {
  return <UserListLG {...props} />;
}
