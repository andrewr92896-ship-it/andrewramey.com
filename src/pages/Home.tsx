import Portfolio from '../render/Portfolio';
import { MODEL } from '../content/model';

export default function Home() {
  return <Portfolio model={MODEL} />;
}
