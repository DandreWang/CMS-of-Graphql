import systemMenu from './system';
import parkMenu from './park';
import HomePage from './Home.page';

export default {
  key: 'root',
  component: HomePage,
  items: [systemMenu, parkMenu],
};
