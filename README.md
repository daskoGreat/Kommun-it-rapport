# Kommun IT-Mognadsanalys

**Powered by Great IT**

En modern webbapplikation för att analysera kommuners digitala mognad och få AI-drivna rekommendationer.

## ✨ Funktioner

- 🎨 **Great IT Design System** - Premium visuell identitet med Raleway-typografi och varumärkesfärger
- 🔐 **Autentisering & RBAC** - Säker inloggning med roller (Admin/User)
- 📊 **IT-Mognadsanalys** - Interaktiv enkät med dynamiska rekommendationer
- 🤖 **AI-Analys** - Integrerad AI-strateg (Ollama)
- 📄 **Premium PDF-Export** - Professionella rapporter med print-optimerad styling
- 🌐 **Responsiv Design** - Fungerar perfekt på alla enheter

## 🚀 Kom igång

### Förutsättningar

- Node.js 20+
- npm eller yarn
- (Valfritt) Ollama för AI-analys

### Installation

1. **Klona projektet**
   ```bash
   git clone <repository-url>
   cd Kommun-it-rapport
   ```

2. **Installera dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Konfigurera miljövariabler**
   
   Filen `.env.local` har redan skapats. Uppdatera `AUTH_SECRET` för produktion:
   ```bash
   AUTH_SECRET=your-production-secret-key
   DATABASE_URL="file:./dev.db"
   ```

4. **Initiera databasen**
   ```bash
   npx prisma db push
   ```

5. **Seed databasen** (skapar admin-användare)
   ```bash
   npm run seed
   ```
   
   **Admin credentials:**
   - Email: `admin@greatit.se`
   - Password: `admin123`

6. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```

   Öppna [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

Applikationen använder Great IT:s visuella identitet:

- **Primary Color:** `#0D232E` (Deep Dark Blue/Green)
- **Accent Color:** `#BAAA5D` (Muted Gold)
- **Typography:** Raleway (Google Fonts)
- **Spacing:** Luftig och modern layout
- **Components:** Premium känsla med subtila skuggor och hover-effekter

## 🔐 Autentisering

### Registrera ny användare
Gå till `/register` och skapa ett konto med:
- E-postadress
- Lösenord (minst 6 tecken)
- Roll (User eller Admin)

### Logga in
Besök `/login` för att logga in.

### Skyddade routes
- `/report` - Kräver inloggning
- `/admin` - Kräver Admin-roll (ej implementerad än)

## 📄 PDF-Export

Rapportsidan (`/report`) har optimerad print-styling:
- Klicka på "Skriv ut / Spara PDF"
- Välj "Spara som PDF" i print-dialogen
- Får automatiskt "Powered by Great IT" branding

## 🤖 AI-Analys (Valfritt)

För att aktivera AI-analys:

1. Installera [Ollama](https://ollama.ai/)
2. Ladda ner modellen:
   ```bash
   ollama pull gemma3:4b
   ```
3. Starta Ollama-servern (körs automatiskt vid installation)

## 📁 Projektstruktur

```
src/
├── app/
│   ├── api/auth/        # NextAuth API routes
│   ├── lib/actions.ts   # Server actions (login, register)
│   ├── login/           # Login page
│   ├── register/        # Register page
│   ├── report/          # Report page (protected)
│   └── globals.css      # Great IT theme tokens
├── components/
│   ├── auth/            # Auth forms
│   └── survey/          # Survey wizard
├── config/
│   └── brand.ts         # Brand configuration
└── auth.ts              # NextAuth config

prisma/
├── schema.prisma        # Database schema
└── seed.js              # Database seed script
```

## 🛠️ Utveckling

### Databas-kommandon

```bash
# Push schema changes
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### Build för produktion

```bash
npm run build
npm start
```

## 📝 Licens

© 2025 IT-Mognadsanalys. Powered by Great IT.
