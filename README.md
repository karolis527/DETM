# DETM Anketų Aplikacija

Ši aplikacija, sukurta su Next.js ir Firebase, leidžia valdyti ir peržiūrėti moderatorių, administratorių, programuotojų ir dizainerių anketas.

## Konfigūracija nemokamam talpinimui (Hosting)

Jūsų projektas yra pilnai sukonfigūruotas veikti **nemokamai**. Naudojamos paslaugos (`Firebase Authentication`, `Firestore`) neviršija dosnaus nemokamo „Spark“ plano limitų. Serverio konfigūracija (`apphosting.yaml`) yra apribota iki vienos instancijos, kad būtų išvengta bet kokių netikėtų išlaidų.

## Kaip patalpinti projektą nemokamai

Yra du populiarūs ir puikiai tinkantys būdai šiam projektui patalpinti.

### 1. Firebase App Hosting (Rekomenduojama)

Tai paprasčiausias būdas, nes jūsų programa jau naudoja Firebase paslaugas.

**Būtini įrankiai:**
- **Node.js**: Įsitikinkite, kad turite įdiegtą Node.js. [Atsisiųsti galite čia](https://nodejs.org/).
- **Firebase CLI**: Tai komandinės eilutės įrankis, skirtas valdyti Firebase projektus.

**Diegimo žingsniai:**
1.  **Įdiekite Firebase CLI:** Jei neturite, atsidarykite terminalą ir vykdykite komandą:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Prisijunkite prie Google:**
    ```bash
    firebase login
    ```
3.  **Susiekite projektą:** Projekto aplanke įvykdykite komandą. Jums reikės pasirinkti anksčiau sukurtą Firebase projektą (`studio-6072831928-7b46a`).
    ```bash
    firebase apphosting:backends:create
    ```
4.  **Įdiekite aplikaciją:** Šis procesas gali užtrukti kelias minutes.
    ```bash
    firebase deploy --only apphosting
    ```
Sėkmingai įdiegus, terminale pamatysite nuorodą į savo veikiančią aplikaciją!

---

### 2. Vercel

**Vercel** yra dar viena puiki, nemokama platforma, idealiai tinkanti Next.js projektams.

1.  **Įkelkite kodą:** Įkelkite savo projekto kodą į `GitHub`, `GitLab` ar `Bitbucket`.
2.  **Užsiregistruokite:** Prisijunkite prie [Vercel](https://vercel.com/) naudodami savo Git paskyrą.
3.  **Importuokite repozitoriją:** Vercel prietaisų skydelyje pasirinkite savo projekto repozitoriją ir spauskite "Import".
4.  **Sukonfigūruokite kintamuosius:** Prieš diegiant, Vercel projekto nustatymuose, skiltyje "Environment Variables", pridėkite šiuos kintamuosius. Jų reikšmes rasite savo Firebase projekto nustatymuose (Project Settings -> General -> Your apps -> SDK setup and configuration).

    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

5.  **Įdiekite:** Paspauskite "Deploy". Vercel automatiškai įdiegs jūsų projektą ir suteiks jums nuorodą.
