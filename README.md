# NexSpy

NexSpy is a local party game for iOS built with Expo and React Native. Players pass the device around to reveal private roles, then use the built-in timer to play a round of Spy Game.

## Features

- Configurable citizen, spy, player, and timer counts
- Private role reveal flow for passing one device between players
- Built-in game timer with pause, resume, and new-game controls
- Word selection with reduced repeats during a session
- English, Persian, and French app text
- iOS app configuration for App Store builds

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Native iOS project under `ios/`

## Getting Started

Install dependencies:

```sh
npm install
```

Start the Expo development server:

```sh
npm start
```

Run on iOS:

```sh
npm run ios
```

Create a release iOS build locally:

```sh
npm run ios:release
```

## Project Structure

```text
App.tsx                 Main app flow and screen routing
src/components/         Reusable React Native components
src/screens/            Setup, reveal, ready, and timer screens
src/data/               Game word list
src/i18n/               Translations and language provider
src/utils/              Role generation and shuffle helpers
assets/                 Expo app icons and splash assets
ios/                    Generated native iOS project
```

## App Store Support

Apple requires a public support URL when submitting an app. This repository includes `SUPPORT.md` for that purpose.

After pushing this repository to GitHub, you can use the public URL to that file in App Store Connect, for example:

```text
https://github.com/hrakhshani/nex-spy-game/blob/main/SUPPORT.md
```

## Privacy Policy

Apple requires a public privacy policy URL for all apps. This repository includes `PRIVACY.md` for that purpose.

Use this URL in App Store Connect after the repository is public:

```text
https://github.com/hrakhshani/nex-spy-game/blob/main/PRIVACY.md
```

## License

No license has been added yet. Add a license before making the repository public if you want to define how others may use the code.
