import { useEffect, useRef, useState, useCallback } from "react";

// ── Utility: smooth scroll helper ────────────────────────────────────────────
const scrollTo = (id, offset = 80) => {
  const el = document.querySelector(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
};

// ── WhatsApp helper ───────────────────────────────────────────────────────────
const openWhatsApp = (name = "", price = "") => {
const msg = name
  ? `Hello Cakeology! 👋\n\nI would like to order:\n\n🎂 *${name}*\n💰 Price: *${price}*\n\nPlease share delivery details and availability. Thank you!`
  : `Hello Cakeology! 👋\n\nI would like to place an order. Please help me with the details!`;
  window.open(`https://wa.me/918296142981?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
};

// ── useActiveSection (Intersection Observer) ──────────────────────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const observers = [];
    const map = {};
    ids.forEach((id) => {
      const el = document.querySelector(`#${id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
      map[id] = obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids.join(",")]);
  return active;
}

// ── ScrollProgress ────────────────────────────────────────────────────────────
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const fn = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setW(dh > 0 ? (window.scrollY / dh) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div id="scroll-progress" style={{ width: `${w}%` }} />;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  ["home", "Home"], ["about", "About"], ["menu", "Menu"],
  ["kunafa", "Kunafa"], ["gallery", "Gallery"], ["reviews", "Reviews"], ["contact", "Contact"],
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_ITEMS.map(([id]) => id));

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [close]);

  const handleNav = (e, id) => {
    e.preventDefault();
    close();
    scrollTo(`#${id}`);
  };

  return (
    <header id="site-header" className={scrolled ? "scrolled" : ""}>
      <div className="container nav-wrap">
        {/* Logo */}
        <a href="#home" className="logo" onClick={(e) => handleNav(e, "home")}>
          <div className="logo-img-wrap">
            <img src="/Logo.jpeg" alt="Cakeology Logo" className="logo-img" loading="eager" />
          </div>
          <div className="logo-text-wrap">
            <span className="logo-name">Cakeology</span>
            <span className="logo-sub">Bakery &amp; Desserts</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main navigation">
          {NAV_ITEMS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "nav-active" : ""}
              onClick={(e) => handleNav(e, id)}
            >
              {label}
            </a>
          ))}
          <button className="nav-cta" onClick={() => openWhatsApp()}>
            Order Now
          </button>
        </nav>

        {/* Overlay */}
        {open && <div className="nav-overlay" onClick={close} aria-hidden="true" />}

        {/* Burger */}
        <button
          className={`burger${open ? " active" : ""}`}
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="home" aria-label="Hero">
      <video
        className="hero-video"
        autoPlay muted loop playsInline
        poster="/backgroundimg.jpeg"
        aria-hidden="true"
      >
        <source src="/BGV.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />

      {/* Floaters — kept well away from text via CSS */}
      <div className="hero-floaters" aria-hidden="true">
        {["🍰","🧁","🍫","🍓","🌸","✨"].map((em, i) => (
          <span key={i} className={`floater floater-${i + 1}`}>{em}</span>
        ))}
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Welcome to Cakeology</p>
        <h1>Freshly Baked,<br /><em>Beautifully</em> Crafted</h1>
        <p className="hero-sub">Custom Cakes, Desserts &amp; Sweet Memories<br className="hero-br" /> for Every Celebration</p>
        <div className="hero-btns">
          <button className="glass-btn primary" onClick={() => openWhatsApp()}>
            <WaIcon /> Order on WhatsApp
          </button>
          <button className="glass-btn" onClick={() => scrollTo("#menu")}>
            View Menu
          </button>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue-text">Scroll</span>
        <span className="stick" />
      </div>
    </section>
  );
}

// ── Tiny inline icons (no npm install needed) ─────────────────────────────────
function WaIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IgIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function PhoneIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function Marquee() {
  const t = "Custom Cakes \u00a0✦\u00a0 Signature Kunafa \u00a0✦\u00a0 Wedding Specials \u00a0✦\u00a0 Cupcakes & Brownies \u00a0✦\u00a0 Cheesecakes \u00a0✦\u00a0 Made Fresh Daily \u00a0✦";
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        <span>{t}</span><span>{t}</span>
      </div>
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────
const products = [
  { tag:"Bestseller", img:"/BC.jpeg",        cat:"Birthday Cakes", name:"Chocolate Birthday Cake",     price:"₹899",   unit:"1 kg" },
  { tag:"Premium",    img:"/AniCC.jpeg",     cat:"Wedding Cakes",  name:"Chocolate Wedding Cake",      price:"₹4,999", unit:"per tier" },
  {                   img:"/mangoDes.jpeg",   cat:"Cupcakes",       name:"Mango Cupcake Box (6 pcs)",   price:"₹349",   unit:"box" },
  { tag:"Signature",  img:"/Kunafa.jpeg",    cat:"Kunafa",         name:"Signature Kesar Kunafa",      price:"₹399",   unit:"onwards", isKunafa:true },
  {                   img:"/brownies.jpeg",   cat:"Brownies",       name:"Molten Chocolate Brownie",    price:"₹199",   unit:"piece" },
  {                   img:"/roseC.jpeg",      cat:"Cheesecakes",    name:"Strawberry Bliss Cheesecake", price:"₹549",   unit:"slice box" },
];

function ProductCard({ p, i }) {
  const handleOrder = () => {
    if (p.isKunafa) scrollTo("#kunafa");
    else openWhatsApp(p.name, p.price);
  };
  return (
    <div className="product-card" data-aos="fade-up" data-aos-delay={String((i % 3) * 100)}>
      <div className="product-img">
        {p.tag && <span className="product-tag">{p.tag}</span>}
        <img src={p.img} alt={p.name} loading="lazy" />
        <div className="product-img-overlay">
          <button className="quick-order-btn" onClick={handleOrder}>
            <WaIcon size={14} /> {p.isKunafa ? "Explore" : "Quick Order"}
          </button>
        </div>
      </div>
      <div className="product-body">
        <span className="cat">{p.cat}</span>
        <h3>{p.name}</h3>
        <div className="product-foot">
          <div className="price">{p.price} <span>/ {p.unit}</span></div>
          <button className="order-btn" onClick={handleOrder}>
            {p.isKunafa ? "Explore" : "Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Products() {
  return (
    <section className="products" id="menu">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Our Menu</div>
          <h2 className="section-title">Signature <em>Sweet</em> Creations</h2>
          <p className="section-sub">Handcrafted daily with premium ingredients, a touch of gold, and a whole lot of love.</p>
        </div>
        <div className="products-grid">
          {products.map((p, i) => <ProductCard key={i} p={p} i={i} />)}
        </div>
        <div className="products-foot" data-aos="fade-up">
          <button className="outline-btn" onClick={() => scrollTo("#menu-card")}>View Full Menu Card ↓</button>
        </div>
      </div>
    </section>
  );
}

// ── MenuImages ────────────────────────────────────────────────────────────────
function MenuImages() {
  return (
    <section className="menu-images" id="menu-card">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Price List</div>
          <h2 className="section-title">Our Full <em>Menu</em> Card</h2>
          <p className="section-sub">Everything we bake, with love and the finest ingredients — fresh every single day.</p>
        </div>
        <div className="menu-img-grid">
          {[
            ["/Menu1.jpeg","Cakes & Cupcakes",""],
            ["/Menu2.jpeg","Brownies, Cupcakes & Muffins",""],
          ].map(([src, title, badge], i) => (
            <div key={i} className="menu-img-card" data-aos={i === 0 ? "fade-right" : "fade-left"}>
              <img src={src} alt={`Cakeology ${title}`} loading="lazy" />
              <div className="menu-img-badge">
                <span>{badge}</span>
                <h4>{title}</h4>
              </div>
            </div>
          ))}
        </div>
        <div className="products-foot" data-aos="fade-up">
          <button className="gold-btn" onClick={() => openWhatsApp()}>
            <WaIcon /> Order From The Menu
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Kunafa ────────────────────────────────────────────────────────────────────
const kunafaFeatures = [
  { ico:"✨", h:"Crispy Golden Layers",    p:"Hand-layered shredded phyllo, baked to perfection." },
  { ico:"🧀", h:"Rich & Cheesy Inside",    p:"A molten, indulgent cheese centre in every bite." },
  { ico:"🥜", h:"Premium Pistachios",      p:"Generously topped with hand-crushed pistachios." },
  { ico:"🌼", h:"Infused with Kesar Syrup",p:"A delicate saffron syrup soak for that royal finish." },
];

function Kunafa() {
  return (
    <section className="kunafa" id="kunafa">
      <div className="kunafa-floaters" aria-hidden="true">
        {[{t:"10%",l:"6%"},{t:"18%",r:"9%",d:".7s"},{b:"14%",l:"14%",d:"1.4s"},{b:"22%",r:"18%",d:".4s"}].map((p,i)=>(
          <span key={i} className="pistachio" style={{
            top:p.t, left:p.l, right:p.r, bottom:p.b, animationDelay:p.d||"0s"
          }}>🥜</span>
        ))}
      </div>
      <div className="container kunafa-wrap">
        <div className="kunafa-img-wrap" data-aos="zoom-in">
          <img src="/Kunafa.jpeg" alt="Signature Kesar Kunafa" loading="lazy" />
          <div className="glow-badge">
            <small>Starting from</small>
            <strong>₹399</strong>
            <small>Kunafa</small>
          </div>
        </div>
        <div className="kunafa-content" data-aos="fade-up" data-aos-delay="100">
          <div className="eyebrow">Cakeology Signature</div>
          <h2>The <em>Kunafa</em> Everyone's<br />Talking About</h2>
          <p>Golden, crisp, and dripping with kesar syrup — our handmade Kunafa is the dessert that put Cakeology on the map.</p>
          <div className="kunafa-features">
            {kunafaFeatures.map((f, i) => (
              <div key={i} className="kf-item">
                <span className="ico" aria-hidden="true">{f.ico}</span>
                <div><h4>{f.h}</h4><p>{f.p}</p></div>
              </div>
            ))}
          </div>
          <button className="gold-btn" onClick={() => openWhatsApp("Signature Kesar Kunafa", "₹399 onwards")}>
            <WaIcon /> Order Kunafa Now
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Videos ────────────────────────────────────────────────────────────────────
const videoCards = [
  { src:"/weddingV.mp4",  poster:"/AniC.jpeg",    tag:"Our Specialty",   title:"Wedding Cake" },
  { src:"/mangoVi.mp4",  poster:"/backimg.webp",  tag:"Premium Dessert", title:"Mango Dessert Special" },
  { src:"/EidVideo.mp4", poster:"/CEB.jpeg",      tag:"Special Occasion",title:"Eid Celebration Cakes" },
];
function Videos() {
  return (
    <section className="videos">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Our Sweet Creations</div>
          <h2 className="section-title">Watch The <em>Magic</em> Happen</h2>
          <p className="section-sub">From batter to masterpiece — a peek inside the Cakeology kitchen.</p>
        </div>
        <div className="video-grid">
          {videoCards.map((c, i) => (
            <div key={i} className="video-card" data-aos="fade-up" data-aos-delay={String(i * 120)}>
              <video autoPlay muted loop playsInline poster={c.poster} loading="lazy">
                <source src={c.src} type="video/mp4" />
              </video>
              <span className="play-dot" aria-hidden="true">▶</span>
              <div className="video-label">
                <span className="tag">{c.tag}</span>
                <h4>{c.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
const galleryImgs = [
  "/pinkandBBC.jpeg","/cupc.jpeg","/Brow.jpeg","/mickeymc.jpeg",
  "/DrGC.jpeg","/BBC.jpeg","/BCD.jpeg","/SmlBC.jpeg",
  "/BCS.jpeg","/Rosepink.jpeg","/BCW.jpeg","/MD.jpeg",
];

function Gallery() {
  const [lb, setLb] = useState(null);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setLb(null); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Our Gallery</div>
          <h2 className="section-title">A Feast For The <em>Eyes</em></h2>
          <p className="section-sub">A little taste of what leaves our kitchen every day.</p>
        </div>
        <div className="masonry">
          {galleryImgs.map((src, i) => (
            <button key={i} className="masonry-item" onClick={() => setLb(src)} aria-label={`View image ${i + 1}`}>
              <img src={src} alt={`Cakeology creation ${i + 1}`} loading="lazy" />
              <div className="overlay" aria-hidden="true">🔍</div>
            </button>
          ))}
        </div>
      </div>
      {lb && (
        <div className="lightbox active" role="dialog" aria-modal="true" aria-label="Image preview" onClick={() => setLb(null)}>
          <button className="lightbox-close" onClick={() => setLb(null)} aria-label="Close">&times;</button>
          <img src={lb} alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { img:"https://i.pravatar.cc/150?img=47", name:"Ayesha Khan",   loc:"Gulbarga",       quote:"The Kunafa from Cakeology is unreal — crispy, cheesy, and the kesar syrup is the perfect touch. Ordered for a family gathering and everyone asked where it was from!" },
  { img:"https://i.pravatar.cc/150?img=12", name:"Rohit Sharma",  loc:"Mehboob Nagar",  quote:"Ordered a custom birthday cake and it exceeded every expectation. Soft, fresh and beautifully decorated. Cakeology is now our go-to bakery for every celebration." },
  { img:"https://i.pravatar.cc/150?img=32", name:"Fatima",        loc:"Gulbarga",       quote:"The cheesecake was rich without being too sweet, and the brownies disappeared within minutes at our office party. Premium quality, every single time." },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const start = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIdx(p => (p + 1) % testimonials.length), 4500);
  };
  useEffect(() => { start(); return () => clearInterval(timer.current); }, []);
  const go = (i) => { setIdx((i + testimonials.length) % testimonials.length); start(); };

  return (
    <section className="testimonials" id="reviews">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Reviews</div>
          <h2 className="section-title">Loved By Our <em>Sweet</em> Customers</h2>
        </div>
        <div className="t-slider" data-aos="fade-up">
          <div className="t-track" style={{ minHeight: "300px" }}>
            {testimonials.map((t, i) => (
              <div key={i} className={`t-slide${i === idx ? " active" : ""}`}>
                <img src={t.img} alt={t.name} loading="lazy" />
                <div className="t-stars" aria-label="5 stars">★★★★★</div>
                <p>"{t.quote}"</p>
                <h5>{t.name}</h5>
                <span>{t.loc}</span>
              </div>
            ))}
          </div>
          <div className="t-controls">
            <button className="t-arrow" onClick={() => go(idx - 1)} aria-label="Previous">←</button>
            <div className="t-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={i === idx ? "active" : ""} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
            <button className="t-arrow" onClick={() => go(idx + 1)} aria-label="Next">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="about" id="about">
      <div className="container about-wrap">
        <div className="about-imgs" data-aos="fade-right">
          <div className="about-ring" aria-hidden="true" />
          <img className="img-a" src="/pinkandBBC.jpeg" alt="Cakeology cakes display" loading="lazy" />
          <img className="img-b" src="/last.jpeg"       alt="Baker at work"           loading="lazy" />
        </div>
        <div className="about-content" data-aos="fade-left" data-aos-delay="100">
          <div className="eyebrow">Our Story</div>
          <h2>Made With <em>Love</em> &amp; Passion</h2>
          <p>Cakeology began as a small kitchen dream in Gulbarga, fuelled by a love for beautiful, honest baking. What started with a handful of cupcakes for friends and family has grown into a bakery known for its show-stopping cakes and the now-famous Kesar Kunafa.</p>
          <p>Every order is still made the way the very first one was — fresh ingredients, careful hands, and a genuine wish to make your celebration sweeter. From birthdays to weddings, we treat every cake as the centrepiece of someone's favourite memory.</p>
          <div className="about-stats">
            <div><strong>2+</strong><span>Years Baking</span></div>
            <div><strong>10k+</strong><span>Cakes Delivered</span></div>
            <div><strong>4.9★</strong><span>Customer Rating</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", occasion:"Birthday", message:"" });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `Hello Cakeology!\n\nNew enquiry:\n\n• Name: ${form.name}\n• Phone: ${form.phone}\n• Occasion: ${form.occasion}\n\n• Message:\n${form.message || "No additional message."}\n\nThank you!`;
    window.open(`https://wa.me/918296142981?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setSent(true);
    setForm({ name:"", phone:"", occasion:"Birthday", message:"" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Get In Touch</div>
          <h2 className="section-title">Let's Bake Something <em>Sweet</em></h2>
          <p className="section-sub">Reach out for custom orders, bulk enquiries, or just to say hello.</p>
        </div>
        <div className="contact-wrap">
          {/* Info panel */}
          <div className="contact-info" data-aos="fade-right">
            <h3>Visit Or Reach Us</h3>
            <p>We'd love to hear from you and bring your dream dessert to life.</p>
            <div className="c-item">
              <span className="ico"><PhoneIcon /></span>
              <div><h5>Phone</h5><a href="tel:+918296142981">8296142981</a></div>
            </div>
            <div className="c-item">
              <span className="ico"><IgIcon /></span>
              <div><h5>Instagram</h5><a href="https://instagram.com/cakeology_glb" target="_blank" rel="noopener noreferrer">@cakeology_glb</a></div>
            </div>
            <div className="c-item">
              <span className="ico"><WaIcon /></span>
              <div><h5>WhatsApp</h5><a href="https://wa.me/918296142981" target="_blank" rel="noopener noreferrer">+91 82961 42981</a></div>
            </div>
            <div className="c-item">
              <span className="ico">📍</span>
              <div><h5>Address</h5><p>Mecca Colony, Mehboob Nagar Ring Road, Gulbarga</p></div>
            </div>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps?q=Mecca+Colony,+Mehboob+Nagar+Ring+Road,+Gulbarga&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cakeology Location"
              />
            </div>
          </div>

          {/* Form — submits to WhatsApp */}
          <form className="contact-form" data-aos="fade-left" onSubmit={handleSubmit} noValidate>
            <h3>Send An Enquiry via WhatsApp</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cf-name">Full Name</label>
                <input id="cf-name" name="name" type="text" placeholder="Your name" required value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-phone">Phone Number</label>
                <input id="cf-phone" name="phone" type="tel" placeholder="Your phone" required value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cf-occasion">Occasion</label>
              <select id="cf-occasion" name="occasion" value={form.occasion} onChange={handleChange}>
                <option>Birthday</option>
                <option>Wedding</option>
                <option>Kunafa Order</option>
                <option>Anniversary</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cf-msg">Your Message</label>
              <textarea id="cf-msg" name="message" placeholder="Tell us about your dream order..." value={form.message} onChange={handleChange} />
            </div>
            <button type="submit" className="gold-btn" style={{ width:"100%", justifyContent:"center" }}>
              <WaIcon /> {sent ? "Opening WhatsApp… ✓" : "Send via WhatsApp"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const navScroll = (e, id) => { e.preventDefault(); scrollTo(id); };
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="footer-logo" onClick={(e) => navScroll(e, "#home")}>
              <img src="/Logo.jpeg" alt="Cakeology" loading="lazy" />
              <span>Cakeology</span>
            </a>
            <p>Freshly baked, beautifully crafted desserts for every celebration — handmade with love in Gulbarga.</p>
            <div className="footer-social">
              <a href="https://instagram.com/cakeology_glb" target="_blank" rel="noopener noreferrer" className="social-btn ig-btn" aria-label="Instagram">
                <IgIcon size={17} />
              </a>
              <a href="https://wa.me/918296142981" target="_blank" rel="noopener noreferrer" className="social-btn wa-btn" aria-label="WhatsApp">
                <WaIcon size={17} />
              </a>
              <a href="tel:+918296142981" className="social-btn ph-btn" aria-label="Call us">
                <PhoneIcon size={17} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Explore</h5>
            {[["#home","Home"],["#about","About"],["#menu","Menu"],["#gallery","Gallery"]].map(([id,l])=>(
              <a key={id} href={id} onClick={(e)=>navScroll(e,id)}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h5>Specials</h5>
            {[["#kunafa","Signature Kunafa"],["#menu","Wedding Cakes"],["#menu","Cupcakes"],["#reviews","Reviews"]].map(([id,l],i)=>(
              <a key={i} href={id} onClick={(e)=>navScroll(e,id)}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <a href="tel:+918296142981">📞 8296142981</a>
            <a href="https://instagram.com/cakeology_glb" target="_blank" rel="noopener noreferrer">📷 @cakeology_glb</a>
            <a href="https://wa.me/918296142981" target="_blank" rel="noopener noreferrer">💬 Chat on WhatsApp</a>
            <span style={{fontSize:"13px",color:"#ffd9e7",lineHeight:1.5}}>📍 Mecca Colony, Mehboob Nagar Ring Road, Gulbarga</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Cakeology. All rights reserved.</span>
          <span>Crafted with 🤎 for dessert lovers everywhere.</span>
        </div>
      </div>
    </footer>
  );
}

// ── FABs ──────────────────────────────────────────────────────────────────────
function FABs() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <a
        href="https://wa.me/918296142981"
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <WaIcon size={26} />
      </a>
      <button
        className={`fab fab-top${show ? " show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.1/aos.js";
    s.onload = () => window.AOS?.init({ duration: 900, easing: "ease-out-cubic", once: true, offset: 55 });
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Products />
      <MenuImages />
      <Kunafa />
      <Videos />
      <Gallery />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
      <FABs />
    </>
  );
}
