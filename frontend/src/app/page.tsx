// src/app/page.tsx
import MoveCounter from '@/components/MoveCounter';
import EVMCounter  from '@/components/EVMCounter';

export default function Home() {
  return (
    <main className="grid md:grid-cols-2 gap-10 p-10">
      <MoveCounter />
      <EVMCounter />
    </main>
  );
}
