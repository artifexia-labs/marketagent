// src/pages/PrivacyPolicyPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Zásady ochrany osobních údajů pro Justax.space</h1>
        <p><strong>Datum poslední aktualizace:</strong> 28. srpna 2025</p>

        <h2>1. Úvod</h2>
        <p>Vítejte v Justax.space ("Služba", "my", "nás"). Ochrana vašich osobních údajů je pro nás klíčová. Tyto Zásady ochrany osobních údajů vysvětlují, jaké informace shromažďujeme, jak je používáme a jak je chráníme v souladu s Obecným nařízením o ochraně osobních údajů (GDPR).</p>

        <h2>2. Jaké údaje shromažďujeme</h2>
        <p>Pro poskytování a zlepšování naší Služby shromažďujeme následující typy údajů:</p>
        <ul>
            <li><strong>Údaje poskytnuté při registraci:</strong> Vaše e-mailová adresa a heslo pro vytvoření a správu účtu.</li>
            <li><strong>Údaje z platformy Facebook:</strong> Po udělení vašeho souhlasu bezpečně uložíme dlouhodobý přístupový token (access token) pro správu vašich stránek. Dále shromažďujeme veřejně dostupné informace z vašich stránek: texty příspěvků, texty komentářů, jména autorů komentářů a odkazy na příspěvky.</li>
            <li><strong>Konfigurační údaje:</strong> Jakékoli informace, které nám poskytnete pro trénování AI, jako jsou URL webových stránek, textové popisy vaší značky, odkazy na FAQ a další nastavení strategie odpovědí.</li>
            <li><strong>Technické údaje:</strong> Můžeme shromažďovat základní technické informace, jako je IP adresa, typ prohlížeče a informace o zařízení pro zajištění bezpečnosti a funkčnosti Služby.</li>
        </ul>

        <h2>3. Jak používáme vaše údaje</h2>
        <p>Vaše údaje používáme výhradně pro následující účely:</p>
        <ul>
            <li>K poskytování klíčových funkcí Služby, tedy ke čtení komentářů a publikování odpovědí jménem vaší stránky.</li>
            <li>K analýze komentářů pomocí modelů umělé inteligence za účelem určení tónu a záměru.</li>
            <li>Ke generování relevantních odpovědí na základě vámi poskytnuté znalostní báze.</li>
            <li>K zobrazování analytických dat o vašich stránkách v rámci Služby.</li>
            <li>Ke komunikaci s vámi ohledně vašeho účtu a technické podpoře.</li>
        </ul>
        
        <h2>4. Právní základ pro zpracování (GDPR)</h2>
        <p>Vaše osobní údaje zpracováváme na základě následujících právních titulů:</p>
        <ul>
            <li><strong>Plnění smlouvy:</strong> Zpracování je nezbytné pro plnění smlouvy, jejíž stranou jste (poskytování Služby dle Podmínek použití).</li>
            <li><strong>Souhlas:</strong> Pro určité účely, jako je připojení vašeho účtu na Facebooku, vás žádáme o výslovný souhlas.</li>
            <li><strong>Oprávněný zájem:</strong> Zpracování je nezbytné pro naše oprávněné zájmy, jako je zajištění bezpečnosti Služby.</li>
        </ul>

        <h2>5. Sdílení a předávání údajů</h2>
        <p>Vaše osobní údaje neprodáváme. Sdílíme je pouze s důvěryhodnými třetími stranami (zpracovateli), které nám pomáhají provozovat Službu:</p>
        <ul>
            <li><strong>Supabase:</strong> Pro bezpečnou autentizaci, ukládání dat vašeho účtu, přístupových tokenů a nastavení v šifrované databázi (servery v EU).</li>
            <li><strong>Google (Gemini AI):</strong> Texty komentářů a obsah vaší znalostní báze jsou předávány do API společnosti Google pro účely analýzy a generování odpovědí.</li>
            <li><strong>Meta (Facebook Graph API):</strong> Pro získávání dat a odesílání odpovědí v souladu s vámi udělenými oprávněními.</li>
        </ul>

        <h2>6. Zabezpečení a uchovávání údajů</h2>
        <p>Přijímáme veškerá přiměřená technická a organizační opatření k ochraně vašich údajů. Přístupové tokeny jsou uloženy v šifrované podobě. Údaje uchováváme pouze po dobu nezbytně nutnou – po dobu trvání vašeho účtu. Po smazání účtu jsou vaše data nevratně odstraněna z našich produkčních databází.</p>
        
        <h2>7. Vaše práva dle GDPR</h2>
        <p>Máte právo na přístup, opravu, výmaz (právo být zapomenut), omezení zpracování a přenositelnost vašich osobních údajů. Můžete kdykoli odvolat svůj souhlas s připojením k Facebooku. Pro uplatnění těchto práv nás kontaktujte na e-mailu support@justax.space.</p>
        
        <h2>8. Ochrana soukromí dětí</h2>
        <p>Naše Služba není určena osobám mladším 16 let. Vědomě neshromažďujeme osobní údaje od dětí.</p>
        
        <h2>9. Kontaktujte nás</h2>
        <p>Máte-li jakékoli dotazy ohledně těchto Zásad, kontaktujte nás na e-mailové adrese: <strong>support@justax.space</strong>.</p>
        
        <Link to="/landing" className="back-link">Zpět na hlavní stránku</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;