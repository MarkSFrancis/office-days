import { z } from 'zod';
import { authenticatedGet } from '~/api';
import { zodUtils } from '~/lib/zodUtils';

const rootKey = 'organizations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrganizationSchema = z.object({
  id: zodUtils.string(),
  displayName: zodUtils.string(),
});

export const organizationsApi = {
  rootKey: ['organizations'],
  getAll: authenticatedGet(() => {
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
  }, `${rootKey}/getAll`),
};
