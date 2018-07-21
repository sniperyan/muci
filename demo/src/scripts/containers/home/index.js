import Loading from '../../components/common/loading';
import Loadable from 'react-loadable';

const HomeAPP = Loadable({
  loader: () => import('./app'),
  loading: Loading,
});

export default HomeAPP;