# Changelog

## [1.3.0](https://github.com/davidsneighbour/ai/compare/v1.2.0...v1.3.0) (2026-07-03)

### Bug Fixes

* rename package name ([cfdbab4](https://github.com/davidsneighbour/ai/commit/cfdbab46b80d39aecfecde215ac49d93210a4a93))

### Prompts

* add accessibility review, TS utility refactor, and web clipper prompts ([55f0b68](https://github.com/davidsneighbour/ai/commit/55f0b68535a82640ad84672b351716bf20757ae6))

### Instructions

* add Astro architecture and TypeScript instructions ([2d70768](https://github.com/davidsneighbour/ai/commit/2d707683b593cfd2f20cd00b3b5d4962eac63861))
* add platform, meta-authoring, verification, and WordPress instructions ([d21bdf1](https://github.com/davidsneighbour/ai/commit/d21bdf1bee9c681cb7c09169c43c2db798f2a076))

### Skills

* extend dnb-voice with evidence grounding, add voice.instructions.md ([6e26597](https://github.com/davidsneighbour/ai/commit/6e2659773058ac60e8da8fbb23392d0c637febcb))

## [1.2.0](https://github.com/davidsneighbour/ai/compare/v1.1.0...v1.2.0) (2026-07-03)

### Features

* **agents:** adopt dotagents layout ([96bc71f](https://github.com/davidsneighbour/ai/commit/96bc71f81756de6b715d9f053c4262669de8fa4b))

### Skills

* add Astro migration project skill ([8601eed](https://github.com/davidsneighbour/ai/commit/8601eede7a718d286e9e66dde3ec2cb97fe416eb)), closes [#20](https://github.com/davidsneighbour/ai/issues/20)
* add blog draft skills (wip) ([a822482](https://github.com/davidsneighbour/ai/commit/a8224820bc3664763b65b55de080d9129b4b03f8))
* add dnb behaviour spec skill ([ee138ad](https://github.com/davidsneighbour/ai/commit/ee138ade611e33e1293a6e96cd15fbb4e3bd569a))

### Documentation

* **instructions:** publish issue handling workflow ([8fbbc40](https://github.com/davidsneighbour/ai/commit/8fbbc40a00783ba114ca9d46ad511ace0e19f76c)), closes [#19](https://github.com/davidsneighbour/ai/issues/19)

### Build

* **vscode:** update workspace dictionary ([11049f0](https://github.com/davidsneighbour/ai/commit/11049f0974022128e752a4e2ba7689c3289566ee))

### Chores

* move memory and task sources ([50ea728](https://github.com/davidsneighbour/ai/commit/50ea72897fb4b12ee91eb0e9e4b25ad4cdfa637e))

## [1.1.0](https://github.com/davidsneighbour/ai/compare/v1.0.0...v1.1.0) (2026-06-30)

### Features

* support multi-target agent symlinks ([3e25b6c](https://github.com/davidsneighbour/ai/commit/3e25b6c1782a6c002bc70895d947abefb3c08089))

### Instructions

* add conventional commit instructions ([d4a5a45](https://github.com/davidsneighbour/ai/commit/d4a5a458a80340e3f26d210305cdaab62a381d58))
* split TypeScript guidance by topic ([80e14cc](https://github.com/davidsneighbour/ai/commit/80e14cc7e49689b111aabf84ed8e934e6e226025))

## [1.0.0](https://github.com/davidsneighbour/ai/compare/v0.7.1...v1.0.0) (2026-06-30)

### ⚠ BREAKING CHANGES

* **cli:** CLI commands installed from this package now resolve defaults from the repository root instead of the invocation directory.

Signed-off-by: Patrick Kollitsch <davidsneighbourdev+gh@gmail.com>

### Features

* **cli:** expose repository scripts as global bins ([cd5b76f](https://github.com/davidsneighbour/ai/commit/cd5b76f3b5d8e469474208178e8d9e6094c64c4d))
* **scripts:** configure AI symlink linking ([f2bf17b](https://github.com/davidsneighbour/ai/commit/f2bf17b38c5d1498a661d65e31b419d7d8a4099d))

### Skills

* fix markdown lint issues ([9ae574f](https://github.com/davidsneighbour/ai/commit/9ae574f0c9fb7e5421b86e0eb2b642c8b3879cf1))

### Documentation

* consolidate documentation directory ([b6257af](https://github.com/davidsneighbour/ai/commit/b6257af4ed71fbd40cf8b2ff5607a6e53612e190))

### Chores

* fix repo lint and update todo ([df0bad5](https://github.com/davidsneighbour/ai/commit/df0bad5de3cda656e48d0d7cd4f4395bc0f769f7))
* **project:** update project plan ([51aefed](https://github.com/davidsneighbour/ai/commit/51aefed638e05c4890a8ff3736951756baad2112)), closes [#16](https://github.com/davidsneighbour/ai/issues/16) [#17](https://github.com/davidsneighbour/ai/issues/17) [#16](https://github.com/davidsneighbour/ai/issues/16) [#12](https://github.com/davidsneighbour/ai/issues/12)

## [0.7.1](https://github.com/davidsneighbour/ai/compare/v0.7.0...v0.7.1) (2026-06-29)

### Bug Fixes

* **prompts:** make name the canonical identifier ([5d75cb9](https://github.com/davidsneighbour/ai/commit/5d75cb9c56910fd80e002842396ac4784c0e3514)), closes [#12](https://github.com/davidsneighbour/ai/issues/12)

### Documentation

* changes to README.md and skills configuration ([d715765](https://github.com/davidsneighbour/ai/commit/d7157657920cafc071369ba72777d2aaa23d34d1))

### Build

* **deps:** update dependencies ([bc38216](https://github.com/davidsneighbour/ai/commit/bc382169d6423561d5920a47c6db08d72bb34fd7))

### Chores

* **project:** update project plan ([7258ad5](https://github.com/davidsneighbour/ai/commit/7258ad538a1fe2ee5da2465ce44d27f2935aeeb4)), closes [#6](https://github.com/davidsneighbour/ai/issues/6) [#7](https://github.com/davidsneighbour/ai/issues/7) [#8](https://github.com/davidsneighbour/ai/issues/8) [#9](https://github.com/davidsneighbour/ai/issues/9) [#11](https://github.com/davidsneighbour/ai/issues/11) [#13](https://github.com/davidsneighbour/ai/issues/13) [#14](https://github.com/davidsneighbour/ai/issues/14) [#12](https://github.com/davidsneighbour/ai/issues/12)

## [0.7.0](https://github.com/davidsneighbour/ai/compare/v0.6.1...v0.7.0) (2026-06-29)

### Features

* **agents:** add VS Code agent registry support ([e4a537f](https://github.com/davidsneighbour/ai/commit/e4a537f0d13536c7aaf632f74841d2fc9d265bd1))
* **skills:** add skills.sh grouping config ([b0c4c02](https://github.com/davidsneighbour/ai/commit/b0c4c02ec87cabbe91bbde9c87a596d6453ce446))

### Bug Fixes

* **prompts:** add health check metadata ([c63cc6d](https://github.com/davidsneighbour/ai/commit/c63cc6dee918d62c1f4713eff881c12343798c4d))
* **registry:** normalize asset filename suffixes ([17d3881](https://github.com/davidsneighbour/ai/commit/17d388180481fbde311f5cd5ef38104cf2e58300))

### Documentation

* add Netlify agent partial ([76dbc67](https://github.com/davidsneighbour/ai/commit/76dbc675bbccc2d3a47bd44b5db361e08b336476))
* document external AI tools ([ded651d](https://github.com/davidsneighbour/ai/commit/ded651de54498015cd909e22842a22854de2d886))
* record roadmap issue clarifications ([1a76f31](https://github.com/davidsneighbour/ai/commit/1a76f31248e3893f1c19f79e56c1b8c0e69715b7))

## [0.6.1](https://github.com/davidsneighbour/ai/compare/v0.6.0...v0.6.1) (2026-06-28)

### Build

* **release:** use plural asset commit types ([6fd90b0](https://github.com/davidsneighbour/ai/commit/6fd90b034c55b8184a6ea705f89eba8b848da8ae))

## [0.6.0](https://github.com/davidsneighbour/ai/compare/v0.5.0...v0.6.0) (2026-06-28)

### Instructions

* move instruction assets to repo root ([00b1e78](https://github.com/davidsneighbour/ai/commit/00b1e7862c182b644ee9f97beeda7fbdcceda8ca))

### Documentation

* document release note commit types ([08f9afd](https://github.com/davidsneighbour/ai/commit/08f9afd07f9d644d26c364610a025e244c0fb449))

### Build

* **fix:** change order of items in CHANGELOG.md (maybe) ([66197f5](https://github.com/davidsneighbour/ai/commit/66197f508f39052701d8778472050d227dccca50))

## [0.5.0](https://github.com/davidsneighbour/ai/compare/v0.4.0...v0.5.0) (2026-06-28)

### Build

* **deps-dev:** bump release-it from 20.0.1 to 20.2.0 ([#2](https://github.com/davidsneighbour/ai/issues/2)) ([c7d3f13](https://github.com/davidsneighbour/ai/commit/c7d3f13efef9ed22e611b3dbc6f1d1ea1ebfe1ba))
* **deps:** add @dnbhq/markdownlint-config, move remark to devDeps, restore pre-push hook ([30965ef](https://github.com/davidsneighbour/ai/commit/30965eff5f3904666400614c556eeea95932bf21))
* **deps:** update dependencies ([61e5020](https://github.com/davidsneighbour/ai/commit/61e50201768a364b5d884de1d076711d9f583e62))
* **deps:** update dependencies ([9296ce5](https://github.com/davidsneighbour/ai/commit/9296ce5911c9b8e6aba151e91bdcd6e81f7a9f17))
* **vscode:** update workspace configuration ([bfe59d0](https://github.com/davidsneighbour/ai/commit/bfe59d02041bd59ea26cfc604abf9c9fe7207b72))
* **vscode:** update workspace configuration ([2d52aa2](https://github.com/davidsneighbour/ai/commit/2d52aa2b26089ac7e45761c1afe69524a6139b39))

### Linting and Maintenance

* add dnb.toml flags configuration ([8e60c72](https://github.com/davidsneighbour/ai/commit/8e60c720bfd604d8bfb5eab095e953acf282c8fd))
* **fix:** update dependabot cooldown configuration ([3c2f9c5](https://github.com/davidsneighbour/ai/commit/3c2f9c5f94d0f3d3ca10f69804e6b81d17201cee))

### Chores

* gitignore .claude/ directory ([b23ed7b](https://github.com/davidsneighbour/ai/commit/b23ed7bdeb1e10e831435634f5a57a4ba7f0eae1))
* **project:** update project plan ([eb057ee](https://github.com/davidsneighbour/ai/commit/eb057ee76fafe46bb32b70ebb85df51ad88a4d6f)), closes [#9](https://github.com/davidsneighbour/ai/issues/9) [#10](https://github.com/davidsneighbour/ai/issues/10) [#5](https://github.com/davidsneighbour/ai/issues/5) [#6](https://github.com/davidsneighbour/ai/issues/6) [#7](https://github.com/davidsneighbour/ai/issues/7)
* **project:** update project plan ([70267ab](https://github.com/davidsneighbour/ai/commit/70267ab849c72ea81dc01ee0f41b69c4134d731a)), closes [#11](https://github.com/davidsneighbour/ai/issues/11) [#12](https://github.com/davidsneighbour/ai/issues/12) [#13](https://github.com/davidsneighbour/ai/issues/13) [#14](https://github.com/davidsneighbour/ai/issues/14) [#15](https://github.com/davidsneighbour/ai/issues/15) [#9](https://github.com/davidsneighbour/ai/issues/9) [#10](https://github.com/davidsneighbour/ai/issues/10)
* **project:** update project plan ([ea129c4](https://github.com/davidsneighbour/ai/commit/ea129c4767678dcf0c6eb76c1e033e2d6811035e)), closes [#7](https://github.com/davidsneighbour/ai/issues/7) [#7](https://github.com/davidsneighbour/ai/issues/7)
* **project:** update project plan ([3db3e77](https://github.com/davidsneighbour/ai/commit/3db3e771095117b7a742480ff39e7434ec85c971)), closes [#8](https://github.com/davidsneighbour/ai/issues/8) [#8](https://github.com/davidsneighbour/ai/issues/8)
* **skills:** move installable skills to root ([2f24d58](https://github.com/davidsneighbour/ai/commit/2f24d5807a8c43d431ba47660be2320b840f84ca))
* **vscode:** update editor config and extension recommendations ([22882c4](https://github.com/davidsneighbour/ai/commit/22882c4fe34d0372d3264b9fb163d51d375bddaa))

### Documentation

* **ai:** promote ExecPlans/PLANS from scratch to ai/docs and instructions ([af14512](https://github.com/davidsneighbour/ai/commit/af145129d1a42bc1834b66e119f20556ea18035e))
* **content:** add YouTube embed authoring guide for kollitsch.dev ([031094f](https://github.com/davidsneighbour/ai/commit/031094f36e9526b3aaee583b4325d9e33502b1dd))
* **readme:** add dnb-* skill sections ([ec766aa](https://github.com/davidsneighbour/ai/commit/ec766aaaaa81cc49512191a1f5997adb0b1decd6))
* **readme:** condense CLI section to inline bullet list ([cfc65dd](https://github.com/davidsneighbour/ai/commit/cfc65dd7068fd830e021881e5fc1ca97a52532fa))

### Features

* add references frontmatter schema ([fb08cd3](https://github.com/davidsneighbour/ai/commit/fb08cd37f70fed5068185e03bd9d5b2e7ba9ff65))
* **claude:** add CLAUDE.md, location shorthand system, and fix registry ([c26975a](https://github.com/davidsneighbour/ai/commit/c26975ab8fc4ada675f05cd27560ed8cc336907c))
* **prompts:** add onboarding, creation and optimization prompts for dnbhq config packages ([3f22342](https://github.com/davidsneighbour/ai/commit/3f223429de13dcd04fe079f1a9261a23f8fd7f46))
* **prompts:** add scratch-cleanup prompt and gitignore scratch/ ([b595221](https://github.com/davidsneighbour/ai/commit/b595221c8cb65ea253c04eafbf33a618297c5ad7))
* **scripts:** add postinstall symlink script for ~/.ai ([d097226](https://github.com/davidsneighbour/ai/commit/d097226580e1e8e89d611ac51680b42cb2ef1746))
* **skills:** add dependency maintenance workflow ([a22d5ad](https://github.com/davidsneighbour/ai/commit/a22d5ad636fc842c461449dc06f24a6c0ec5c7b6))
* **skills:** promote 10 polished skills from scratch (Task 15) ([07e6173](https://github.com/davidsneighbour/ai/commit/07e61736b065d5e51c76a49fec1601793d1c3d15))
* **skills:** promote Obsidian skills cluster from scratch (Task 16) ([b71ec7e](https://github.com/davidsneighbour/ai/commit/b71ec7ec0e22a2654bf14fc46bd0cc23fb5ce198))
* **skills:** promote three standalone skills from scratch ([cc33f69](https://github.com/davidsneighbour/ai/commit/cc33f695608f0526088a5ca3294457f85e00c7a6))
* **skills:** split Mastodon posting workflows ([cd85436](https://github.com/davidsneighbour/ai/commit/cd8543658e7429f578e74ad49e4391e120990601))

### Bug Fixes

* **docs:** move kollitsch.dev YouTube embed guide to correct location ([2247a5d](https://github.com/davidsneighbour/ai/commit/2247a5d87377089b6570245b695f3de7186e472b))
* **docs:** remove misplaced kollitsch.dev-specific instruction ([ba9cbbb](https://github.com/davidsneighbour/ai/commit/ba9cbbb5c52dbe0796bdbb2bdb0433a3c64ad61f))
* **registry:** skip ancillary files inside skill dirs during validation ([e06f6cb](https://github.com/davidsneighbour/ai/commit/e06f6cb4f425d008c9e5128be8ece0ee8ea1f513))

## [0.4.0](https://github.com/davidsneighbour/ai/compare/v0.3.0...v0.4.0) (2026-06-07)

### Instructions

* add DESIGN.md system ([98d01a6](https://github.com/davidsneighbour/ai/commit/98d01a6f131438138858bb51cb9e5be0d2c6254a))
* tailwind css plus elements ([58cca07](https://github.com/davidsneighbour/ai/commit/58cca07e3044f4afe866537885bcbaf194751f00))

## [0.3.0](https://github.com/davidsneighbour/ai/compare/v0.2.6...v0.3.0) (2026-06-07)

### Prompts

* add raindrop.io tag evaluation prompt ([e6798e1](https://github.com/davidsneighbour/ai/commit/e6798e1b1ed715d249d493865dc6427144388131))

## [0.2.6](https://github.com/davidsneighbour/ai/compare/v0.2.5...v0.2.6) (2026-06-07)

### Prompts

* **fix:** update rewrite-agents ([467815e](https://github.com/davidsneighbour/ai/commit/467815ee7deb3e346c95b16bfcfe0e59a73cd868))

## [0.2.5](https://github.com/davidsneighbour/ai/compare/v0.2.4...v0.2.5) (2026-06-07)

### Build

* **fix:** property names in tsconfig ([a978e17](https://github.com/davidsneighbour/ai/commit/a978e17a23ba0d98c17f58af7372413df0ab9958))
* **fix:** update release-it configuration ([3189faf](https://github.com/davidsneighbour/ai/commit/3189faf0b8d814e82ba4aebf6d2e6faa8024db19))
* **vscode:** update workspace configuration ([96770e2](https://github.com/davidsneighbour/ai/commit/96770e2a849a88db7610db732be0607d44ae3aac))

## [0.2.4](https://github.com/davidsneighbour/ai/compare/v0.2.3...v0.2.4) (2026-06-07)

### Documentation

* **ai:** add typescript programing rules and extension system ([58b219d](https://github.com/davidsneighbour/ai/commit/58b219d90f5ffb05ba865abc7a9a970a757d9cf6))

## [0.2.3](https://github.com/davidsneighbour/ai/compare/v0.2.2...v0.2.3) (2026-05-20)

### Build

* **fix:** release web config (not working as expected) and add comments config for GH release ([a2004b3](https://github.com/davidsneighbour/ai/commit/a2004b3212b22c8f8ab577cf53aab04194965633))

## [0.2.2](https://github.com/davidsneighbour/ai/compare/v0.2.1...v0.2.2) (2026-05-20)

### Build

* **fix:** open browser after release creation ([694231b](https://github.com/davidsneighbour/ai/commit/694231b854bfc95cfb9584bd27313ae5e0cf0b97))

## [0.2.1](https://github.com/davidsneighbour/ai/compare/v0.2.0...v0.2.1) (2026-05-20)

### Build

* **deps:** update dependencies ([dd9d7a3](https://github.com/davidsneighbour/ai/commit/dd9d7a3940bfc6abae2896f0e2354f3849a60bc8))

## [0.2.0](https://github.com/davidsneighbour/ai/compare/v0.1.0...v0.2.0) (2026-05-18)

### Features

* add clean notes draft to output of signal extraction framework ([00906cd](https://github.com/davidsneighbour/ai/commit/00906cd7f38dac6c2359cbc5c6edf972094b16fb))
* add clean notes draft to output of signal extraction framework ([c80e5b2](https://github.com/davidsneighbour/ai/commit/c80e5b2d08a8ab79cc25b5789cfe072cdfc676bd))
* add documentation and setup preparation for README.md ([ec120f5](https://github.com/davidsneighbour/ai/commit/ec120f54ee9b483c3992452e291a4ad5849c248c))
* adding AGENTS.md ([e4e7031](https://github.com/davidsneighbour/ai/commit/e4e7031825849c2556c7c381ce26074d6be038ee))

### Bug Fixes

* merge build-documentation and setup into ai script ([2733468](https://github.com/davidsneighbour/ai/commit/2733468a88e7ddb607dc1444fa9c3ed3052f3c66))

### Build

* **deps:** update dependencies ([2384aa9](https://github.com/davidsneighbour/ai/commit/2384aa98b3e0a52a5ffc0a2200981b0acfc57497))
* fix typo in filename ([a3b7b38](https://github.com/davidsneighbour/ai/commit/a3b7b3892d17ca9d315b7d52cf960ad9404583e1))

### Chores

* smaller fixes and refactoring ([51cfa06](https://github.com/davidsneighbour/ai/commit/51cfa0639875e6fc121981126944fc3058e70a9a))

### CI

* **biome:** disable default useLiteralKeys ([82af61f](https://github.com/davidsneighbour/ai/commit/82af61f76937f031d48aebe24e3a00f9fa7cafe1))
* **fix:** update renovate to use dnbhq config ([e991fbe](https://github.com/davidsneighbour/ai/commit/e991fbe92f5f60480accd183ec14a01c0ddc3ada))
* merge validation of skills into ai.ts ([7aaffdc](https://github.com/davidsneighbour/ai/commit/7aaffdcc10d9553460e73d73f3dd98d935a04e5b))
* set up secretlint, update lint-staged ([745ca91](https://github.com/davidsneighbour/ai/commit/745ca917b1c3c6e26befbd4904cd34808735634d))

## [0.1.0](https://github.com/davidsneighbour/ai/compare/v0.0.6...v0.1.0) (2026-05-06)

### Skills

* fix frontmatter to conform to linting and standards ([52d89f0](https://github.com/davidsneighbour/ai/commit/52d89f0f68e50ff42169817768201f30665c466c))

### Prompts

* add tasks for signal extraction framework and rewrite human text ([bd64403](https://github.com/davidsneighbour/ai/commit/bd644038beb80a09facafeaa7d6e86cbacedb931))
* some restructuring of prompts ([d6e7c86](https://github.com/davidsneighbour/ai/commit/d6e7c86f6c89c372da61a92f35be387861f060da))

### Features

* add instruction schema and document prompt schema ([172a3d2](https://github.com/davidsneighbour/ai/commit/172a3d22479d5082063376b3905062f8486306f3))

### Bug Fixes

* add instructions schema to ai.ts ([33be22f](https://github.com/davidsneighbour/ai/commit/33be22f35642de6f9b9a365377fc8c9ce77aa670))
* linting and configuration updates ([684358e](https://github.com/davidsneighbour/ai/commit/684358e0996effdf5aaf404ea768800ee975c31d))

### Build

* add .nvmrc ([ecfc017](https://github.com/davidsneighbour/ai/commit/ecfc01725f382f1911abf0cb0abee0875621f345))
* **deps:** add biome and biome configuration ([a0c159d](https://github.com/davidsneighbour/ai/commit/a0c159d138fe13a41789df449b8d49d7bff78019))
* **deps:** update dependencies and fix lockfile-lint ([6816cd1](https://github.com/davidsneighbour/ai/commit/6816cd154bb94ae33ab2c184500291722d724c3c))
* **vscode:** set up formatting for markdown documents ([021d590](https://github.com/davidsneighbour/ai/commit/021d59097ff7a1ab0f7e4d64ee7109ccbe2132f8))
* **vscode:** update workspace configuration ([a6cb312](https://github.com/davidsneighbour/ai/commit/a6cb3124a114c3b35af10112e7394fde3f2ad092))

### CI

* **fix:** cleanup scripts and release-it config ([1cb2aa5](https://github.com/davidsneighbour/ai/commit/1cb2aa5c7d3436078ab5f2f2d4a4f2bbc3170c47))

### Documentation

* **fix:** ai image after ai image re-touch ([d205132](https://github.com/davidsneighbour/ai/commit/d205132d080f7e034dd751d9041847ae8c2fd46d))
* lint and restructure documentation ([4838a9d](https://github.com/davidsneighbour/ai/commit/4838a9db58283723225a2ad9e8f08ac6eb8c2e95))

## [0.0.6](https://github.com/davidsneighbour/ai/compare/v0.0.5...v0.0.6) (2026-04-29)

### Build

* **deps:** bump smol-toml and markdownlint-cli2 ([#1](https://github.com/davidsneighbour/ai/issues/1)) ([36623b2](https://github.com/davidsneighbour/ai/commit/36623b21c1a1f0e6795ce7fd1e5fe90c9cc16006))
* **deps:** cleanup dependencies ([50a24bf](https://github.com/davidsneighbour/ai/commit/50a24bf124d27284aa1d6304afabaa4fab585710))

### Chores

* add linting and skills setup ([3326562](https://github.com/davidsneighbour/ai/commit/332656271f00e9a584389939f38ec0b441320dfa))

### Documentation

* update README.md ([26d9a97](https://github.com/davidsneighbour/ai/commit/26d9a97c11f259e5298810a6f3e124879474938d))

### Refactoring

* cleanup ([fd58210](https://github.com/davidsneighbour/ai/commit/fd58210ac9fef7b01e2a2586bc3768c968e8b4e7))

## [0.0.5](https://github.com/davidsneighbour/ai/compare/v0.0.4...v0.0.5) (2026-04-26)

### Build

* **deps:** update dependencies ([9182b3b](https://github.com/davidsneighbour/ai/commit/9182b3b206339ebae3de824282d4e80381d9216a))
* **fix:** update tsconfig.json ([fe7a5c7](https://github.com/davidsneighbour/ai/commit/fe7a5c79280c0c3f94258c39dde590871326b858))

### CI

* **fix:** update dependabot configuration ([9ba147e](https://github.com/davidsneighbour/ai/commit/9ba147e5ee90985928d8193e54387336484628bc))
* setup markdownlint and cspell dictionary ([f994c04](https://github.com/davidsneighbour/ai/commit/f994c042d6cd0a4638ac49cfed04ce1987d10aef))

## [0.0.4](https://github.com/davidsneighbour/ai/compare/v0.0.3...v0.0.4) (2026-04-26)

### Bug Fixes

* empty schema exports ([8b23409](https://github.com/davidsneighbour/ai/commit/8b234098a873e1de87194b2d0dd0ddddf80797cd))

### Build

* **release:** fix hash in commit object ([d770e38](https://github.com/davidsneighbour/ai/commit/d770e38e557c631c1f21d220f89ad801bdcc89f3))
* **release:** remove changes again ([1d60252](https://github.com/davidsneighbour/ai/commit/1d60252efe7d24134d63e4073dc514a13a1c84b7))

## [0.0.3](https://github.com/davidsneighbour/ai/compare/v0.0.2...v0.0.3) (2026-04-21)

### build

* **release:** add date and author to changelog line (2026-04-21 13:25:07 +0700) ([](https://github.com/davidsneighbour/ai/commit/523a571d5c553fa1e6018f91bbde036d5bc2d37b))
* **release:** fix commit lines in changelog (2026-04-21 13:32:10 +0700) ([](https://github.com/davidsneighbour/ai/commit/9492b04f5e44a792aed2e1719043f41823631921))

## [0.0.2](https://github.com/davidsneighbour/ai/compare/v0.0.1...v0.0.2) (2026-04-21)

### build

* **release:** add date and author to changelog line (2026-04-21) ([](https://github.com/davidsneighbour/ai/commit/d25a9c48573bddb5062079c700b59de3ae7c4fc4))

## 0.0.1 (2026-04-21)

### Bug Fixes

* add front matter to ai files ([a64b525](https://github.com/davidsneighbour/kollitsch.dev/commit/a64b52582d92aa977150125650861bf21d6b64e4))
* proper typing for scripts ([46d16f6](https://github.com/davidsneighbour/kollitsch.dev/commit/46d16f6a3e098e23d5af489d05cc1a8264222a1e))

### Build

* add release script to config ([93c2fa2](https://github.com/davidsneighbour/kollitsch.dev/commit/93c2fa229935269e7e281526cfae2b5593e7c4c2))

### Chores

* initial commit, skeleton ([bb86148](https://github.com/davidsneighbour/kollitsch.dev/commit/bb86148681d16dd5be6894d21af2e9138652e222))
