# Common Guidelines
**Common Principles:**
  # AI Agentic Programming Guidelines

## SOLID Principles
- **S** - Single Responsibility: One reason to change
- **O** - Open/Closed: Open for extension, closed for modification
- **L** - Liskov Substitution: Subclasses replace superclasses seamlessly
- **I** - Interface Segregation: No unused interface dependencies
- **D** - Dependency Inversion: Depend on abstractions, not concretions

## Clean Code
- **Naming**: Intention-revealing, searchable names
- **Functions**: Small (<20 lines), single purpose, 0-3 parameters
- **Comments**: Explain "why", not "what"
- **Error Handling**: Language-appropriate patterns, fail fast

## AI-Specific
- **Modularity**: Small testable components, clear interfaces
- **State**: Minimize mutation, use immutable structures
- **Resilience**: Circuit breakers, exponential backoff
- **Testing**: Pure functions first, mock dependencies

## Test Driven Development
- **Red-Green-Refactor**: Write failing test, make it pass, improve code
- **Test First**: Write tests before implementation code
- **Small Steps**: Incremental development with immediate feedback
- **Design Driver**: Tests guide API design and code structure
- **Regression Safety**: Comprehensive test suite prevents breaking changes
- **Documentation**: Tests serve as living documentation of expected behavior

## Organization
- **Structure**: Group related code, separate concerns
- **Dependencies**: Minimize externals, use injection
- **Documentation**: Document APIs, maintain ADRs

 ## Domain Driven Design
- **Ubiquitous Language**: Use consistent domain vocabulary across code and communication
- **Bounded Contexts**: Define clear boundaries around related models and business logic
- **Entities**: Objects with identity that persist over time
- **Value Objects**: Immutable objects defined by their attributes
- **Aggregates**: Consistency boundaries grouping related entities and value objects
- **Repositories**: Abstract data access patterns for aggregates
- **Domain Services**: Stateless operations that don't naturally fit in entities or value objects

**Process Documentation**
- Document deployment procedures
- Maintain runbooks for operational tasks
- Document known limitations and workarounds
- Keep security considerations documented

## Performance and Scalability

**Efficiency Guidelines**
- Profile before optimizing
- Use appropriate data structures for the use case
- Implement caching strategically
- Monitor resource usage patterns

**Scalability Considerations**
- Design for horizontal scaling
- Avoid tight coupling between components
- Use asynchronous processing where appropriate
- Implement proper connection pooling

## Security Best Practices

**Input Validation**
- Validate all inputs at system boundaries
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Sanitize outputs to prevent injection attacks

**Data Protection**
- Encrypt sensitive data at rest and in transit
- Use secure random number generation
- Implement proper session management
- Follow principle of least privilege

## Version Control and Collaboration

**Git Practices**
- Use conventional commits for consistent messaging
- Keep commits small and focused on single changes
- Consider trunk-based development for faster delivery
- Use semantic versioning for releases
- Implement proper branching strategies (GitFlow, GitHub Flow)

**Code Review Guidelines**
- Review for logic, security, performance, and maintainability
- Check for adherence to coding standards and best practices
- Verify comprehensive test coverage for new features
- Ensure documentation and README updates
- Use automated tools for code quality checks

## Monitoring and Observability

**Logging Standards**
- Use structured logging with consistent formats
- Include correlation IDs for tracing
- Log at appropriate levels (DEBUG, INFO, WARN, ERROR)
- Avoid logging sensitive information

**Metrics and Monitoring**
- Monitor key business and technical metrics
- Set up alerts for critical failures
- Track performance trends over time
- Implement health checks for all services

## Modern Development Practices

**Container and Cloud Native**
- Use containerization (Docker) for consistent environments
- Implement proper health checks and graceful shutdowns
- Follow 12-factor app principles
- Use Infrastructure as Code (IaC) for deployments

**Performance and Observability**
- Monitor Core Web Vitals and performance metrics
- Implement distributed tracing for microservices
- Use structured logging with correlation IDs
- Set up proper alerting and monitoring dashboards

**Security by Design**
- Implement zero-trust security principles
- Use secrets management systems
- Regular security audits and dependency updates
- Follow OWASP guidelines for web applications

**Accessibility and Inclusive Design**
- Follow WCAG 2.1/2.2 accessibility guidelines
- Implement proper semantic HTML and ARIA labels
- Test with screen readers and keyboard navigation
- Ensure color contrast and responsive design

## AI Agent Specific Considerations

**Context Management**
- Maintain clear context boundaries between operations
- Implement proper session management for multi-turn interactions
- Use structured data formats for inter-agent communication
- Cache frequently accessed context efficiently

**Decision Making**
- Implement clear decision trees for complex logic
- Use configuration-driven behavior where possible
- Log decision rationale for debugging and auditing
- Implement fallback strategies for uncertain situations

**Integration Patterns**
- Use standardized APIs for tool integration
- Implement proper timeout and retry mechanisms
- Design for async/await patterns where appropriate
- Handle partial failures gracefully

These guidelines provide a foundation for building robust, maintainable, and scalable systems while following industry best practices adapted for modern development workflows.
    

# TypeScript
## Core Concepts TypeScript
- **`interface` vs. `type`**: Prefer `interface` for defining the shape of objects or classes that can be implemented or extended. Use `type` for unions, intersections, or more complex type compositions.
- **Utility Types**: Leverage built-in utility types like `Partial`, `Pick`, `Omit`, and `ReturnType` to manipulate types without creating new ones.
- **`unknown` vs. `any`**: Prefer `unknown` over `any` for values with an unknown type, as it forces type checking before use.
- **Generics**: Use generics to create reusable components that can work with a variety of types.

## Modern Features
- **`satisfies` Operator**: Use to validate that an expression matches a type without changing its underlying type, preserving type inference.
- **`as const`**: Use for creating truly immutable values and inferring the narrowest possible type.
- **Enums**: Use for defining a set of named constants, especially string enums for better readability.
- **Optional Chaining (`?.`) and Nullish Coalescing (`??`)**: Use for safer access to nested properties and providing default values.

## Best Practices
- **`tsconfig.json`**: Enable `strict: true` to catch a wide range of potential errors at compile time.
- **Module Paths**: Use path aliases (`paths` in `tsconfig.json`) for cleaner, non-relative imports.

# React
## Core Concepts React
- **Functional Components and Hooks**: Write components as functions and manage state and side effects with Hooks like `useState` and `useEffect`.
- **Unidirectional Data Flow**: Data flows down from parent to child components via props.
- **Keys**: Provide stable and unique keys for elements in lists to help React identify which items have changed, are added, or are removed.
- **State Management**: For simple state, use `useState`. For complex state, use `useReducer` or a library like Redux or Zustand.
- **Context API**: Use for passing data through the component tree without having to pass props down manually at every level, but avoid overuse for performance reasons.

## Best Practices
- **Memoization**: Use `useMemo` for memoizing expensive calculations and `useCallback` for memoizing functions to prevent unnecessary re-renders. Use `React.memo` for components.
- **Custom Hooks**: Extract component logic into reusable custom Hooks.
- **Conditional Rendering**: Keep JSX clean by returning early or using ternary operators or logical AND (`&&`) for simple conditional rendering.
- **Lifting State Up**: Share state between components by moving it up to their closest common ancestor.
- **Composition**: Build complex components by composing simpler, reusable ones.