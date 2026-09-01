import Portfolio from '../render/Portfolio';
import { SITE_MODEL } from '../content/live';

export default function Home() {
  return <Portfolio model={SITE_MODEL} />;
}
