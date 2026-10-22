# Hozzáférések - ki mihez fér hozzá

Cél: az `info.wanderdogs@gmail.com` címen (a Wanderdogs céges cím) mindenhez legyen hozzáférés, ami a rendszer működtetéséhez és fejlesztéséhez kell. Így nem egy személyhez van kötve a rendszer.

> **Titkokat (jelszó, API-kulcs, Stripe-kulcs) ide sem, és a repóba sem írunk.** A kulcsok az Apps Script Script Properties-ben vannak; aki Szerkesztő az Apps Script projekten, látja őket.

## Állapot-tábla

| Rendszer | Mire kell | Kell hozzá | Állapot |
|---|---|---|---|
| **GitHub repó** (`forgoandris05/wanderdogs-test-weboldal`) | weboldal kód, GitHub Pages | collaborator (Write) meghívás | lásd alább |
| **Google Sheet "Wanderdogs CRM"** | adatbázis, CRM | Szerkesztő megosztás | lásd alább |
| **Apps Script projekt** (a Sheet-hez vagy önállóan) | a teljes backend kód + Script Properties + triggerek + telepítések | Szerkesztő megosztás az Apps Script projekten (kézzel) | **kézzel kell** |
| **Google Naptárak** (Napközi & Panzió, Egyéni, Taxi) | foglalások | a naptárak megosztása (Módosíthat) | kézzel |
| **Google Drive oltási fotó mappa** (`OLTASI_FOLDER_ID`) | ügyfelek oltási fotói (személyes adat) | mappa megosztás | kézzel |
| **Stripe** (3 fiók: Timi, Viki, Dávid) | fizetések, webhook, visszatérítés | felhasználó meghívása a Stripe Dashboardon fiókonként | kézzel, a fiók tulajdonosa |
| **Számlázz.hu** | számlák | felhasználó/kulcs a tulajdonosnál | kézzel, a tulajdonos |
| **Cal.com** | ingyenes felmérő foglalása | csapattag vagy a fiók elérése | kézzel |
| **Domain** (wanderdogsworld.hu) + DNS | oldal címe | a domain-szolgáltató/regisztrátor fiókja | kézzel |
| **Google Search Console / Analytics / Meta Business** (ha vannak) | mérés, hirdetés | megosztás | kézzel |

## Hogyan add meg a hozzáférést (lépések)

### GitHub
1. A repó tulajdonosa (`forgoandris05`): Repo → **Settings → Collaborators → Add people** → az `info.wanderdogs@gmail.com` címhez tartozó GitHub-felhasználónév (vagy az email).
2. Ha ahhoz az emailhez még nincs GitHub fiók: előbb regisztrálni kell egyet (github.com/signup) ezzel az email-címmel, utána meghívható.
3. A meghívást el kell fogadni (emailben jön).
4. Jogosultság: **Write** (push branchre, PR). A `main` védelmét érdemes bekapcsolni (Settings → Branches → Require pull request), hogy senki ne tudjon véletlenül közvetlenül élesbe nyomni.
5. A repó jelenleg **publikus** (a GitHub Pages ingyenes hostingja miatt) - olvasni bárki tudja, írni csak a collaboratorok.

### Google Sheet (CRM)
Megnyitás → **Megosztás** → `info.wanderdogs@gmail.com` → **Szerkesztő**. Figyelem: a 🔐 Felhasználók fül ügyfelek személyes adatait és jelszó-hash-eit tartalmazza - csak megbízható emberekkel oszd meg, és GDPR szempontból az adatkezelési tájékoztatóval (`adatkezeles.html`) összhangban kezeld.

### Apps Script
script.google.com → a projekt → jobb felül **Megosztás** (vagy a projekt beállításai) → hozzáadás **Szerkesztőként**. Csak a projekt tulajdonosa tud megosztani. Ha az Apps Script a Sheethez kötött (Bővítmények → Apps Script), a Sheet szerkesztői automatikusan hozzáférnek a kódhoz - ezt érdemes ellenőrizni.
**Tulajdonjog:** a rendszer folytonossága miatt érdemes megfontolni, hogy a projekt (és a Stripe webhook URL-je) ne egy magánszemély fiókján éljen. Az `/exec` URL a tulajdonos fiókjához kötött; tulajdonosváltás vagy új telepítés URL-változással járhat, ami minden HTML-ben cserét igényel.

### Naptárak és Drive mappa
Google Naptár → a naptár beállításai → **Megosztás meghatározott személyekkel** → *Módosíthat és kezelhet megosztást* (vagy *Módosíthat*). Drive mappa → Megosztás → Szerkesztő.

### Stripe, Számlázz.hu, Cal.com, domain
Ezeket a fiók tulajdonosa tudja csak megadni (mind a három Stripe fiók más embernél van: Timi, Viki, Dávid - lásd ARCHITEKTURA.md). Stripe: Dashboard → Settings → Team → Invite. A Stripe API-kulcsot ne küldd emailben/chaten.

## Mit mondj a fejlesztőknek (ChatGPT-s fejlesztés esetén)

- A repó a GitHubról elérhető. A GAS kódot külön kell megosztani (Apps Script megosztás vagy privát repó), mert a publikus repóban szándékosan nincs.
- A Sheet fejléceit és egy-két anonimizált mintasort érdemes megosztani az AI-val, hogy ne találgasson oszlopokat - **valódi ügyféladatot ne másolj be AI-chatbe**.
- Éles változtatás előtt a [MUNKAMENET.md](MUNKAMENET.md) lépéseit kövessétek.

## Hozzáférések karbantartása

- Ha valaki kilép a projektből: vedd ki a GitHubról, a Sheetből, az Apps Scriptből, a Stripe-ból. Ha ő látta a Script Properties-t (Stripe-kulcsok), a kulcsokat **cserélni** kell.
- Évente egyszer nézd át, kinek van még hozzáférése (GitHub: Settings → Collaborators; Google: Megosztás ablak).
