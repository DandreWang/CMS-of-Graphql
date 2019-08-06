import AdminPage from './Admin.page';

export default {
  key: 'system',
  title: '系统设置',
  icon: 'desktop',
  items: [
    {
      key: 'admins',
      title: '管理员账号',
      icon: 'team',
      component: AdminPage,
    },
  ],
};
