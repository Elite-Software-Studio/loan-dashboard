# Code Quality Standards

This document outlines the code quality standards and best practices for the Loan Admin project.

## Code Formatting

- **Prettier**: Used for consistent code formatting
  - Run `npm run format` to format all files
  - Run `npm run format:check` to check formatting without making changes

## Linting

- **ESLint**: Used for code quality and style enforcement
  - Run `npm run lint` to check for linting errors
  - Run `npm run lint:fix` to automatically fix linting issues

## TypeScript

- **Strict Mode**: Enabled for maximum type safety
- **Type Checking**: Run `npm run typecheck` to verify TypeScript compilation

## Testing

- **Vitest**: Testing framework
  - Run `npm run test` to run tests
  - Run `npm run test:ui` for interactive UI
  - Run `npm run test:coverage` for coverage report

## Code Organization

### File Structure

```
app/
├── lib/              # Core utilities and configurations
│   ├── constants.ts  # Application constants
│   ├── errors.ts     # Custom error classes
│   ├── logger.ts     # Logging utility
│   ├── utils.ts      # Utility functions
│   └── __tests__/    # Unit tests
├── components/       # React components
├── routes/          # Route components
└── api/             # API routes
```

### Naming Conventions

- **Files**: Use kebab-case for file names (e.g., `user-profile.tsx`)
- **Components**: Use PascalCase (e.g., `UserProfile`)
- **Functions**: Use camelCase (e.g., `getUserById`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Types/Interfaces**: Use PascalCase (e.g., `UserData`)

### Code Comments

- Use JSDoc comments for public functions and types
- Inline comments should explain "why", not "what"
- Keep comments up-to-date with code changes

### Error Handling

- Use custom error classes from `app/lib/errors.ts`
- Always log errors using the logger utility
- Provide meaningful error messages to users
- Handle errors gracefully at the appropriate level

### Logging

- Use the logger utility from `app/lib/logger.ts`
- Log at appropriate levels (debug, info, warn, error)
- Include relevant context in log messages
- Never log sensitive information (passwords, tokens, etc.)

## Best Practices

### Type Safety

- Avoid using `any` type
- Use TypeScript strict mode
- Define proper types for all data structures
- Use type guards when necessary

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize database queries (use select, include wisely)
- Use debouncing for search inputs

### Security

- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries (Prisma handles this)
- Implement proper authentication and authorization
- Sanitize user-generated content

### Testing

- Write tests for utility functions
- Test error cases, not just happy paths
- Keep test coverage above 70%
- Write integration tests for critical flows

## Pre-commit Checklist

Before committing code:

- [ ] Code passes linting (`npm run lint`)
- [ ] Code is properly formatted (`npm run format:check`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] All tests pass (`npm run test`)
- [ ] No console.log statements (use logger instead)
- [ ] Error handling is implemented
- [ ] JSDoc comments added for new functions
- [ ] No hardcoded values (use constants)

## Continuous Integration

The CI pipeline should:

1. Run linting
2. Check formatting
3. Run type checking
4. Run tests
5. Generate coverage report

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Best Practices](https://react.dev/learn)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
