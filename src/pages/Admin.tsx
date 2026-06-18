import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const ADMIN_URL = 'https://functions.poehali.dev/df9f77d7-99e3-4385-b173-d72cc9e84204';
const PASSWORD = 'kinodom2026';

type Order = {
  id: number;
  name: string;
  phone: string;
  movie: string | null;
  session_time: string | null;
  seats: number;
  comment: string | null;
  status: 'new' | 'confirmed' | 'cancelled';
  created_at: string;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  new: { label: 'Новая', color: 'bg-accent/20 text-accent border-accent/30' },
  confirmed: { label: 'Подтверждена', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Отменена', color: 'bg-destructive/20 text-destructive border-destructive/30' },
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'confirmed' | 'cancelled'>('all');

  const login = () => {
    if (pwInput === PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_URL, {
        headers: { 'X-Admin-Password': PASSWORD },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(ADMIN_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': PASSWORD },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: status as Order['status'] } : o)));
  };

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === 'new').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 font-display text-2xl font-bold mb-8 justify-center">
            <Icon name="Clapperboard" className="text-primary" size={28} />
            КИНО<span className="text-gradient">ДОМ</span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <h1 className="font-display text-xl font-bold mb-6 text-center">Вход в админку</h1>
            <div className="space-y-4">
              <Input
                type="password"
                value={pwInput}
                onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="Пароль"
                className={`bg-background/60 ${pwError ? 'border-destructive' : ''}`}
              />
              {pwError && <p className="text-destructive text-sm">Неверный пароль</p>}
              <Button onClick={login} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Войти
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <Icon name="Clapperboard" className="text-primary" size={24} />
              КИНО<span className="text-gradient">ДОМ</span>
            </a>
            <span className="text-muted-foreground text-sm">/ Заявки</span>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm" className="gap-2" disabled={loading}>
            <Icon name={loading ? 'Loader' : 'RefreshCw'} size={16} className={loading ? 'animate-spin' : ''} />
            Обновить
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['all', 'new', 'confirmed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-4 border text-left transition-all ${filter === s ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-muted/50'}`}
            >
              <div className="font-display text-3xl font-bold">{counts[s]}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {s === 'all' ? 'Всего' : STATUS_LABEL[s].label}
              </div>
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
            <Icon name="Loader" size={20} className="animate-spin" /> Загрузка...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-40" />
            <p>Заявок пока нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 grid md:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Клиент</div>
                    <div className="font-semibold">{order.name}</div>
                    <a href={`tel:${order.phone}`} className="text-sm text-accent hover:underline">{order.phone}</a>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Фильм / Сеанс</div>
                    <div className="font-medium">{order.movie || '—'}</div>
                    <div className="text-sm text-muted-foreground">{order.session_time || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Билетов / Комментарий</div>
                    <div className="font-medium">{order.seats} шт.</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[160px]">{order.comment || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Дата</div>
                    <div className="text-sm">{new Date(order.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${STATUS_LABEL[order.status].color}`}>
                      {STATUS_LABEL[order.status].label}
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {order.status !== 'confirmed' && (
                    <Button onClick={() => updateStatus(order.id, 'confirmed')} size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1">
                      <Icon name="Check" size={14} /> Подтвердить
                    </Button>
                  )}
                  {order.status !== 'cancelled' && (
                    <Button onClick={() => updateStatus(order.id, 'cancelled')} size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white gap-1">
                      <Icon name="X" size={14} /> Отмена
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
