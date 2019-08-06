import TicketClassPage from './TicketClass.page';
import SpotPage from './Spots.page';
import DevicePage from './Device.page';

export default {
  key: 'park',
  title: '园区管理',
  icon: 'desktop',
  items: [
    {
      key: 'spot',
      title: '设施管理',
      icon: 'environment',
      component: SpotPage,
    },
    {
      key: 'device',
      title: '闸机管理',
      icon: 'environment',
      component: DevicePage,
    },
    {
      key: 'ticket-class',
      title: '票种管理',
      icon: 'team',
      component: TicketClassPage,
    },
  ],
};
