import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'type:models',
              onlyDependOnLibsWithTags: ['type:models'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:models'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:models'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:models'],
            },
            {
              sourceTag: 'scope:employee',
              onlyDependOnLibsWithTags: [
                'scope:employee',
                'scope:shared',
                'scope:auth',
                'scope:settings',
              ],
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: ['scope:auth', 'scope:shared'],
            },
            {
              sourceTag: 'scope:access-management',
              onlyDependOnLibsWithTags: ['scope:access-management', 'scope:auth', 'scope:shared'],
            },
            {
              sourceTag: 'scope:settings',
              onlyDependOnLibsWithTags: ['scope:settings', 'scope:shared'],
            },
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:employee',
                'scope:auth',
                'scope:access-management',
                'scope:settings',
              ],
            },
          ],
        },
      ],
    },
  },
];
