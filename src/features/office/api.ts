import { cache } from '@solidjs/router';
import { z } from 'zod';
import { getSsrUser } from '~/api/ssrUser';
import { zodUtils } from '~/lib/zodUtils';

const rootKey = 'office';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OfficeSchema = z.object({
  id: zodUtils.string(),
  displayName: zodUtils.string(),
});

export const officeApi = {
  rootKey,
  getAll: cache(async () => {
    'use server';

    await getSsrUser();
    return Promise.resolve<z.output<typeof OfficeSchema>[]>([
      {
        id: '1',
        displayName: 'Office 1',
      },
      {
        id: '2',
        displayName: 'Office 2',
      },
    ]);
  }, `${rootKey}/getAll`),
};
