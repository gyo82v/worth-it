1. Light mode / Dark mode: how is it different from web?

The concept is similar, but the implementation is different.

Web app

Usually:

Browser
   ↓
CSS
   ↓
prefers-color-scheme
   ↓
dark/light styles

Example:

@media (prefers-color-scheme: dark) {
  body {
    background: black;
  }
}

Or with Tailwind:

<div className="bg-white dark:bg-black">

The browser controls the theme.

Native app

A mobile app has access to the operating system theme.

Example:

Android:

Phone settings
    ↓
Dark mode ON
    ↓
Your app receives the change

React Native provides:

Appearance

or:

useColorScheme()

Example:

const scheme = useColorScheme();

console.log(scheme);
// "light" | "dark"
Do we need dark mode?

My opinion for Worth It:

Yes.

Reasons:

1. It is expected in modern apps

Most finance/productivity apps support:

light
dark
system

Examples:

banking apps
note apps
productivity apps
2. Your app has many numbers and statistics

Dark mode is excellent for:

dashboards
charts
analytics
3. Portfolio value

A recruiter/user sees:

theme switching
preferences
polished UX

It adds credibility.

Should we design it first?

Not every screen.

But we should decide:

Theme system first

For example:

Theme
│
├── light
│   ├── background
│   ├── card
│   ├── text
│   ├── primary
│
└── dark
    ├── background
    ├── card
    ├── text
    ├── primary

Then every component uses:

className="bg-background text-foreground"

instead of:

className="bg-white text-black"

This is the correct time to decide it.

2. Languages: how does it work in a mobile app?

The concept is very similar to your Nextill app.

You have:

translations
    |
    ├── English
    ├── Italian
    ├── French
    └── German

Example:

locales/
 ├── en.json
 ├── it.json
 ├── fr.json
 └── de.json

Then:

t("evaluation.title")

returns:

English:

Job evaluation

Italian:

Valutazione lavoro
Is language automatic?

You have two choices.

Option 1: Follow device language

Example:

User phone:

Android language:
Italian

App opens:

Italian

using:

expo-localization
Option 2: User chooses manually

Settings:

Language

○ System
○ English
○ Italiano
○ Français
○ Deutsch

The app saves:

language = "it"
I recommend:

Support both:

Language

System
English
Italian
German
French
Spanish

This is the most professional approach.

When publishing, where is the app available?

This is an important distinction.

The app store availability and app language are separate.

You publish:

Worth It

to:

Google Play Store

It can be available worldwide.

Then inside the app:

Available languages:
English
Italian
German
French
Spanish

Users in other countries can still install it.

Example:

A user in Japan downloads Worth It.

If you only implemented:

English
Italian
German

they will see:

English

(or the default language).

Do we need languages from day one?

I would say:

Yes, but don't translate everything immediately.

We should create:

src/i18n/

from the beginning.

Then every text is:

<Text>
 {t("home.title")}
</Text>

not:

<Text>
 Your evaluation
</Text>

Changing later is painful.

Other things we should decide before coding

I would decide these now:

3. Navigation structure

We already discussed this.

Possible structure:

Home
 |
 ├── Quick Evaluation
 |
 ├── Advanced Evaluation
 |
 ├── History
 |
 ├── Compare Jobs
 |
 └── Settings

Important because Expo Router structure depends on this.

4. Data model

Before Firebase, decide:

What is an evaluation?

Something like:

Evaluation {
 id
 userId

 jobName

 income {
   salary
   bonuses
 }

 expenses {
   transport
   food
   equipment
 }

 time {
   workHours
   travelHours
 }

 result {
   hourlyRate
   monthlyRate
 }

 createdAt
}

This affects Firestore.

5. Authentication

Do users need accounts?

Options:

Option A

No login initially.

Store locally.

Pros:

faster onboarding

Cons:

no sync
Option B

Firebase account.

Pros:

cloud backup
multiple devices

Cons:

more friction

My recommendation for Worth It:

Start with:

No account required
        |
Use app
        |
Optional account later
        |
Sync history

Many successful apps do this.

6. Offline support

Very important for a mobile app.

Question:

Should Worth It work without internet?

I think:

Yes.

A calculator should work offline.

Architecture:

User input
    |
Local storage
    |
(optional)
Firebase sync
7. App onboarding

Decide:

First launch:

Welcome to Worth It

Understand your real hourly value.

[Start]

or immediately:

Quick Evaluation

I would add a simple onboarding.

8. Notifications?

Probably later.

Possible:

"Your average hourly income this month decreased."

Not needed now.

My recommended decisions for Worth It

Before coding, I would lock these:

Feature	Decision
Theme	Light + Dark + System
Language	System + manual override
Languages	English first, then IT/DE/FR/ES
Auth	Optional later
Storage	Local first + Firebase sync
Offline	Yes
Navigation	Tabs
Forms	React Hook Form + Zod
State	Zustand
Database	Firebase Firestore
Animations	Reanimated
Icons	Expo Vector Icons
Charts	Later