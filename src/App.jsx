import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Plus,
  Search, ShoppingBag, Sparkles, X, MapPin, Phone, Instagram, Truck, ShieldCheck
} from "lucide-react";
import { categories, products } from "./data/products";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(value);

function Logo({ light = false }) {
  return (
    <a href="#home" className={`group inline-flex items-center gap-3 ${light ? "text-white" : "text-ink"}`} aria-label="Prisha Boutique home">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-current/35 font-display text-xl transition-transform duration-300 group-hover:rotate-[-8deg]">P</span>
      <span className="leading-tight">
        <span className="block font-display text-[1.2rem] font-semibold tracking-wide">Prisha</span>
        <span className="block text-[0.58rem] font-bold uppercase tracking-[0.28em]">Boutique</span>
      </span>
    </a>
  );
}

function Header({ cartCount, onCart, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["New arrivals", "#collection"],
    ["Shop by mood", "#edit"],
    ["Our story", "#story"],
    ["Visit us", "#visit"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 hover:bg-black/5" aria-label="Toggle menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => <a key={label} href={href} className="nav-link">{label}</a>)}
        </nav>
        <div className="flex items-center gap-1">
          <button onClick={onSearch} className="rounded-full p-2.5 transition hover:bg-black/5" aria-label="Search products"><Search size={19} strokeWidth={1.7} /></button>
          <button onClick={onCart} className="relative rounded-full p-2.5 transition hover:bg-black/5" aria-label={`Shopping bag, ${cartCount} items`}>
            <ShoppingBag size={20} strokeWidth={1.7} />
            {cartCount > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">{cartCount}</span>}
          </button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-black/5 bg-cream px-6 py-4 lg:hidden">
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-black/5 py-3 text-sm font-semibold">{label}</a>)}
      </nav>}
    </header>
  );
}

function ProductCard({ product, onAdd, onQuickView }) {
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  return (
    <article className="product-card group">
      <div className="relative overflow-hidden rounded-[1.15rem] bg-[#eee6df]">
        <button onClick={() => onQuickView(product)} className="block w-full text-left" aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" className="product-image" />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-ink">{product.tag}</span>
        <button onClick={() => setLiked(!liked)} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 transition hover:scale-105 ${liked ? "text-rose" : "text-ink"}`} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>
        <button onClick={() => onQuickView(product)} className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-full bg-white/95 py-3 text-xs font-bold tracking-wide text-ink opacity-0 shadow-soft transition duration-300 hover:bg-rose hover:text-white group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100">
          Quick view
        </button>
      </div>
      <div className="px-1 pt-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.07rem] font-semibold leading-snug">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold">{money(product.price)}</span>
        </div>
        <p className="text-xs leading-relaxed text-ink/60">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[product.fabric, product.color].map((feature) => <span key={feature} className="rounded-full border border-ink/10 px-2.5 py-1 text-[10px] font-medium text-ink/70">{feature}</span>)}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center rounded-full border border-ink/15">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-9 w-9 place-items-center rounded-l-full transition hover:bg-black/5" aria-label="Decrease quantity"><Minus size={13} /></button>
            <span className="w-6 text-center text-xs font-bold tabular-nums">{qty}</span>
            <button onClick={() => setQty(Math.min(10, qty + 1))} className="grid h-9 w-9 place-items-center rounded-r-full transition hover:bg-black/5" aria-label="Increase quantity"><Plus size={13} /></button>
          </div>
          <button onClick={() => onAdd(product, qty)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white transition duration-300 hover:bg-rose hover:shadow-lg">
            <ShoppingBag size={14} /> Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}

function CartDrawer({ open, onClose, cart, onChangeQty, onRemove }) {
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderText = cart.map((item) => `${item.name} x ${item.qty} — ${money(item.price * item.qty)}`).join("\n");
  const whatsappUrl = `https://wa.me/919934019500?text=${encodeURIComponent(`Hello Prisha Boutique! I'd like to enquire about these items:\n${orderText}\nTotal: ${money(total)}\nPlease confirm availability and sizes.`)}`;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} aria-label="Close cart overlay" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div><p className="font-display text-2xl font-semibold">Your bag</p><p className="mt-1 text-xs text-ink/55">{cart.reduce((n, i) => n + i.qty, 0)} thoughtfully chosen piece(s)</p></div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-black/5" aria-label="Close cart"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? <div className="grid h-full place-items-center text-center"><div><ShoppingBag className="mx-auto mb-4 text-rose/70" size={34} /><p className="font-display text-xl">Your bag is waiting</p><p className="mt-2 text-sm text-ink/55">Find a piece that feels like you.</p><button onClick={onClose} className="mt-5 rounded-full bg-ink px-6 py-3 text-xs font-bold text-white hover:bg-rose">Explore collection</button></div></div> :
            <div className="space-y-5">{cart.map((item) => <div key={item.id} className="flex gap-4 border-b border-ink/10 pb-5">
              <img src={item.image} alt="" className="h-28 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3"><h3 className="font-display font-semibold">{item.name}</h3><button onClick={() => onRemove(item.id)} className="text-ink/45 hover:text-rose" aria-label={`Remove ${item.name}`}><X size={16} /></button></div>
                <p className="mt-1 text-xs text-ink/55">{item.fabric} · {item.color}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-ink/15"><button onClick={() => onChangeQty(item.id, item.qty - 1)} className="p-2" aria-label="Decrease quantity"><Minus size={12} /></button><span className="w-5 text-center text-xs font-bold">{item.qty}</span><button onClick={() => onChangeQty(item.id, item.qty + 1)} className="p-2" aria-label="Increase quantity"><Plus size={12} /></button></div>
                  <span className="text-sm font-bold">{money(item.price * item.qty)}</span>
                </div>
              </div>
            </div>)}</div>}
        </div>
        {cart.length > 0 && <div className="border-t border-ink/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between"><span className="text-sm text-ink/60">Subtotal</span><span className="font-display text-2xl font-semibold">{money(total)}</span></div>
          <p className="mb-4 text-[11px] leading-relaxed text-ink/55">Delivery charges and final availability will be confirmed by our team.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => setCheckoutMessage("WhatsApp will open with your order details. Please confirm sizes and availability with our team.")} className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-5 py-4 text-sm font-bold text-white transition hover:bg-ink">
            Enquire & order on WhatsApp <ArrowRight size={17} />
          </a>
          {checkoutMessage && <p className="mt-3 text-center text-xs text-ink/60">{checkoutMessage}</p>}
        </div>}
      </aside>
    </div>
  );
}

function QuickView({ product, onClose, onAdd }) {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm">
      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-cream md:grid-cols-2">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 hover:bg-white" aria-label="Close quick view"><X size={19} /></button>
        <img src={product.image} alt={product.name} className="h-80 w-full object-cover md:h-full md:min-h-[490px]" />
        <div className="flex flex-col p-6 md:p-9">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose">{product.tag}</span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{product.name}</h2>
          <div className="mt-4 flex items-center gap-3"><span className="text-xl font-bold">{money(product.price)}</span>{product.oldPrice && <span className="text-sm text-ink/45 line-through">{money(product.oldPrice)}</span>}</div>
          <p className="mt-5 text-sm leading-7 text-ink/65">{product.description} Thoughtfully selected for a flattering fit and a confident, effortless look.</p>
          <div className="mt-6"><p className="mb-3 text-xs font-bold uppercase tracking-widest">Choose size</p><div className="flex gap-2">{product.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`grid h-10 w-10 place-items-center rounded-full border text-xs font-bold transition ${size === s ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-rose"}`}>{s}</button>)}</div></div>
          <div className="mt-6 flex items-center justify-between"><span className="text-sm text-ink/60">Quantity</span><div className="flex items-center rounded-full border border-ink/15"><button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3" aria-label="Decrease quantity"><Minus size={13} /></button><span className="w-5 text-center text-sm font-bold">{qty}</span><button onClick={() => setQty(Math.min(10, qty + 1))} className="p-3" aria-label="Increase quantity"><Plus size={13} /></button></div></div>
          <button onClick={() => { onAdd({ ...product, selectedSize: size }, qty); onClose(); }} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-bold text-white transition hover:bg-rose"><ShoppingBag size={17} /> Add to bag — {money(product.price * qty)}</button>
          <p className="mt-4 flex items-center gap-2 text-[11px] text-ink/55"><Check size={14} className="text-rose" /> Size and availability confirmed by our boutique team</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [toast, setToast] = useState("");

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => activeCategory === "All pieces" || product.category === activeCategory);
    if (searchTerm.trim()) result = result.filter((product) => `${product.name} ${product.category} ${product.color} ${product.fabric}`.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortBy === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [activeCategory, searchTerm, sortBy]);

  const addToCart = (product, qty = 1) => {
    setCart((current) => {
      const key = `${product.id}-${product.selectedSize || "M"}`;
      const existing = current.find((item) => item.cartKey === key);
      if (existing) return current.map((item) => item.cartKey === key ? { ...item, qty: item.qty + qty } : item);
      return [...current, { ...product, selectedSize: product.selectedSize || "M", cartKey: key, qty }];
    });
    setToast(`${product.name} added to your bag`);
    window.setTimeout(() => setToast(""), 2600);
  };
  const changeQty = (id, qty) => setCart((current) => qty < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, qty: Math.min(10, qty) } : item));
  const removeItem = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="bg-ink px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-xs">
        A little luxury, made for your everyday <span className="mx-2 text-gold">✦</span> Visit us in Muzaffarpur
      </div>
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} onSearch={() => { setSearchOpen(!searchOpen); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }} />
      {searchOpen && <div className="border-b border-ink/10 bg-white px-5 py-4"><div className="mx-auto flex max-w-7xl items-center gap-3"><Search size={18} className="text-ink/45" /><input autoFocus value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search kurtas, festive sets, colours..." className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40" /><button onClick={() => { setSearchTerm(""); setSearchOpen(false); }} className="text-xs font-bold text-rose">Close</button></div></div>}

      <main>
        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(178,138,86,0.12),transparent_40%),linear-gradient(110deg,#f8f4ef_0%,#f8f4ef_46%,#efe3dc_100%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 sm:pt-16 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:pb-20 md:pt-20">
            <div className="max-w-xl py-4 md:py-10">
              <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-rose sm:text-xs"><span className="h-px w-8 bg-rose" /> The new ethnic wardrobe</div>
              <h1 className="font-display text-[3.2rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[5.1rem]">Wear your <span className="italic text-rose">grace.</span><br />Own your moment.</h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-ink/65 sm:text-base">Beautifully considered styles for everyday rituals, festive gatherings and all the moments in between.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#collection" className="inline-flex items-center gap-3 rounded-full bg-rose px-7 py-4 text-xs font-bold text-white shadow-lg shadow-rose/15 transition hover:-translate-y-0.5 hover:bg-ink">Explore collection <ArrowRight size={16} /></a>
                <a href="#story" className="rounded-full border border-ink/20 px-7 py-4 text-xs font-bold transition hover:border-rose hover:text-rose">Our philosophy</a>
              </div>
              <div className="mt-10 flex items-center gap-4 border-t border-ink/10 pt-6">
                <div className="flex -space-x-2">{["#c58b85", "#c9b49b", "#76534a"].map((c, i) => <span key={c} className="grid h-8 w-8 place-items-center rounded-full border-2 border-cream text-[10px] font-bold text-white" style={{ backgroundColor: c }}>{["P", "B", "♡"][i]}</span>)}</div>
                <p className="text-xs leading-5 text-ink/60"><strong className="text-ink">Chosen with care.</strong><br />Personal style, warm service.</p>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -right-3 top-5 h-[80%] w-[75%] rounded-t-[12rem] border border-gold/35 sm:-right-5 sm:top-8" />
              <div className="relative grid grid-cols-[1fr_0.68fr] items-end gap-3 sm:gap-5">
                <div className="overflow-hidden rounded-t-[10rem] rounded-b-[1rem] shadow-soft">
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=90" alt="Elegant traditional outfit from the Prisha Boutique style edit" className="hero-image aspect-[0.76] w-full object-cover" />
                </div>
                <div className="mb-9 overflow-hidden rounded-t-[9rem] rounded-b-[1rem] shadow-soft sm:mb-14">
                  <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=800&q=90" alt="Festive fashion inspiration" className="aspect-[0.72] w-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/80 bg-cream/95 px-5 py-3 shadow-soft sm:bottom-2"><Sparkles size={15} className="text-gold" /><span className="text-[10px] font-bold uppercase tracking-[0.14em]">A thoughtful kind of beautiful</span></div>
            </div>
          </div>
        </section>

        <section className="border-y border-ink/10 bg-white/45">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-6 md:grid-cols-4 md:px-8">
            {[
              [Sparkles, "Curated styles", "Pieces with personality"],
              [ShieldCheck, "Quality first", "Details worth noticing"],
              [Truck, "Local assistance", "Ask us about delivery"],
              [Heart, "Personal service", "We love helping you choose"],
            ].map(([Icon, title, subtitle]) => <div key={title} className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush/50 text-rose"><Icon size={17} /></span><div><p className="text-xs font-bold sm:text-sm">{title}</p><p className="mt-1 text-[10px] text-ink/55 sm:text-xs">{subtitle}</p></div></div>)}
          </div>
        </section>

        <section id="collection" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="eyebrow">The boutique edit</p><h2 className="section-heading">Pieces to fall <span className="italic text-rose">in love with.</span></h2><p className="mt-3 max-w-lg text-sm leading-6 text-ink/60">A considered collection of colours, textures and silhouettes, ready for your next favourite outfit.</p></div>
            <a href="#visit" className="inline-flex items-center gap-2 self-start text-xs font-bold transition hover:text-rose md:self-auto">Need help choosing? <ArrowRight size={15} /></a>
          </div>
          <div className="mt-9 flex flex-col gap-4 border-b border-ink/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2.5 text-[11px] font-bold transition ${activeCategory === category ? "bg-ink text-white" : "border border-ink/15 text-ink/65 hover:border-rose hover:text-rose"}`}>{category}</button>)}</div>
            <label className="flex items-center gap-2 text-xs text-ink/60">Sort by <span className="relative"><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-transparent py-2 pl-3 pr-8 font-bold text-ink outline-none focus:border-rose"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" /></span></label>
          </div>
          {visibleProducts.length ? <div className="mt-7 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onQuickView={setQuickView} />)}</div> : <div className="py-20 text-center"><p className="font-display text-2xl">No pieces found</p><p className="mt-2 text-sm text-ink/60">Try another search or category.</p><button onClick={() => { setSearchTerm(""); setActiveCategory("All pieces"); }} className="mt-5 rounded-full bg-ink px-5 py-3 text-xs font-bold text-white">Clear filters</button></div>}
          <p className="mt-8 text-center text-[11px] text-ink/45">Product photos are for style inspiration. Please confirm the actual product, size and availability with the boutique.</p>
        </section>

        <section id="edit" className="bg-[#eee3dc] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-9 flex items-end justify-between gap-4"><div><p className="eyebrow">Find your feeling</p><h2 className="section-heading">Dress for the <span className="italic text-rose">occasion.</span></h2></div><span className="hidden font-display text-5xl text-rose/30 md:block">01 — 03</span></div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { n: "01", title: "Everyday elegance", desc: "Comfortable favourites, with a little extra polish.", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85", category: "Everyday elegance" },
                { n: "02", title: "Festive moments", desc: "Colour, craft and detail for the days worth celebrating.", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85", category: "Festive edit" },
                { n: "03", title: "Statement dressing", desc: "Silhouettes that make the entrance feel effortless.", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=900&q=85", category: "Statement sets" },
              ].map((item) => <button key={item.n} onClick={() => { setActiveCategory(item.category); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }} className="group relative min-h-[340px] overflow-hidden rounded-[1.25rem] text-left text-white">
                <img src={item.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7"><span className="text-[10px] font-bold tracking-[0.2em] text-white/70">{item.n} / THE EDIT</span><h3 className="mt-3 font-display text-2xl font-semibold">{item.title}</h3><p className="mt-2 max-w-xs text-xs leading-5 text-white/75">{item.desc}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold">Explore edit <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span></div>
              </button>)}
            </div>
          </div>
        </section>

        <section id="story" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[3rem] border-l border-t border-gold/70" />
            <img src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=85" alt="Thoughtful boutique fashion styling" loading="lazy" className="relative aspect-[0.95] w-full rounded-[1.2rem] object-cover" />
            <div className="absolute -bottom-5 -right-2 rounded-2xl bg-rose px-5 py-4 text-white shadow-soft sm:-right-5"><p className="font-display text-2xl italic">Made to feel</p><p className="text-[10px] font-bold uppercase tracking-[0.18em]">Like you</p></div>
          </div>
          <div className="md:pl-7">
            <p className="eyebrow">A note from Prisha</p>
            <h2 className="section-heading">Style should feel <span className="italic text-rose">personal.</span></h2>
            <p className="mt-5 text-sm leading-7 text-ink/65">At Prisha Boutique, we believe the right outfit is more than what you wear. It is how you carry yourself, how you celebrate, and how comfortably you feel in your own skin.</p>
            <p className="mt-4 text-sm leading-7 text-ink/65">Our boutique is here to help you discover pieces that suit your taste and your moment. Drop in, explore the collection, and let us help you find something special.</p>
            <a href="https://wa.me/919934019500?text=Hello%20Prisha%20Boutique%2C%20I%27d%20like%20help%20choosing%20an%20outfit." target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-xs font-bold transition hover:border-rose hover:bg-rose hover:text-white">Talk to our team <ArrowRight size={15} /></a>
          </div>
        </section>

        <section className="bg-rose px-5 py-12 text-white md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Your next favourite look is waiting</p><h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Come say hello.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-white/75">Visit our Muzaffarpur boutique or message us for help with your selection.</p></div>
            <a href="https://wa.me/919934019500?text=Hello%20Prisha%20Boutique%2C%20I%27d%20like%20to%20enquire%20about%20your%20collection." target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-bold text-rose transition hover:-translate-y-0.5 hover:bg-ink hover:text-white">Chat on WhatsApp <ArrowRight size={16} /></a>
          </div>
        </section>

        <section id="visit" className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-20">
          <div><p className="eyebrow">Find the boutique</p><h2 className="section-heading">We’re right <span className="italic text-rose">here.</span></h2><p className="mt-4 text-sm leading-7 text-ink/60">We’d love to welcome you in person. Visit us to explore styles and get personal assistance.</p>
            <div className="mt-7 space-y-5">
              <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush/60 text-rose"><MapPin size={18} /></span><div><p className="text-sm font-bold">Visit our store</p><p className="mt-1 max-w-sm text-xs leading-6 text-ink/60">Gayatri Complex, Club Road, Pani Tanki Chowk, near Domino's Pizza, Mittanpura, Muzaffarpur, Bihar 842002</p></div></div>
              <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush/60 text-rose"><Phone size={18} /></span><div><p className="text-sm font-bold">Call us</p><a href="tel:+919934019500" className="mt-1 block text-sm text-ink/60 transition hover:text-rose">+91 99340 19500</a></div></div>
            </div>
          </div>
          <div className="flex min-h-[300px] flex-col justify-between rounded-[1.3rem] bg-[#e8ddd4] p-7 sm:p-10">
            <div><span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-rose"><MapPin size={22} /></span><p className="mt-6 font-display text-3xl font-semibold">Prisha Boutique</p><p className="mt-3 max-w-md text-sm leading-6 text-ink/65">Gayatri Complex, Club Road, Pani Tanki Chowk, Mittanpura, Muzaffarpur, Bihar 842002</p></div>
            <div className="mt-8 flex flex-wrap gap-3"><a href="https://www.google.com/maps/search/?api=1&query=Gayatri+Complex+Club+Road+Pani+Tanki+Chowk+Mittanpura+Muzaffarpur+Bihar+842002" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-xs font-bold text-white transition hover:bg-rose">Get directions <ArrowRight size={15} /></a><a href="tel:+919934019500" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-xs font-bold transition hover:border-rose hover:text-rose">Call boutique <Phone size={14} /></a></div>
          </div>
        </section>
      </main>

      <footer className="bg-ink px-5 pb-7 pt-10 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-7 border-b border-white/15 pb-8 sm:flex-row sm:items-center"><div><Logo light /><p className="mt-4 max-w-sm text-xs leading-6 text-white/55">Thoughtful styles. Personal service. A little luxury in every detail.</p></div><div className="flex gap-3"><a href="https://wa.me/919934019500" target="_blank" rel="noreferrer" aria-label="WhatsApp Prisha Boutique" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-ink"><Phone size={16} /></a><a href="#collection" aria-label="Shop collection" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-ink"><ShoppingBag size={16} /></a></div></div>
          <div className="flex flex-col justify-between gap-3 pt-5 text-[10px] text-white/45 sm:flex-row"><span>© {new Date().getFullYear()} Prisha Boutique. All rights reserved.</span><span>Made with care in Muzaffarpur, Bihar.</span></div>
        </div>
      </footer>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold text-white shadow-2xl"><Check size={15} className="text-[#d9b98c]" />{toast}</div>}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onChangeQty={changeQty} onRemove={removeItem} />
      <QuickView product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart} />
    </div>
  );
}

export default App;
