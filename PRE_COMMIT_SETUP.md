# Pre-Commit Hook Setup Documentation

This project has been configured with comprehensive pre-commit hooks to ensure code quality, consistency, and conventional commit standards.

## Features

### 🔧 ESLint Rules

- **Auto-fix**: Automatically fixes linting issues when possible
- **TypeScript Support**: Full TypeScript ESLint rules with proper parsing
- **NestJS Optimized**: Rules configured for NestJS applications
- **Code Quality**: Enforces complexity limits, proper imports, and best practices

### 🎨 Prettier Formatting

- **Auto-format**: Automatically formats code on commit
- **Consistent Style**: Enforces consistent code style across the project
- **Multi-language**: Supports TypeScript, JavaScript, JSON, Markdown, YAML

### 📝 Conventional Commits

- **Commit Message Validation**: Enforces conventional commit message format
- **Types Supported**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

### ⚡ Performance Optimized

- **Lint Staged Files Only**: Only processes files being committed
- **Caching**: ESLint uses caching to improve performance
- **Selective Linting**: Excludes dist, test files, and other non-essential files

## Configuration Files

### ESLint Configuration (`eslint.config.js`)

```javascript
- Extends recommended TypeScript ESLint rules
- Prettier integration to avoid conflicts
- Custom rules for NestJS projects
- Ignores dist/, node_modules/, test files
```

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Commitlint Configuration (`commitlint.config.js`)

```javascript
- Extends @commitlint/config-conventional
- Custom type rules for project needs
- Subject length and format validation
```

### Lint-Staged Configuration (`.lintstagedrc.json`)

```json
{
  "*.{ts,js}": ["eslint --fix --cache", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## Git Hooks

### Pre-commit Hook (`.husky/pre-commit`)

- Runs lint-staged on staged files
- Auto-fixes ESLint issues
- Formats code with Prettier
- Only processes files being committed

### Commit-msg Hook (`.husky/commit-msg`)

- Validates commit message format
- Enforces conventional commit standards
- Provides helpful error messages for invalid formats

## Available Scripts

### Linting

```bash
# Run ESLint with auto-fix on all source files
pnpm run lint

# Check for linting issues without fixing
pnpm run lint:check

# Format all files with Prettier
pnpm run format

# Check formatting without fixing
pnpm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler check
pnpm run tsc:check
```

## Commit Message Format

Use the conventional commit format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Examples

**✅ Good:**

```
feat: add user authentication
fix(auth): resolve token validation issue
docs: update API documentation
style: format user service
refactor: simplify database connection logic
test: add unit tests for user controller
```

**❌ Bad:**

```
Added new feature
fix bug
Update docs
random commit message
```

### Valid Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

## Troubleshooting

### Pre-commit hook fails

1. **ESLint issues**: Fix the reported issues manually or run `pnpm run lint` to auto-fix
2. **Type errors**: Run `pnpm run tsc:check` to see TypeScript errors
3. **Formatting issues**: Run `pnpm run format` to fix formatting

### Commit message rejected

1. **Invalid format**: Follow the conventional commit format
2. **Invalid type**: Use one of the approved types listed above
3. **Subject too long**: Keep the subject under 100 characters

### Performance issues

- The hooks are optimized to only process staged files
- ESLint uses caching to improve performance
- If issues persist, check if you're committing too many files at once

### Bypassing hooks (emergency only)

```bash
# Skip pre-commit hook (not recommended)
git commit --no-verify

# Skip commit-msg hook (not recommended)
git commit --no-verify
```

## Installation for New Developers

1. Install dependencies:

```bash
pnpm install
```

2. Set up git hooks:

```bash
pnpm run prepare
```

3. Verify setup:

```bash
# Test linting
pnpm run lint:check

# Test formatting
pnpm run format:check

# Test commit message validation
echo "feat: test message" | npx commitlint
```

## Maintenance

### Updating ESLint rules

- Modify `eslint.config.js`
- Test with `pnpm run lint:check`
- Update documentation if needed

### Updating Prettier configuration

- Modify `.prettierrc`
- Run `pnpm run format` to reformat existing code
- Update `.prettierignore` if needed

### Updating commit message rules

- Modify `commitlint.config.js`
- Test with sample messages using `npx commitlint`

---

For questions or issues with the pre-commit setup, please refer to this documentation or contact the development team.
