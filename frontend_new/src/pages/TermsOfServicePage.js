// src/pages/TermsOfServicePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const TermsOfServicePage = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Podmínky použití Služby Justax.space</h1>
        <p><strong>Datum poslední aktualizace:</strong> 28. srpna 2025</p>

        <h2>1. Souhlas s podmínkami</h2>
        <p>Přístupem a používáním naší služby Justax.space ("Služba") bezvýhradně souhlasíte s těmito Podmínkami použití ("Podmínky"). Pokud s nimi nesouhlasíte, nejste oprávněni Službu používat.</p>

        <h2>2. Popis Služby</h2>
        <p>Justax.space je softwarová platforma (SaaS), která poskytuje nástroje pro automatizaci správy komunity na sociálních sítích pomocí umělé inteligence. Funkce zahrnují automatické odpovídání na komentáře, analýzu sentimentu a správu znalostní báze.</p>

        <h2>3. Uživatelské účty</h2>
        <p>Jste zodpovědní za zabezpečení svého účtu a hesla. Zavazujete se neprodleně nás informovat o jakémkoli narušení bezpečnosti nebo neoprávněném použití vašeho účtu. Pro registraci musíte být starší 16 let.</p>

        <h2>4. Povinnosti a odpovědnost uživatele</h2>
        <p>Zavazujete se používat Službu v souladu s platnými zákony a Podmínkami použití platformy Facebook. Jste plně zodpovědní za veškerý obsah, který je generován a publikován jménem vaší stránky prostřednictvím naší Služby. Justax.space nenese žádnou odpovědnost za případné porušení pravidel třetích stran, poškození reputace značky nebo jakoukoli jinou škodu způsobenou použitím automaticky generovaných odpovědí.</p>

        <h2>5. Zakázané použití</h2>
        <p>Zavazujete se, že nebudete Službu používat k žádným nezákonným účelům ani k činnostem, které by mohly poškodit, zneužít nebo narušit funkčnost Služby. Je zakázáno Službu používat k šíření spamu, nenávistného obsahu nebo dezinformací.</p>

        <h2>6. Duševní vlastnictví</h2>
        <p>Služba a její původní obsah (s výjimkou obsahu poskytnutého uživateli), funkce a vzhled jsou a zůstanou výhradním vlastnictvím Justax.space. Naše ochranné známky nesmí být používány v souvislosti s žádným produktem nebo službou bez našeho předchozího písemného souhlasu.</p>
        
        <h2>7. Omezení odpovědnosti</h2>
        <p>Služba je poskytována "tak, jak je", bez jakýchkoli záruk. V žádném případě nenese Justax.space odpovědnost za jakékoli nepřímé, náhodné nebo následné škody (včetně ušlého zisku) vzniklé v důsledku vašeho přístupu nebo používání Služby.</p>

        <h2>8. Změny Podmínek</h2>
        <p>Vyhrazujeme si právo tyto Podmínky kdykoli změnit. O podstatných změnách vás budeme informovat. Pokračováním v používání Služby po nabytí účinnosti změn s nimi vyjadřujete souhlas.</p>

        <h2>9. Kontaktujte nás</h2>
        <p>Máte-li jakékoli dotazy ohledně těchto Podmínek, kontaktujte nás na e-mailové adrese: <strong>info@justax.space</strong>.</p>
        
        <Link to="/landing" className="back-link">Zpět na hlavní stránku</Link>
      </div>
    </div>
  );
};

export default TermsOfServicePage;