# BurnTrack Cursor Rules and Coding Standards

## Tech Stack

- **Frontend Framework**: React 19.0.0 with TypeScript 4.9.5
- **UI Library**: Material-UI 6.4.6
- **State Management**: React Context API
- **Data Persistence**: localStorage
- **Date Handling**: date-fns 2.30.0
- **Charts**: Chart.js 4.4.8 with react-chartjs-2 5.3.0
- **PWA Support**: Workbox (workbox-core, workbox-precaching, workbox-routing, workbox-strategies)
- **Build Tool**: Create React App (react-scripts 5.0.1)

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define explicit types for all props, state, and function parameters
- Avoid using `any` type
- Use interfaces for object types
- Use type aliases for union types
- Use enums for fixed sets of values

### Component Structure

- Use functional components with hooks
- Use the `.tsx` extension for all React component files
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use the following folder structure:
  - `src/components/` - Reusable UI components
  - `src/pages/` - Page-level components
  - `src/context/` - Context providers
  - `src/utils/` - Utility functions
  - `src/types/` - TypeScript type definitions

### Styling

- Use Material-UI's styling system (sx prop, styled components)
- Follow Material Design guidelines
- Use theme variables for colors, spacing, and typography
- Ensure responsive design for all components
- Maintain accessibility standards (WCAG 2.1)

### State Management

- Use the Context API for global state
- Use local state (useState) for component-specific state
- Keep state normalized and avoid duplication
- Use reducers for complex state logic

### Data Persistence

- Use localStorage for client-side persistence
- Follow the storage key pattern: `burntrack_keyName`
- Handle storage errors gracefully
- Implement data versioning for future migrations

### PWA Standards

- Ensure offline functionality works correctly
- Optimize assets for performance
- Use appropriate caching strategies
- Test installation flow on multiple devices
- Ensure manifest.json is properly configured

## Git Workflow

- Use descriptive commit messages
- Create feature branches for new features
- Use pull requests for code reviews
- Keep commits focused and atomic
- Follow conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for adding tests
  - `chore:` for maintenance tasks

## Code Quality

- Run ESLint before committing code
- Fix all warnings and errors
- Write unit tests for critical functionality
- Maintain code coverage above 70%
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Performance Guidelines

- Optimize bundle size
- Lazy load components when appropriate
- Memoize expensive calculations
- Use React.memo for pure components
- Avoid unnecessary re-renders
- Optimize images and assets

## Documentation Maintenance

- Update documentation when making significant changes to the codebase
- Keep the README.md file current with the latest features and instructions
- Update the architecture diagrams in architecture.md when:
  - Adding new components or pages
  - Changing data flow patterns
  - Modifying type hierarchies
  - Altering PWA functionality
- Ensure code comments are kept in sync with implementation
- Document all public APIs and interfaces
- Include examples for complex functionality
- Add JSDoc comments for all functions and components
- Document known limitations and edge cases 