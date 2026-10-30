import { createProjectMemoryDigest } from "./project-memory-digest";

export type ProjectSourceModule = {
  id: string;
  title: string;
  description: string;
};

export type ProjectSourceInput = {
  projectName: string;
  projectDescription: string;
  modules: ProjectSourceModule[];
};

export type GeneratedProjectFile = { path: string; content: string };
export type GeneratedProjectSource = {
  generatorVersion: string;
  files: GeneratedProjectFile[];
  digest: string;
  moduleIds: string[];
};

const GENERATOR_VERSION = "merkora-nextjs-scaffold/1.0.0";

function requiredText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`Le champ ${field} est invalide.`);
  }
  return value.trim();
}

function safeModuleId(value: unknown): string {
  if (typeof value !== "string" || value.length > 50 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error("Identifiant de module invalide.");
  }
  return value;
}

function jsString(value: string): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function componentName(id: string): string {
  return id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
}

export function generateProjectSource(input: ProjectSourceInput): GeneratedProjectSource {
  const projectName = requiredText(input.projectName, "nom du projet", 120);
  const projectDescription = requiredText(input.projectDescription, "description du projet", 500);
  if (!Array.isArray(input.modules) || input.modules.length < 1 || input.modules.length > 30) {
    throw new Error("Au moins un module approuvé est requis (maximum 30).");
  }

  const seen = new Set<string>();
  const modules = input.modules.map((module) => {
    const id = safeModuleId(module?.id);
    if (seen.has(id)) throw new Error("Les identifiants de modules doivent être uniques.");
    seen.add(id);
    return {
      id,
      title: requiredText(module.title, "titre du module", 100),
      description: requiredText(module.description, "description du module", 500),
    };
  });

  const moduleData = modules.map((module) =>
    `  { id: ${jsString(module.id)}, title: ${jsString(module.title)}, description: ${jsString(module.description)} },`
  ).join("\n");

  const files: GeneratedProjectFile[] = [
    {
      path: "package.json",
      content: JSON.stringify({
        name: "merkora-generated-project",
        version: "0.1.0",
        private: true,
        scripts: { dev: "next dev", build: "next build", start: "next start", typecheck: "tsc --noEmit" },
        dependencies: { next: "^16.2.4", react: "^19.2.0", "react-dom": "^19.2.0" },
        devDependencies: { "@types/node": "^22.15.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0", typescript: "^5.9.3" },
      }, null, 2) + "\n",
    },
    {
      path: "tsconfig.json",
      content: JSON.stringify({
        compilerOptions: {
          target: "ES2017", lib: ["dom", "dom.iterable", "esnext"], allowJs: true,
          skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true,
          module: "esnext", moduleResolution: "bundler", resolveJsonModule: true,
          isolatedModules: true, jsx: "preserve", incremental: true,
          plugins: [{ name: "next" }], paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.ts", "**/*.tsx"],
        exclude: ["node_modules"],
      }, null, 2) + "\n",
    },
    {
      path: "src/app/layout.tsx",
      content: `import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = { title: ${jsString(projectName)}, description: ${jsString(projectDescription)} };\n\nexport default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {\n  return <html lang="fr"><body>{children}</body></html>;\n}\n`,
    },
    {
      path: "src/app/globals.css",
      content: `:root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; color: #172033; background: #f5f7fb; }\n* { box-sizing: border-box; }\nbody { margin: 0; }\na { color: inherit; text-decoration: none; }\nmain { max-width: 1120px; margin: 0 auto; padding: 48px 24px; }\n.eyebrow { color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }\nh1 { margin: 12px 0; font-size: clamp(32px, 5vw, 52px); letter-spacing: -.04em; }\n.lead { max-width: 680px; color: #64748b; line-height: 1.7; }\n.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 32px; }\n.card { display: block; padding: 24px; border: 1px solid #e2e8f0; border-radius: 18px; background: white; box-shadow: 0 8px 28px #1720330a; }\n.card h2 { margin: 0 0 10px; font-size: 18px; }\n.card p { margin: 0; color: #64748b; line-height: 1.6; }\nfooter { margin-top: 48px; color: #94a3b8; font-size: 12px; }\n`,
    },
    {
      path: "src/app/page.tsx",
      content: `const modules = [\n${moduleData}\n];\n\nexport default function HomePage() {\n  return (\n    <main>\n      <p className="eyebrow">Espace de travail</p>\n      <h1>{${jsString(projectName)}}</h1>\n      <p className="lead">{${jsString(projectDescription)}}</p>\n      <section className="grid" aria-label="Modules du projet">\n        {modules.map((module) => (\n          <a className="card" href={"/modules/" + module.id} key={module.id}>\n            <h2>{module.title}</h2>\n            <p>{module.description}</p>\n          </a>\n        ))}\n      </section>\n      <footer>Première base générée par MerKora GDJ · Version de génération 1.0.0</footer>\n    </main>\n  );\n}\n`,
    },
    {
      path: "README.md",
      content: `# ${projectName}\n\n${projectDescription}\n\n## Démarrage\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Périmètre généré\n\n${modules.map((module) => `- **${module.title}** — ${module.description}`).join("\n")}\n\nCette version est un squelette applicatif généré à partir du périmètre transmis. Les règles métier, les accès, la persistance, les intégrations et les contrôles de sécurité doivent être implémentés et vérifiés avant toute livraison.\n`,
    },
  ];

  for (const module of modules) {
    const component = componentName(module.id);
    files.push({
      path: `src/app/modules/${module.id}/page.tsx`,
      content: `export default function ${component}ModulePage() {\n  return (\n    <main>\n      <p className="eyebrow">Module du projet</p>\n      <h1>{${jsString(module.title)}}</h1>\n      <p className="lead">{${jsString(module.description)}}</p>\n      <section className="card" aria-label="État du module">\n        <h2>Fonctionnalités à construire</h2>\n        <p>Cette page est le point de départ du module. Les opérations métier, les données et les autorisations restent à implémenter selon le cahier des charges approuvé.</p>\n      </section>\n      <p><a href="/">← Retour à l'espace de travail</a></p>\n    </main>\n  );\n}\n`,
    });
  }

  const digest = createProjectMemoryDigest({ generatorVersion: GENERATOR_VERSION, files });
  return { generatorVersion: GENERATOR_VERSION, files, digest, moduleIds: modules.map((module) => module.id) };
}
