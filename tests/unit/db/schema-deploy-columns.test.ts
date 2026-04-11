import { describe, it, expect } from 'vitest';
import { showcaseUploads } from '@/platform/db/schema';

describe('showcase_uploads deploy columns', () => {
  it('should have a deployStatus column with default "none"', () => {
    const col = showcaseUploads.deployStatus;
    expect(col).toBeDefined();
    expect(col.name).toBe('deploy_status');
    expect(col.notNull).toBe(true);
    expect(col.hasDefault).toBe(true);
  });

  it('should have a deployUrl column that is nullable', () => {
    const col = showcaseUploads.deployUrl;
    expect(col).toBeDefined();
    expect(col.name).toBe('deploy_url');
    expect(col.notNull).toBe(false);
  });
});
