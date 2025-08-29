// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AnalyticsIcon, SettingsIcon, InboxIcon } from '../components/Icons'; // JustaxLogo už nepotřebujeme importovat, máme ho přímo v JSX
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-body">
      <div className="landing-container">
        
        {/* --- Navigace --- */}
        <nav className="landing-nav">
          <div className="nav-content">
            {/* Oprava loga Justax přímo zde */}
            <Link to="/landing" className="justax-logo-text">Justax</Link> 
            <div className="nav-links">
              <a href="#features">Klíčové funkce</a>
              <a href="#accuracy">Přesnost AI</a>
              <a href="#how-it-works">Jak to funguje</a>
              <a href="#pricing">Ceník</a>
            </div>
            <div className="nav-actions">
              <Link to="/login" className="button-secondary">Přihlásit se</Link>
              <Link to="/signup" className="button-primary">Vyzkoušet zdarma</Link>
            </div>
          </div>
        </nav>

        {/* --- Hlavní sekce (Hero) --- */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Váš <span className="highlight-cyan">AI expert</span> pro sociální sítě. <br/> S garancí přesnosti a kontroly.
            </h1>
            <p className="hero-subtitle">
              Zvyšte loajalitu zákazníků, chraňte pověst své značky a ušetřete desítky hodin měsíčně. Justax automatizuje komunikaci s vaší komunitou 24/7 s důvěryhodnou AI.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="button-primary large">Začněte zdarma ještě dnes</Link>
              <p className="hero-subtext">Bez nutnosti platební karty.</p>
            </div>
          </div>
        </header>
        
        {/* --- Sekce Problém/Řešení --- */}
        <section id="problem" className="problem-section">
            <h2 className="section-title">Už vás nebaví rutina na sociálních sítích?</h2>
            <p className="section-intro">Každý komentář je příležitost. Ale ruční správa je časově náročná a neefektivní.</p>
            <div className="problem-grid">
                <div className="problem-card">
                    <h4>Ztracený čas</h4>
                    <p>Hodiny strávené odpovídáním na stále stejné dotazy.</p>
                </div>
                <div className="problem-card">
                    <h4>Riziko pro pověst</h4>
                    <p>Jedna špatná recenze bez správné odpovědi může poškodit vaši značku.</p>
                </div>
                <div className="problem-card">
                    <h4>Promeškané příležitosti</h4>
                    <p>Nezodpovězené dotazy na produkty znamenají ztracené prodeje.</p>
                </div>
            </div>
            <h3 className="solution-text">Justax je váš chytrý asistent, který pracuje pro vás.</h3>
        </section>

        {/* --- Sekce Klíčové funkce --- */}
        <section id="features" className="features-section">
            <h2 className="section-title">Nástroje, které přinášejí výsledky</h2>
            <div className="features-grid-detailed">
                <div className="feature-card-detailed">
                    <div className="feature-icon"><InboxIcon /></div>
                    <h4>Inteligentní odpovědi 24/7</h4>
                    <p>Nenechte žádného zákazníka čekat. Naše AI analyzuje záměr a tón komentáře, aby poskytla okamžité a relevantní odpovědi. Vaše značka je vždy aktivní.</p>
                </div>
                <div className="feature-card-detailed">
                    <div className="feature-icon"><AnalyticsIcon /></div>
                    <h4>Hloubková analýza sentimentu</h4>
                    <p>Pochopte, co si vaše publikum skutečně myslí. Sledujte poměr pozitivních, neutrálních a negativních zmínek a identifikujte klíčová témata, která ovlivňují vaši značku.</p>
                </div>
                <div className="feature-card-detailed">
                    <div className="feature-icon"><SettingsIcon /></div>
                    <h4>Personalizovaná znalostní báze</h4>
                    <p>AI se stane expertem na vaše produkty a služby. Využívá vámi dodané informace (web, FAQ, dokumenty) k přesným a konzistentním odpovědím v souladu s vaší firemní identitou.</p>
                </div>
            </div>
        </section>

        {/* --- Sekce Důvěra a přesnost AI --- */}
        <section id="accuracy" className="accuracy-section">
            <h2 className="section-title">Důvěra a přesnost v každé odpovědi</h2>
            <p className="section-intro">
                Víme, že AI vyžaduje důvěru. Proto jsme navrhli Justax s maximálním ohledem na kontrolu a spolehlivost.
            </p>
            <div className="accuracy-grid">
                <div className="accuracy-card">
                    <h4>Vaše kontrola na prvním místě</h4>
                    <p>AI odpovídá pouze na základě vámi schválené znalostní báze a definovaného tónu. Máte plnou kontrolu nad každým aspektem komunikace.</p>
                </div>
                <div className="accuracy-card">
                    <h4>Učí se pouze od vás</h4>
                    <p>Naše AI se učí výhradně z dat, která jí poskytnete. Žádné nečekané "překvapení" – jen konzistentní a relevantní komunikace.</p>
                </div>
                <div className="accuracy-card">
                    <h4>Transparentní reporty</h4>
                    <p>Sledujte všechny AI-generované odpovědi a jejich dopad v přehledných analytických reportech. Vždy víte, co se děje.</p>
                </div>
            </div>
        </section>

        {/* --- Sekce Jak to funguje (kroky) --- */}
        <section id="how-it-works" className="how-it-works-section">
          <h2 className="section-title">Začněte za méně než 5 minut</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Připojte svou stránku</h3>
              <p>Bezpečně propojte svůj účet na Facebooku pomocí několika kliknutí. Vše je šifrované a zabezpečené.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Naučte AI váš styl</h3>
              <p>Poskytněte AI informace o vaší značce – odkaz na web, FAQ nebo vlastní texty. AI se naučí komunikovat vaším hlasem a tonem.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Aktivujte a sledujte</h3>
              <p>Zapněte autopilota a sledujte, jak AI pracuje za vás. Můžete kdykoli zasáhnout a převzít kontrolu, nebo nechat AI pracovat automaticky.</p>
            </div>
          </div>
        </section>
        
        {/* --- Sekce Ceník --- */}
        <section id="pricing" className="pricing-section">
            <h2 className="section-title">Jednoduchý a férový ceník</h2>
            <p className="section-intro">Začněte zdarma a rozšiřujte podle potřeby. Žádné skryté poplatky. Lokalizováno pro Cheb, Karlovarský kraj.</p>
            <div className="pricing-card">
                <h3>Pro</h3>
                <p className="price">499 Kč <span className="price-period">/ měsíc</span></p>
                <p className="pricing-description">Vše, co potřebujete pro profesionální správu vaší komunity.</p>
                <ul>
                    <li>✓ Neomezený počet AI odpovědí</li>
                    <li>✓ Hloubková analýza sentimentu a reporty</li>
                    <li>✓ Připojení až 3 sociálních profilů</li>
                    <li>✓ Pokročilá znalostní báze (web, soubory, text)</li>
                    <li>✓ Prioritní e-mailová podpora</li>
                </ul>
                <Link to="/signup" className="button-primary">Začít s plánem Pro</Link>
            </div>
        </section>

        {/* --- Závěrečná výzva k akci (CTA) --- */}
        <section className="cta-section">
            <h2 className="cta-title">Jste připraveni transformovat svou komunikaci?</h2>
            <p>Dejte své značce hlas, který si zaslouží. Získejte zpět svůj čas a budujte silnější, důvěryhodné vztahy se zákazníky s Justax.</p>
            <Link to="/signup" className="button-primary large">Vyzkoušejte Justax zdarma</Link>
        </section>

        {/* --- Patička --- */}
        <footer className="landing-footer">
          <div className="footer-links">
            <Link to="/privacy">Zásady ochrany osobních údajů</Link>
            <span>|</span>
            <Link to="/terms">Podmínky použití</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Justax.space. Všechna práva vyhrazena.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;