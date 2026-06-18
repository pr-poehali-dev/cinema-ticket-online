import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const POSTER_1 = 'https://cdn.poehali.dev/projects/59ad4ce6-0503-4bf2-bec3-cd5f39529363/files/767f09a6-ee9f-47a4-ab52-e574adc41348.jpg';
const POSTER_2 = 'https://cdn.poehali.dev/projects/59ad4ce6-0503-4bf2-bec3-cd5f39529363/files/c93dc65b-3b7d-4cd9-880f-cc6e21617c40.jpg';
const POSTER_3 = 'https://cdn.poehali.dev/projects/59ad4ce6-0503-4bf2-bec3-cd5f39529363/files/7fb81e81-ee90-498e-9737-dea5bfaef1cd.jpg';

const NAV = [
  { label: 'Главная', id: 'home' },
  { label: 'Афиша', id: 'afisha' },
  { label: 'Билеты', id: 'tickets' },
  { label: 'О кинотеатре', id: 'about' },
  { label: 'Контакты', id: 'contacts' },
];

const MOVIES = [
  { title: 'Звёздный путь', genre: 'Фантастика', time: '19:00 · 21:30', price: 450, img: POSTER_1, tag: 'Премьера' },
  { title: 'Неоновый город', genre: 'Триллер', time: '18:00 · 20:45', price: 400, img: POSTER_2, tag: 'Хит' },
  { title: 'Золотые горы', genre: 'Фэнтези', time: '17:30 · 20:00', price: 420, img: POSTER_3, tag: 'Новинка' },
];

const TICKETS = [
  { name: 'Уютный', desc: 'Стандартное место с пледом и попкорном', price: 400, icon: 'Armchair', popular: false },
  { name: 'Премиум', desc: 'Кресло-реклайнер, плед, снеки и напиток', price: 750, icon: 'Sofa', popular: true },
  { name: 'VIP-диван', desc: 'Двухместный диван, полный сет угощений', price: 1400, icon: 'Crown', popular: false },
];

const Index = () => {
  const [email, setEmail] = useState('');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground grain overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
            <Icon name="Clapperboard" className="text-primary" size={28} />
            КИНО<span className="text-gradient">ДОМ</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors story-link">
                {n.label}
              </button>
            ))}
          </nav>
          <Button onClick={() => scrollTo('tickets')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Купить билет
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img src={POSTER_1} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="animate-float-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6">
              <Icon name="Sparkles" size={16} /> Кино как дома, атмосфера как в зале
            </span>
            <h1 className="animate-float-up font-display text-6xl md:text-8xl font-bold leading-[0.95] mb-6" style={{ animationDelay: '0.1s' }}>
              ВАШ ВЕЧЕР <br /> <span className="text-gradient">НАЧИНАЕТСЯ</span> <br /> ЗДЕСЬ
            </h1>
            <p className="animate-float-up text-lg text-muted-foreground mb-8 max-w-lg" style={{ animationDelay: '0.2s' }}>
              Бронируйте билеты в уютный домашний кинотеатр онлайн. Любимые фильмы, мягкие диваны и попкорн — в пару кликов.
            </p>
            <div className="animate-float-up flex flex-wrap gap-4" style={{ animationDelay: '0.3s' }}>
              <Button onClick={() => scrollTo('afisha')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary h-12 px-8">
                <Icon name="Ticket" size={20} /> Смотреть афишу
              </Button>
              <Button onClick={() => scrollTo('about')} size="lg" variant="outline" className="h-12 px-8 border-border bg-card/40 hover:bg-card">
                О кинотеатре
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AFISHA */}
      <section id="afisha" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-accent font-display font-semibold tracking-widest text-sm">АФИША</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">Сейчас в показе</h2>
            </div>
            <p className="text-muted-foreground max-w-sm">Выбирайте сеанс и бронируйте лучшие места заранее.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {MOVIES.map((m, i) => (
              <article key={m.title} className="group relative rounded-2xl overflow-hidden bg-card border border-border hover-scale animate-float-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide">{m.tag}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-accent font-medium mb-2">
                    <Icon name="Film" size={14} /> {m.genre}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">{m.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Icon name="Clock" size={16} /> {m.time}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold">от {m.price} ₽</span>
                    <Button onClick={() => scrollTo('tickets')} size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                      Билет
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="py-24 relative bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-display font-semibold tracking-widest text-sm">БИЛЕТЫ</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">Выберите формат отдыха</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TICKETS.map((t, i) => (
              <div key={t.name} className={`relative rounded-2xl p-8 border animate-float-up ${t.popular ? 'bg-gradient-to-b from-primary/15 to-card border-primary glow-primary' : 'bg-card border-border'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {t.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">Популярный</span>}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${t.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-accent'}`}>
                  <Icon name={t.icon} size={28} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{t.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{t.desc}</p>
                <div className="font-display text-4xl font-bold mb-6">{t.price} <span className="text-lg text-muted-foreground">₽</span></div>
                <Button className={`w-full font-semibold ${t.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}>
                  Забронировать
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <img src={POSTER_2} alt="Зал кинотеатра" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-transparent" />
            </div>
            <div>
              <span className="text-accent font-display font-semibold tracking-widest text-sm">О КИНОТЕАТРЕ</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-6">Уют, который чувствуешь с порога</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                КИНОДОМ — это камерный домашний кинотеатр для тех, кто хочет смотреть кино в спокойной обстановке. Большой экран, объёмный звук и комфортные диваны создают атмосферу настоящего киновечера без толпы.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: '4K', t: 'Качество показа' },
                  { n: '12', t: 'Мест в зале' },
                  { n: '∞', t: 'Попкорна' },
                ].map((s) => (
                  <div key={s.t} className="rounded-xl bg-card border border-border p-4 text-center">
                    <div className="font-display text-3xl font-bold text-gradient">{s.n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-secondary/20 via-primary/15 to-accent/15 border border-border p-10 md:p-16 text-center">
            <div className="absolute inset-0 grain opacity-50" />
            <div className="relative max-w-xl mx-auto">
              <Icon name="Mail" className="text-primary mx-auto mb-4" size={40} />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Не пропустите премьеры</h2>
              <p className="text-muted-foreground mb-8">Подпишитесь и первыми узнавайте о новых фильмах и спецпредложениях КИНОДОМа.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="h-12 bg-background/60 border-border"
                />
                <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap">
                  Подписаться
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS / FOOTER */}
      <footer id="contacts" className="border-t border-border pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 font-display text-2xl font-bold mb-4">
                <Icon name="Clapperboard" className="text-primary" size={26} />
                КИНО<span className="text-gradient">ДОМ</span>
              </div>
              <p className="text-muted-foreground text-sm">Домашний кинотеатр с атмосферой большого экрана.</p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Контакты</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Icon name="Phone" size={16} className="text-accent" /> +7 (900) 123-45-67</li>
                <li className="flex items-center gap-2"><Icon name="Mail" size={16} className="text-accent" /> hello@kinodom.ru</li>
                <li className="flex items-center gap-2"><Icon name="MapPin" size={16} className="text-accent" /> Москва, ул. Киноварная, 7</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Часы работы</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Icon name="Clock" size={16} className="text-accent" /> Пн–Пт: 14:00 – 23:00</li>
                <li className="flex items-center gap-2"><Icon name="Clock" size={16} className="text-accent" /> Сб–Вс: 11:00 – 00:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Мы в сети</h4>
              <div className="flex gap-3">
                {['Send', 'Instagram', 'Youtube'].map((s) => (
                  <a key={s} href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    <Icon name={s} size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 КИНОДОМ. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
