import type { AdaptiveQuiz, QuizQuestion } from "@/lib/quiz";
import type { LearningRoadmap, RoadmapModule } from "@/lib/roadmap";
import type { TutorRequest, TutorResponse } from "@/lib/tutor";

type TopicProfile = {
  foundation: string;
  core: string;
  practice: string;
  application: string;
  project: string;
  concepts: [string, string, string, string];
};

type LanguageProfile = { name: string; file: string; run: string; declaration: string; collection: string; errorHandling: string; backend?: boolean };

function languageProfileFor(topic: string): LanguageProfile | null {
  const value = topic.toLowerCase();
  if (/node\.js|nodejs|backend javascript/.test(value)) return { name: "Node.js", file: "server.js", run: "node server.js", declaration: "const port = 3000", collection: "Array or Map", errorHandling: "try/catch and error middleware", backend: true };
  if (/\bpython\b/.test(value)) return { name: "Python", file: "main.py", run: "python main.py", declaration: "name = \"Ada\"", collection: "list or dict", errorHandling: "try/except" };
  if (/\btypescript\b/.test(value)) return { name: "TypeScript", file: "main.ts", run: "npx tsx main.ts", declaration: "const name: string = \"Ada\"", collection: "Array or Map", errorHandling: "try/catch" };
  if (/\bjavascript\b|\bjs\b/.test(value)) return { name: "JavaScript", file: "main.js", run: "node main.js", declaration: "const name = \"Ada\"", collection: "Array or Map", errorHandling: "try/catch" };
  if (/\bc\+\+\b|\bcpp\b/.test(value)) return { name: "C++", file: "main.cpp", run: "g++ main.cpp -o app && ./app", declaration: "std::string name = \"Ada\";", collection: "std::vector or std::map", errorHandling: "exceptions or error-aware return values" };
  if (/\bc#\b|\bcsharp\b/.test(value)) return { name: "C#", file: "Program.cs", run: "dotnet run", declaration: "string name = \"Ada\";", collection: "List<T> or Dictionary<TKey, TValue>", errorHandling: "try/catch" };
  if (/\bgolang\b|\bgo language\b/.test(value)) return { name: "Go", file: "main.go", run: "go run main.go", declaration: "name := \"Ada\"", collection: "slice or map", errorHandling: "explicit error values" };
  if (/\bphp\b/.test(value)) return { name: "PHP", file: "index.php", run: "php -S localhost:8000", declaration: "$name = \"Ada\";", collection: "array", errorHandling: "exceptions and error handling", backend: true };
  if (/\bruby\b/.test(value)) return { name: "Ruby", file: "app.rb", run: "ruby app.rb", declaration: "name = \"Ada\"", collection: "Array or Hash", errorHandling: "begin/rescue", backend: true };
  if (/\bkotlin\b/.test(value)) return { name: "Kotlin", file: "Main.kt", run: "kotlinc Main.kt -include-runtime -d app.jar && java -jar app.jar", declaration: "val name = \"Ada\"", collection: "List or Map", errorHandling: "try/catch and nullable types", backend: true };
  if (/\bscala\b/.test(value)) return { name: "Scala", file: "Main.scala", run: "scala-cli run Main.scala", declaration: "val name = \"Ada\"", collection: "List or Map", errorHandling: "Try and Option", backend: true };
  if (/\brust\b/.test(value)) return { name: "Rust", file: "main.rs", run: "cargo run", declaration: "let name = \"Ada\";", collection: "Vec or HashMap", errorHandling: "Result and Option" };
  if (/\b(c language|ansi c)\b/.test(value)) return { name: "C", file: "main.c", run: "gcc main.c -o app && ./app", declaration: "char name[] = \"Ada\";", collection: "arrays and structs", errorHandling: "return codes" };
  return null;
}

function profileFor(topic: string): TopicProfile {
  const normalized = topic.toLowerCase();
  if (/python|programming|javascript|typescript|coding/.test(normalized)) return {
    foundation: "syntax, values, and control flow", core: "functions, data structures, and debugging", practice: "small programs and test cases", application: "organizing a maintainable feature", project: "a useful command-line or web project", concepts: ["variables and types", "functions", "data structures", "debugging"],
  };
  if (/data|excel|sql|analytics|statistics/.test(normalized)) return {
    foundation: "data types, tables, and questions", core: "cleaning, aggregation, and visual interpretation", practice: "filtering, joining, and summarizing a dataset", application: "turning analysis into a defensible recommendation", project: "an end-to-end analysis report", concepts: ["data quality", "aggregation", "relationships between tables", "visual interpretation"],
  };
  if (/design|ux|ui|figma/.test(normalized)) return {
    foundation: "users, problems, and design constraints", core: "hierarchy, flows, and interaction patterns", practice: "wireframes and usability observations", application: "iterating a flow from evidence", project: "a portfolio-ready case study", concepts: ["user needs", "information hierarchy", "user flows", "usability feedback"],
  };
  if (/marketing|seo|content|brand/.test(normalized)) return {
    foundation: "audience, value proposition, and goals", core: "positioning, channels, and measurement", practice: "writing and testing a focused campaign", application: "choosing tactics from performance data", project: "a measurable launch plan", concepts: ["target audience", "value proposition", "channel fit", "conversion metrics"],
  };
  return {
    foundation: "key terms, scope, and intended outcomes", core: "the principles, methods, and trade-offs", practice: "guided examples and deliberate practice", application: "solving a realistic problem", project: "a small capstone project", concepts: ["key terminology", "core principles", "common methods", "trade-offs"],
  };
}

export function createMockRoadmap(topic: string): LearningRoadmap {
  if (/\bjava\b/i.test(topic) && !/javascript/i.test(topic)) return createJavaRoadmap(topic);
  const language = languageProfileFor(topic);
  if (language) return createLanguageRoadmap(topic, language);
  const profile = profileFor(topic);
  return {
    topic,
    overview: `A topic-aware mock learning plan for ${topic}: build reliable foundations, practise deliberately, then apply the ideas in a focused project.`,
    modules: [
      {
        id: "foundations",
        title: `${topic}: foundations and vocabulary`,
        description: `Learn ${profile.foundation} so you can describe the problem ${topic} solves and follow beginner examples confidently.`,
        estimatedMinutes: 45,
        learningObjectives: [`Explain ${profile.concepts[0]}`, `Describe a basic ${topic} workflow`],
      },
      {
        id: "core-concepts",
        title: `${topic}: core concepts`,
        description: `Build mental models for ${profile.core}, so you can reason about new examples rather than memorising steps.`,
        estimatedMinutes: 60,
        learningObjectives: [`Distinguish ${profile.concepts[1]} from ${profile.concepts[2]}`, `Explain the trade-offs behind ${profile.concepts[3]}`],
      },
      {
        id: "guided-practice",
        title: `${topic}: guided practice`,
        description: `Use ${profile.practice} to turn the concepts into repeatable skills and identify mistakes early.`,
        estimatedMinutes: 75,
        learningObjectives: [`Apply ${profile.concepts[1]} to a simple scenario`, `Identify a common ${topic} mistake and correct it`],
      },
      {
        id: "real-world-application",
        title: `${topic}: real-world application`,
        description: `Practise ${profile.application} by making choices, explaining assumptions, and reviewing the result.`,
        estimatedMinutes: 90,
        learningObjectives: ["Break a realistic problem into manageable steps", `Justify a ${topic} approach using evidence`],
      },
      {
        id: "next-steps",
        title: `${topic}: capstone and next steps`,
        description: `Consolidate your learning through ${profile.project}, then use feedback to choose a focused next skill.`,
        estimatedMinutes: 30,
        learningObjectives: ["Assess your current understanding with evidence", `Plan a focused ${topic} next step`],
      },
    ],
  };
}

export function createMockQuiz(module: RoadmapModule, topic = "this topic"): AdaptiveQuiz {
  if (/\bjava\b/i.test(topic) && !/javascript/i.test(topic)) return createJavaQuiz(module);
  const language = languageProfileFor(topic);
  if (language) return createLanguageQuiz(module, language);
  const primaryObjective = module.learningObjectives[0] ?? "Explain the core concept";
  const secondaryObjective = module.learningObjectives[1] ?? "Apply the concept";

  return {
    moduleId: module.id,
    moduleTitle: module.title,
    questions: createTopicAwareQuestions(module, topic, primaryObjective, secondaryObjective),
  };
}

function createLanguageRoadmap(topic: string, language: LanguageProfile): LearningRoadmap {
  if (language.backend) return createBackendLanguageRoadmap(topic, language);
  return {
    topic,
    overview: `A practical ${language.name} path: set up the toolchain, write idiomatic code, model data, handle failures, and ship a small project.`,
    modules: [
      { id: "language-foundations", title: `${language.name}: setup, syntax, and values`, description: `Create ${language.file}, run it with ${language.run}, and work with variables, strings, numbers, booleans, and expressions.`, estimatedMinutes: 50, learningObjectives: [`Run a ${language.name} program locally`, `Use ${language.declaration} and explain its value`] },
      { id: "language-flow-functions", title: `${language.name}: flow control and functions`, description: "Use conditions, loops, and named functions to turn a problem into small, testable steps.", estimatedMinutes: 65, learningObjectives: ["Choose an appropriate conditional or loop", "Write a function with inputs and a useful result"] },
      { id: "language-data", title: `${language.name}: data structures and modular code`, description: `Organize related values with ${language.collection}, then split a growing program into understandable modules or types.`, estimatedMinutes: 75, learningObjectives: [`Choose an appropriate ${language.collection}`, "Keep related behavior close to its data"] },
      { id: "language-errors", title: `${language.name}: errors, debugging, and tests`, description: `Read errors, use ${language.errorHandling}, and write small tests or checks around expected and edge-case behavior.`, estimatedMinutes: 70, learningObjectives: ["Diagnose an error from its message and location", `Handle failure using ${language.errorHandling}`] },
      { id: "language-project", title: `${language.name}: build a small project`, description: "Build a focused program such as a CLI tracker, file utility, API client, or game; explain the design and test boundary cases.", estimatedMinutes: 100, learningObjectives: ["Break a feature into small functions or types", "Test valid, invalid, and boundary input"] },
    ],
  };
}

function createBackendLanguageRoadmap(topic: string, language: LanguageProfile): LearningRoadmap {
  return {
    topic,
    overview: `A backend-focused ${language.name} path: build HTTP APIs, store data safely, authenticate users, and deploy a reliable service.`,
    modules: [
      { id: "backend-foundations", title: `${language.name}: server fundamentals`, description: `Set up ${language.file}, run it with ${language.run}, and understand requests, responses, status codes, and JSON.`, estimatedMinutes: 55, learningObjectives: ["Explain the request-response lifecycle", "Return a JSON response with an appropriate status code"] },
      { id: "backend-routing", title: `${language.name}: routes and REST APIs`, description: "Create routes for resources, validate request input, and separate route handlers from business logic.", estimatedMinutes: 75, learningObjectives: ["Design clear GET, POST, PATCH, and DELETE routes", "Validate client input before processing it"] },
      { id: "backend-data", title: `${language.name}: databases and persistence`, description: "Model data, connect to a database, use parameterized queries or an ORM, and handle missing records safely.", estimatedMinutes: 85, learningObjectives: ["Model a resource and its identifiers", "Avoid unsafe database queries"] },
      { id: "backend-auth", title: `${language.name}: authentication and authorization`, description: "Protect routes, distinguish identity from permissions, and keep secrets out of source code.", estimatedMinutes: 80, learningObjectives: ["Authenticate a request before accessing private data", "Authorize actions based on ownership or role"] },
      { id: "backend-deploy", title: `${language.name}: testing, observability, and deployment`, description: "Test API behavior, log useful failures, configure environment variables, and deploy a small service safely.", estimatedMinutes: 95, learningObjectives: ["Test success, validation, and unauthorized API cases", "Configure production environment variables safely"] },
    ],
  };
}

function createLanguageQuiz(module: RoadmapModule, language: LanguageProfile): AdaptiveQuiz {
  if (language.backend) return createBackendLanguageQuiz(module, language);
  const common: Record<string, QuizQuestion[]> = {
    "language-foundations": [
      q("q1", `Which command runs ${language.file} in this learning setup?`, [language.run, "npm install", "git commit", "cd .."], 0, `Use ${language.run} to run this ${language.name} program.`),
      q("q2", `Which is a valid ${language.name} variable declaration from this roadmap?`, [language.declaration, "variable = name always", "declare variable without a value in every language", "use any syntax from Java"], 0, `The declaration is idiomatic ${language.name} syntax for storing a name.`),
      q("q3", "Why use a descriptive variable name?", ["It makes code communicate intent", "It makes every program faster", "It removes the need for tests", "It changes the data type"], 0, "Names are part of the program’s explanation to future readers."),
      q("q4", "What is a useful first check when a program will not run?", ["Read the exact error and its file/line", "Delete random code", "Rename every variable", "Ignore the terminal"], 0, "The error message and location are the fastest path to a specific diagnosis."),
    ],
    "language-flow-functions": [
      q("q1", "When should you use a conditional?", ["When the program must choose based on a condition", "Only when storing text", "Never inside a function", "Only for syntax highlighting"], 0, "Conditionals select behavior based on true/false conditions."),
      q("q2", "Why put repeated behavior in a function?", ["To give it a reusable name and test it separately", "To make all variables global", "To avoid inputs", "To eliminate every possible bug"], 0, "Functions reduce duplication and make one behavior easier to understand and test."),
      q("q3", "What should a function’s parameters represent?", ["The information the function needs from its caller", "Every variable in the program", "Only text values", "The file name only"], 0, "Parameters make a function’s dependencies explicit."),
      q("q4", "Which practice makes loops safer?", ["Make the stopping condition clear and test a small case", "Always use an infinite loop", "Change the collection while iterating without a plan", "Avoid checking results"], 0, "Clear bounds and small test cases prevent common loop errors."),
    ],
  };
  const questions = common[module.id] ?? [
    q("q1", `Which ${language.name} structure best fits a keyed lookup?`, [language.collection, "A comment", "A function name", "A compiler warning"], 0, `Use the appropriate ${language.collection} variant when data must be organized for the access pattern.`),
    q("q2", `What should you inspect first after a ${language.name} failure?`, ["The error message and the first relevant location", "Only the color theme", "The newest unrelated file", "Nothing; retry unchanged"], 0, "A specific error and source location provide evidence for the next debugging step."),
    q("q3", "What makes a small project maintainable?", ["Small focused units with clear responsibilities", "One giant function", "Duplicating code to avoid names", "No edge-case handling"], 0, "Focused functions or types make changes safer and easier to test."),
    q("q4", "Which input belongs in a boundary-case test?", ["An empty or invalid value", "Only the easiest valid value", "A screenshot", "A package name"], 0, "Boundary and invalid inputs reveal assumptions that the happy path does not."),
  ];
  return { moduleId: module.id, moduleTitle: module.title, questions };
}

function createBackendLanguageQuiz(module: RoadmapModule, language: LanguageProfile): AdaptiveQuiz {
  const questions: Record<string, QuizQuestion[]> = {
    "backend-foundations": [q("q1", "Which status code best represents a successfully created resource?", ["200", "201", "400", "404"], 1, "201 Created communicates that a new resource was created successfully."), q("q2", "Why return JSON from an API?", ["It gives clients a structured, language-neutral response", "It hides all server errors", "It replaces authentication", "It makes a database unnecessary"], 0, "JSON is a standard structured format that browsers, mobile apps, and other services can parse."), q("q3", `Which command starts this ${language.name} server setup?`, [language.run, "git push", "npm publish", "docker stop"], 0, `Use ${language.run} for the local setup.`), q("q4", "What is an HTTP request?", ["A client asking a server to perform an action", "A database table", "A CSS rule", "A password"], 0, "A request carries a method, URL, headers, and sometimes a body to the server.")],
    "backend-routing": [q("q1", "Which HTTP method is normally used to create a new resource?", ["GET", "POST", "DELETE", "HEAD"], 1, "POST is conventionally used to create a resource under a collection route."), q("q2", "Why validate request input on the server?", ["Clients can send missing, malformed, or malicious data", "Validation only changes colors", "It makes authentication unnecessary", "It prevents logging"], 0, "Server-side validation protects the data and gives clients clear errors."), q("q3", "What should a route handler avoid doing directly when an app grows?", ["Putting all business and database logic in one large function", "Returning an error status", "Reading route parameters", "Calling a service layer"], 0, "Separating routing, business logic, and persistence keeps the API testable and maintainable."), q("q4", "Which response fits a missing resource?", ["201", "204", "400", "404"], 3, "404 Not Found tells the client that the requested resource does not exist.")],
    "backend-data": [q("q1", "Why use parameterized queries?", ["To separate data values from query code and reduce injection risk", "To avoid databases", "To make every query public", "To skip validation"], 0, "Parameters prevent untrusted values from being treated as SQL syntax."), q("q2", "What is a primary key used for?", ["Uniquely identifying a row", "Encrypting every password", "Styling an API response", "Replacing relationships"], 0, "A primary key is a stable unique identifier for a record."), q("q3", "How should an API handle a database record that is not found?", ["Return a clear 404 response", "Pretend it exists", "Return credentials", "Crash without a response"], 0, "A clear 404 lets the client handle the missing resource predictably."), q("q4", `Which data structure is commonly useful before persisting a group of ${language.name} values?`, [language.collection, "A CSS selector", "A status code", "A browser tab"], 0, `Use the suitable ${language.collection} form to organize related in-memory values.`)],
    "backend-auth": [q("q1", "What is the difference between authentication and authorization?", ["Authentication identifies a user; authorization checks what they may do", "They are the same", "Authorization happens before identity is known", "Authentication only applies to databases"], 0, "First establish who the requester is, then check whether that identity is allowed to perform the action."), q("q2", "Where should an API secret be stored?", ["A server environment variable or managed secret store", "Browser source code", "A public Git repository", "A JSON response"], 0, "Secrets must remain server-side and out of source control."), q("q3", "Before updating a user-owned record, what must the API verify?", ["The authenticated user owns it or has the required role", "The record has a short name", "The client used GET", "The browser is current"], 0, "Ownership and role checks prevent one user from changing another user’s data."), q("q4", "Why is client-side permission checking insufficient?", ["Clients can be modified or bypassed", "Clients cannot send requests", "It prevents JSON", "It slows databases"], 0, "The server must enforce permissions because it is the trust boundary.")],
    "backend-deploy": [q("q1", "Which API case should be tested besides a successful request?", ["Invalid input and unauthorized access", "Only the page title", "The developer’s editor theme", "A random unrelated request"], 0, "Validation and authorization failures are core API behavior and need tests."), q("q2", "What should production logs include?", ["Useful error context without secrets or passwords", "Every API key", "Only success messages", "Unrelated user data"], 0, "Logs should aid diagnosis while protecting sensitive information."), q("q3", "Why keep production configuration in environment variables?", ["It separates deploy-specific settings and secrets from code", "It removes the need for deployment", "It makes a service public", "It avoids all tests"], 0, "Environment variables let deployments change configuration without committing secrets."), q("q4", "What does a health check help a deployment platform determine?", ["Whether the service is responsive", "Whether every user is an admin", "Whether SQL is optional", "Whether the UI is blue"], 0, "A health check provides a lightweight signal that the service is alive and ready.")],
  };
  return { moduleId: module.id, moduleTitle: module.title, questions: questions[module.id] ?? questions["backend-foundations"] };
}

function createJavaRoadmap(topic: string): LearningRoadmap {
  return {
    topic,
    overview: "A practical Java path from the JVM and syntax to object-oriented design, collections, exceptions, and a small command-line project.",
    modules: [
      { id: "java-foundations", title: "Java foundations: JVM, types, and variables", description: "Set up the JDK, compile and run a class, then use primitive types, Strings, operators, and clear variable names.", estimatedMinutes: 50, learningObjectives: ["Explain the roles of the JDK, JVM, and bytecode", "Choose appropriate primitive and reference types"] },
      { id: "java-flow-methods", title: "Control flow and methods", description: "Use conditionals, loops, arrays, and methods to turn a problem into small, testable steps.", estimatedMinutes: 65, learningObjectives: ["Select the right loop or conditional for a scenario", "Write methods with parameters and return values"] },
      { id: "java-oop", title: "Classes and object-oriented design", description: "Model real entities with classes, constructors, encapsulation, inheritance, interfaces, and polymorphism.", estimatedMinutes: 80, learningObjectives: ["Create a class with encapsulated state", "Distinguish inheritance from interface-based behavior"] },
      { id: "java-collections-errors", title: "Collections, exceptions, and debugging", description: "Store groups of objects with List and Map, handle failures deliberately, and read stack traces to debug faster.", estimatedMinutes: 75, learningObjectives: ["Choose between List, Set, and Map", "Handle and diagnose exceptions safely"] },
      { id: "java-project", title: "Build a Java command-line project", description: "Combine the concepts into a small project such as a task tracker, library manager, or quiz app with persistent-looking structure.", estimatedMinutes: 100, learningObjectives: ["Break a feature into classes and methods", "Test edge cases and explain design decisions"] },
    ],
  };
}

function createJavaQuiz(module: RoadmapModule): AdaptiveQuiz {
  const questionsByModule: Record<string, QuizQuestion[]> = {
    "java-foundations": [
      q("q1", "Which component executes Java bytecode on a machine?", ["JDK", "JVM", "javac", "IDE"], 1, "The JVM runs compiled Java bytecode; the JDK includes tools such as the compiler."),
      q("q2", "Which declaration stores a decimal value with more precision than float?", ["int price = 12.5;", "double price = 12.5;", "String price = 12.5;", "boolean price = 12.5;"], 1, "double is the standard primitive type for decimal values when float precision is not enough."),
      q("q3", "What is true about String in Java?", ["It is a primitive type", "It can be changed in place", "It is a reference type and immutable", "It can only hold one character"], 2, "String is an object reference type. Its value is immutable; operations create a new String."),
      q("q4", "Which command compiles Main.java into bytecode?", ["java Main.java", "javac Main.java", "jvm Main.java", "jdk Main.java"], 1, "javac compiles source code; java runs the compiled class through the JVM."),
    ],
    "java-flow-methods": [
      q("q1", "Which loop is best when you need every element of an array but not its index?", ["for-each loop", "while(false)", "switch", "try-catch"], 0, "A for-each loop expresses iteration over every element clearly when the index is unnecessary."),
      q("q2", "What should a method with return type int do on every valid code path?", ["Print a value", "Return an int", "Declare a String", "Throw away its result"], 1, "A non-void method must return a value compatible with its declared return type."),
      q("q3", "Which conditional compares two primitive int values correctly?", ["a.equals(b)", "a == b", "a = b", "a.compareTo(b)"], 1, "For primitive numeric values, == compares the values directly."),
      q("q4", "Why split repeated logic into a method?", ["It makes variables global", "It removes all bugs", "It creates reusable, testable behavior", "It avoids parameters"], 2, "Methods reduce duplication and give a behavior a name that can be tested independently."),
    ],
    "java-oop": [
      q("q1", "What does encapsulation usually mean in a Java class?", ["Making every field public", "Keeping state private and exposing controlled methods", "Using only static methods", "Avoiding constructors"], 1, "Private fields plus methods such as getters, setters, or domain actions protect class invariants."),
      q("q2", "When is an interface especially useful?", ["When unrelated classes should provide the same capability", "When you need to store an int", "When a class cannot have methods", "When you want to avoid polymorphism"], 0, "Interfaces describe a shared capability, allowing different implementations to be used polymorphically."),
      q("q3", "What does a constructor initialize?", ["A loop counter only", "A new object’s starting state", "The JVM", "A package name"], 1, "A constructor runs when an object is created and establishes its initial valid state."),
      q("q4", "Which access modifier restricts a member to its own class?", ["public", "protected", "private", "static"], 2, "private limits direct access to the declaring class."),
    ],
    "java-collections-errors": [
      q("q1", "Which collection maps a unique key to a value?", ["List", "Set", "Map", "Array"], 2, "Map stores key-value pairs and is the right choice for lookup by an identifier."),
      q("q2", "Which collection preserves insertion order and allows duplicates?", ["List", "Set", "Map", "enum"], 0, "A List is ordered and permits duplicate values."),
      q("q3", "What is the best first step when reading a stack trace?", ["Ignore the exception type", "Find the exception message and first relevant project line", "Delete all catch blocks", "Restart the computer"], 1, "The exception type/message and the first stack-trace frame in your code usually identify the failing operation."),
      q("q4", "Why catch a specific exception instead of Exception everywhere?", ["It documents the failure you expect and avoids hiding unrelated bugs", "It makes all code static", "It removes the need for tests", "It changes a List into a Map"], 0, "Specific handling makes expected failures clear while allowing unexpected errors to surface."),
    ],
    "java-project": [
      q("q1", "For a task tracker, which class best owns a task’s title and completion state?", ["Task", "Main", "Scanner", "System"], 0, "A Task class keeps task-related state and behavior together."),
      q("q2", "Which test is an important edge case for deleting a task by id?", ["Deleting an id that does not exist", "Printing a welcome message", "Importing java.util", "Naming the project"], 0, "Missing ids are a realistic boundary condition that should produce a safe, understandable result."),
      q("q3", "What is a good reason to keep input handling separate from task-management logic?", ["It makes the code harder to change", "It separates user interaction from core behavior", "It prevents objects", "It removes methods"], 1, "Separating concerns lets you test core behavior without depending on console input."),
      q("q4", "Before calling a project complete, what is most valuable?", ["Only testing the happy path", "Explaining key design choices and checking invalid input", "Removing all error messages", "Avoiding a README"], 1, "A useful project demonstrates deliberate design and robust handling of invalid or boundary input."),
    ],
  };
  return { moduleId: module.id, moduleTitle: module.title, questions: questionsByModule[module.id] ?? createTopicAwareQuestions(module, "Java", module.learningObjectives[0], module.learningObjectives[1]) };
}

function q(id: string, prompt: string, options: string[], correctOptionIndex: number, explanation: string): QuizQuestion {
  return { id, prompt, options, correctOptionIndex, explanation, learningObjective: prompt };
}

function createTopicAwareQuestions(module: RoadmapModule, topic: string, primaryObjective: string, secondaryObjective: string): QuizQuestion[] {
  return [
      {
        id: `${module.id}-q1`,
        prompt: `When starting ${topic}, which action best supports ${primaryObjective.toLowerCase()}?`,
        options: [`Define the key terms and connect them to one concrete ${topic} example`, "Memorize isolated terminology without context", "Start with advanced edge cases", "Avoid checking your assumptions"],
        correctOptionIndex: 0,
        explanation: `A concrete example makes the vocabulary of ${topic} meaningful and lets you test whether you understand it.`,
        learningObjective: primaryObjective,
      },
      {
        id: `${module.id}-q2`,
        prompt: `Which response best demonstrates ${secondaryObjective.toLowerCase()}?`,
        options: ["Repeating a definition word for word", "Choosing an approach for a small scenario and explaining why it fits", "Skipping practice until the end", "Using the same familiar example every time"],
        correctOptionIndex: 2,
        explanation: `Applying an idea to a new ${topic} scenario reveals whether you understand the reasoning, not just the words.`,
        learningObjective: secondaryObjective,
      },
      {
        id: `${module.id}-q3`,
        prompt: `You get a ${topic} practice question wrong. What is the most useful next step?`,
        options: ["Ignore it and move on", "Identify the mistaken assumption, review the concept, then retry a similar example", "Change every answer at random", "Stop practicing the topic"],
        correctOptionIndex: 1,
        explanation: "Pinpointing the mistaken assumption turns an error into a focused opportunity to strengthen the concept.",
        learningObjective: "Identify and correct common errors",
      },
      {
        id: `${module.id}-q4`,
        prompt: `Which result most strongly suggests you are ready to advance in ${topic}?`,
        options: ["You can solve a basic case and explain why your approach works", "You have read the module title", "You can repeat one answer without context", "You have avoided all feedback"],
        correctOptionIndex: 0,
        explanation: "Being able to solve and explain a basic case demonstrates transferable understanding, not just familiarity.",
        learningObjective: primaryObjective,
      },
  ];
}

export function createMockTutorResponse(request: TutorRequest): TutorResponse {
  const question = request.messages[request.messages.length - 1]?.content ?? "Can you explain this?";
  const weakSpots = request.weakSpots.filter((spot) => spot.moduleId === request.module.id);
  const weakSpotGuidance = weakSpots.length > 0
    ? ` You have previously missed questions about ${weakSpots.map((spot) => spot.concept).join(" and ")}. Keep that distinction in view: name the idea, explain what it does, then compare it with the closest alternative.`
    : " Start by identifying the purpose of the idea, then connect it to a small example.";

  return {
    answer: `For ${request.module.title}, a helpful way to approach your question is to separate the core idea from its application. ${question} First, restate the key concept in your own words. Next, apply it to one simple case and explain why that case fits.${weakSpotGuidance}\n\nTry this: describe one example where the concept applies, and one similar example where it does not. What is the deciding difference?`,
  };
}
