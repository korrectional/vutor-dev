import { createAuthClient } from 'better-auth/react';

import { clientEnvs } from '@/env/client';

export const authClient = createAuthClient({
  baseURL: clientEnvs.NEXT_PUBLIC_DOMAIN,
});
