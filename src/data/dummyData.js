import { User } from './models';

export default async function createDefaultUser() {
  const user = await User.findOne({ role: 'admin' });
  
  if (!user && process.env.NODE_ENV === 'development') {
    await User.remove({ email: 'admin@admin.com' });
    await User.create({ name: 'Admin', email: 'admin@admin.com', password: 'admin', role: 'admin' });
    console.log('[OK] Administrator created'); // eslint-disable-line no-console
  }
}

