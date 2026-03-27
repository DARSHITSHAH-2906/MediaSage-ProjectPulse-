import { Loader2 } from 'lucide-react';

export default function Loader({ fill = false }: { fill?: boolean }) {
  if (fill) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 400, width: '100%' }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={28} />
      </div>
    );
  }
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}><Loader2 className="animate-spin" color="var(--primary)" size={24} /></div>;
}
