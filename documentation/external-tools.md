# External AI tools

This file lists external tools that are useful alongside this repository. Keep entries short and link to the upstream project for details.

## Understand Anything

[Understand Anything](https://github.com/Egonex-AI/Understand-Anything) is a codebase understanding tool that helps explore repository structure and generate project context.

Install as a Claude Code plugin:

```bash
/plugin marketplace add Egonex-AI/Understand-Anything
/plugin install understand-anything
```

Install for Codex and other supported CLIs:

```bash
curl -fsSL https://raw.githubusercontent.com/Egonex-AI/Understand-Anything/main/install.sh | bash -s codex
```

Usage notes:

- run it from the repository you want to inspect
- use it to build orientation before large refactors or documentation work
- prefer the official README for current commands and editor-specific setup

Documentation: [Understand Anything on GitHub](https://github.com/Egonex-AI/Understand-Anything)
