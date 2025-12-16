import { ROLES } from '../../constants/roles.constant';

export const roleSeed = async () => {
  console.log('Roles seeded:', Object.values(ROLES));
};
