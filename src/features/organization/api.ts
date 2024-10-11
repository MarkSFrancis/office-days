import { cache } from '@solidjs/router';
import { z } from 'zod';
import { withAuth } from '~/api';
import { zodUtils } from '~/lib/zodUtils';

const rootKey = 'organizations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrganizationSchema = z.object({
  id: zodUtils.string(),
  displayName: zodUtils.string(),
});

export const organizationsApi = {
  rootKey,
  getAll: cache(async () => {
    'use server';
    return withAuth(() => {
      return Promise.resolve<z.output<typeof OrganizationSchema>[]>([
        {
          id: '1',
          displayName: 'Organization 1',
        },
        {
          id: '2',
          displayName: 'Organization 2',
        },
      ]);
    });
  }, `${rootKey}/getAll`),
};
