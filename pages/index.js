import AdsterraBanner from '@/components/AdsterraBanner';
import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Calculator />
      <AdsterraBanner />
    </div>
  );
}