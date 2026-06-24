import { useEffect, useRef, useState } from "react";

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeNav = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };
  const toggleNav = () => {
    const next = !open;
    setOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const smoothScroll = (e, id) => {
    e.preventDefault();
    closeNav();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeNav(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header id="site-header" className={scrolled ? "scrolled" : ""}>
      <div className="container nav-wrap">
        <a href="#home" className="logo" onClick={(e) => smoothScroll(e, "#home")}>
          <img src="/Logo.jpeg" alt="Cakeology Logo" className="logo-img" />
          <div className="logo-text-wrap">
            <div className="logo-name">Cakeology</div>
            <span>Bakery &amp; Desserts</span>
          </div>
        </a>

        {open && <div className="nav-overlay open" onClick={closeNav}></div>}

        <nav className={`nav-links${open ? " open" : ""}`}>
          {[["#home","Home"],["#about","About"],["#menu","Menu"],["#kunafa","Special Kunafa"],["#gallery","Gallery"],["#reviews","Reviews"],["#contact","Contact"]].map(([href, label]) => (
            <a key={href} href={href} onClick={(e) => smoothScroll(e, href)}>{label}</a>
          ))}
          <a href="#contact" className="nav-cta" onClick={(e) => smoothScroll(e, "#contact")}>Order Now</a>
        </nav>

        <div
          className={`burger${open ? " active" : ""}`}
          onClick={toggleNav}
          aria-label="Toggle menu"
          role="button"
          aria-expanded={open}
        >
          <span></span><span></span><span></span>
        </div>
      </div>
    </header>
  );
}

// ── ScrollProgress ───────────────────────────────────────────────────────────
function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(dh > 0 ? (window.scrollY / dh) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div id="scroll-progress" style={{ width: `${width}%` }}></div>;
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const smoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  return (
    <section className="hero" id="home">
      <video autoPlay muted loop playsInline poster="/backgroundimg.jpeg">
        <source src="/BGV.mp4" type="video/mp4" />
      </video>
      <div className="hero-floaters">
        {/* "🍫" */}
        {["🍰","🧁",,"🍓","🌸","✨"].map((e,i)=>(
          <span key={i} className="floater">{e}</span>
        ))}
      </div>
      <div className="hero-content">
        <div className="hero-eyebrow">Welcome to Cakeology</div>
        <h1>Freshly Baked, <em>Beautifully</em> Crafted</h1>
        <p>Custom Cakes, Desserts &amp; Sweet Memories for Every Celebration</p>
        <div className="hero-btns">
          <a href="#contact" className="glass-btn primary" onClick={(e)=>smoothScroll(e,"#contact")}>Order Now</a>
          <a href="#menu" className="glass-btn" onClick={(e)=>smoothScroll(e,"#menu")}>View Menu</a>
        </div>
      </div>
      <div className="scroll-cue"><span>Scroll</span><span className="stick"></span></div>
    </section>
  );
}

// ── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const text = "Custom Cakes \u00a0✦\u00a0 Signature Kunafa \u00a0✦\u00a0 Wedding Specials \u00a0✦\u00a0 Cupcakes & Brownies \u00a0✦\u00a0 Cheesecakes \u00a0✦\u00a0 Made Fresh Daily \u00a0✦";
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

// ── Products ─────────────────────────────────────────────────────────────────
const products = [
  { tag:"Bestseller", img:"/BC.jpeg", cat:"Birthday Cakes", name:"Chocolate Birthday Cake", price:"₹899", unit:"1kg", link:"#contact" },
  { tag:"Premium", img:"/AniCC.jpeg", cat:"Wedding Cakes", name:"Chocolate Wedding Cake", price:"₹4,999", unit:"tier", link:"#contact" },
  { img:"/mangoDes.jpeg", cat:"Cupcakes", name:"Mango Cupcake Box (6 pcs)", price:"₹349", unit:"box", link:"#contact" },
  { tag:"Signature", img:"/Kunafa.jpeg", cat:"Kunafa", name:"Signature Kesar Kunafa", price:"₹399", unit:"onwards", link:"#kunafa", btnText:"Explore" },
  { img:"/brownies.jpeg", cat:"Brownies", name:"Molten Chocolate Brownie", price:"₹199", unit:"piece", link:"#contact" },
  { img:"/roseC.jpeg", cat:"Cheesecakes", name:"Strawberry Bliss Cheesecake", price:"₹549", unit:"slice box", link:"#contact" },
];

function Products() {
  const smoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  return (
    <section className="products" id="menu">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Our Menu</div>
          <h2 className="section-title">Signature <em>Sweet</em> Creations</h2>
          <p className="section-sub">Handcrafted daily with premium ingredients, a touch of gold, and a whole lot of love.</p>
        </div>
        <div className="products-grid">
          {products.map((p, i) => (
            <div className="product-card" key={i} data-aos="fade-up" data-aos-delay={String((i % 3) * 100)}>
              <div className="product-img">
                {p.tag && <span className="product-tag">{p.tag}</span>}
                <img src={p.img} alt={p.name} />
              </div>
              <div className="product-body">
                <span className="cat">{p.cat}</span>
                <h3>{p.name}</h3>
                <div className="product-foot">
                  <div className="price">{p.price} <span>/ {p.unit}</span></div>
                  <a href={p.link} className="order-btn" onClick={(e)=>smoothScroll(e,p.link)}>{p.btnText || "Order"}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="products-foot" data-aos="fade-up">
          <a href="#menu-card" className="outline-btn" onClick={(e)=>smoothScroll(e,"#menu-card")}>View Full Menu ↓</a>
        </div>
      </div>
    </section>
  );
}

// ── MenuImages ───────────────────────────────────────────────────────────────
function MenuImages() {
  const smoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  return (
    <section className="menu-images" id="menu-card">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Price List</div>
          <h2 className="section-title">Our Full <em>Menu</em> Card</h2>
          <p className="section-sub">Everything we bake, with love and the finest ingredients — fresh every single day.</p>
        </div>
        <div className="menu-img-grid">
          <div className="menu-img-card" data-aos="fade-right">
            <img src="/Menu1.jpeg" alt="Cakeology Menu - Cakes & Cupcakes" />
            <div className="menu-img-badge">
              <span>Menu Card</span>
              <h4>Cakes &amp; Cupcakes</h4>
            </div>
          </div>
          <div className="menu-img-card" data-aos="fade-left">
            <img src="/Menu2.jpeg" alt="Cakeology Menu - Brownies, Cupcakes & Muffins" />
            <div className="menu-img-badge">
              <span>Menu Card</span>
              <h4>Brownies, Cupcakes &amp; Muffins</h4>
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"42px"}} data-aos="fade-up">
          <a href="#contact" className="gold-btn" onClick={(e)=>smoothScroll(e,"#contact")}>Order From The Menu</a>
        </div>
      </div>
    </section>
  );
}

// ── Kunafa ───────────────────────────────────────────────────────────────────
function Kunafa() {
  const smoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  const features = [
    { ico:"✨", h:"Crispy Golden Layers", p:"Hand-layered shredded phyllo, baked to perfection." },
    { ico:"🧀", h:"Rich & Cheesy Inside", p:"A molten, indulgent cheese centre in every bite." },
    { ico:"🥜", h:"Premium Pistachios", p:"Generously topped with hand-crushed pistachios." },
    { ico:"🌼", h:"Infused with Kesar Syrup", p:"A delicate saffron syrup soak for that royal finish." },
  ];
  const pistachios = [
    {style:{top:"10%",left:"6%"}},
    {style:{top:"18%",right:"9%",animationDelay:".7s"}},
    {style:{bottom:"14%",left:"14%",animationDelay:"1.4s"}},
    {style:{bottom:"22%",right:"18%",animationDelay:".4s"}},
    {style:{top:"50%",left:"48%",animationDelay:"2s",fontSize:"18px"}},
  ];
  return (
    <section className="kunafa" id="kunafa">
      <div className="kunafa-floaters">
        {pistachios.map((p,i)=>(
          <span key={i} className="pistachio" style={p.style}>{i<4?"🥜":"✨"}</span>
        ))}
      </div>
      <div className="container kunafa-wrap">
        <div className="kunafa-img-wrap" data-aos="zoom-in">
          <img src="/Kunafa.jpeg" alt="Signature Kunafa" />
          <div className="glow-badge">
            <small>Starting from</small>
            <strong>₹399</strong>
            <small>Kunafa</small>
          </div>
        </div>
        <div className="kunafa-content" data-aos="fade-up">
          <div className="eyebrow">Cakeology Signature</div>
          <h2>The <em>Kunafa</em> Everyone's<br/>Talking About</h2>
          <p>Golden, crisp, and dripping with kesar syrup — our handmade Kunafa is the dessert that put Cakeology on the map.</p>
          <div className="kunafa-features">
            {features.map((f,i)=>(
              <div key={i} className="kf-item">
                <span className="ico">{f.ico}</span>
                <div><h4>{f.h}</h4><p>{f.p}</p></div>
              </div>
            ))}
          </div>
          <a href="#contact" className="gold-btn" onClick={(e)=>smoothScroll(e,"#contact")}>Order Kunafa Now</a>
        </div>
      </div>
    </section>
  );
}

// ── Videos ───────────────────────────────────────────────────────────────────
function Videos() {
  const cards = [
    { src:"/mangoVi.mp4", poster:"/AniC.jpeg", tag:"Decorating", title:"Cake Decorating" },
    { src:"/mangoVi.mp4", poster:"/backimg.webp", tag:"In The Kitchen", title:"Baking Process" },
    { src:"/EidVideo.mp4", poster:"/CEB.jpeg", tag:"Sweet Moments", title:"Customer Celebrations" },
  ];
  return (
    <section className="videos">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Behind The Scenes</div>
          <h2 className="section-title">Watch The <em>Magic</em> Happen</h2>
          <p className="section-sub">From batter to masterpiece — a peek inside the Cakeology kitchen.</p>
        </div>
        <div className="video-grid">
          {cards.map((c,i)=>(
            <div key={i} className="video-card" data-aos="fade-up" data-aos-delay={String(i*150)}>
              <video autoPlay muted loop playsInline poster={c.poster}>
                <source src={c.src} type="video/mp4" />
              </video>
              <span className="play-dot">▶</span>
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
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const close = (e) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
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
            <div key={i} className="masonry-item" onClick={() => setLightbox(src)}>
              <img src={src} alt={`Gallery ${i+1}`} />
              <div className="overlay">+</div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className={`lightbox${lightbox ? " active" : ""}`} onClick={() => setLightbox(null)}>
          <span className="lightbox-close" onClick={() => setLightbox(null)}>&times;</span>
          <img src={lightbox} alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { img:"https://i.pravatar.cc/150?img=47", name:"Ayesha Khan", loc:"Gulbarga", quote:"\"The Kunafa from Cakeology is unreal — crispy, cheesy, and the kesar syrup is the perfect touch. Ordered for a family gathering and everyone asked where it was from!\"" },
  { img:"https://i.pravatar.cc/150?img=12", name:"Rohit Sharma", loc:"Mehboob Nagar", quote:"\"Ordered a custom birthday cake and it exceeded every expectation. Soft, fresh and beautifully decorated. Cakeology is now our go-to bakery for every celebration.\"" },
  { img:"https://i.pravatar.cc/150?img=32", name:"Fatima", loc:"Gulbarga", quote:"\"The cheesecake was rich without being too sweet, and the brownies disappeared within minutes at our office party. Premium quality, every single time.\"" },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const go = (i) => {
    setIdx((i + testimonials.length) % testimonials.length);
  };
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(p => (p + 1) % testimonials.length), 4500);
  };
  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);

  return (
    <section className="testimonials" id="reviews">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <div className="eyebrow">Reviews</div>
          <h2 className="section-title">Loved By Our <em>Sweet</em> Customers</h2>
        </div>
        <div className="t-slider" data-aos="fade-up">
          <div className="t-track">
            {testimonials.map((t, i) => (
              <div key={i} className={`t-slide${i===idx?" active":""}`}>
                <img src={t.img} alt={t.name} />
                <div className="t-stars">★★★★★</div>
                <p>{t.quote}</p>
                <h5>{t.name}</h5>
                <span>{t.loc}</span>
              </div>
            ))}
          </div>
          <div className="t-controls">
            <button className="t-arrow" onClick={() => { go(idx-1); startTimer(); }}>←</button>
            <div className="t-dots">
              {testimonials.map((_,i)=>(
                <button key={i} className={i===idx?"active":""} onClick={()=>{go(i);startTimer();}}></button>
              ))}
            </div>
            <button className="t-arrow" onClick={() => { go(idx+1); startTimer(); }}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="about" id="about">
      <div className="container about-wrap">
        <div className="about-imgs" data-aos="fade-right">
          <div className="about-ring"></div>
          <img className="img-a" src="/pinkandBBC.jpeg" alt="Bakery interior" />
          <img className="img-b" src="/last.jpeg" alt="Baker at work" />
        </div>
        <div className="about-content" data-aos="fade-left">
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 2400);
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
          <div className="contact-info" data-aos="fade-right">
            <h3>Visit Or Reach Us</h3>
            <p>We'd love to hear from you and bring your dream dessert to life.</p>
            <div className="c-item">
              <span className="ico">📞</span>
              <div><h5>Phone</h5><a href="tel:+918296142981">8296142981</a></div>
            </div>
            <div className="c-item">
              <span className="ico">📷</span>
              <div><h5>Instagram</h5><a href="https://instagram.com/cakeology_glb" target="_blank" rel="noopener">@cakeology_glb</a></div>
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
              ></iframe>
            </div>
          </div>
          <form className="contact-form" data-aos="fade-left" onSubmit={handleSubmit}>
            <h3>Send An Enquiry</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Your phone" required />
              </div>
            </div>
            <div className="form-group">
              <label>Occasion</label>
              <select>
                <option>Birthday</option>
                <option>Wedding</option>
                <option>Kunafa Order</option>
                <option>Anniversary</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea placeholder="Tell us about your dream order..."></textarea>
            </div>
            <button type="submit" className="gold-btn">
              {sent ? "Enquiry Sent ✓" : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const smoothScroll = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div>
            <span className="footer-logo">
              <img src="/Logo.jpeg" alt="Cakeology" />
              Cakeology
            </span>
            <p>Freshly baked, beautifully crafted desserts for every celebration — handmade with love in Gulbarga.</p>
            <div className="footer-social">
              <a href="https://instagram.com/cakeology_glb" target="_blank" rel="noopener">IG</a>
              <a href="https://wa.me/918296142981" target="_blank" rel="noopener">WA</a>
              <a href="tel:+918296142981">📞</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <a href="#home" onClick={(e)=>smoothScroll(e,"#home")}>Home</a>
            <a href="#about" onClick={(e)=>smoothScroll(e,"#about")}>About</a>
            <a href="#menu" onClick={(e)=>smoothScroll(e,"#menu")}>Menu</a>
            <a href="#gallery" onClick={(e)=>smoothScroll(e,"#gallery")}>Gallery</a>
          </div>
          <div className="footer-col">
            <h5>Specials</h5>
            <a href="#kunafa" onClick={(e)=>smoothScroll(e,"#kunafa")}>Signature Kunafa</a>
            <a href="#menu" onClick={(e)=>smoothScroll(e,"#menu")}>Wedding Cakes</a>
            <a href="#menu" onClick={(e)=>smoothScroll(e,"#menu")}>Cupcakes</a>
            <a href="#reviews" onClick={(e)=>smoothScroll(e,"#reviews")}>Reviews</a>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <a href="tel:+918296142981">8296142981</a>
            <a href="https://instagram.com/cakeology_glb" target="_blank" rel="noopener">@cakeology_glb</a>
            <a href="#contact" onClick={(e)=>smoothScroll(e,"#contact")}>Mecca Colony, Mehboob Nagar Ring Road, Gulbarga</a>
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
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a href="https://wa.me/918296142981" target="_blank" rel="noopener" className="fab fab-whatsapp" aria-label="Chat on WhatsApp">💬</a>
      <button className={`fab fab-top${show?" show":""}`} onClick={() => window.scrollTo({top:0,behavior:"smooth"})} aria-label="Back to top">↑</button>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    // Load AOS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.1/aos.js";
    script.onload = () => {
      if (window.AOS) window.AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 60 });
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
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
