import * as migration_20260816_042105 from './20260816_042105';
import * as migration_20260818_134837 from './20260818_134837';

export const migrations = [
  {
    up: migration_20260816_042105.up,
    down: migration_20260816_042105.down,
    name: '20260816_042105',
  },
  {
    up: migration_20260818_134837.up,
    down: migration_20260818_134837.down,
    name: '20260818_134837'
  },
];
