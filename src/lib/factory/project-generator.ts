import { createProjectMemoryDigest } from "./project-memory-digest";
import { customerAccountPanelSource } from "./customer-account-template";
import { createSweetShopModulePage, createSweetShopWorkspaceFile, sweetShopModeForModule, sweetShopStyles } from "./sweet-shop-template";

export type ProjectSourceModule = {
  id: string;
  title: string;
  description: string;
};

export type ProjectSourceInput = {
  projectId: string;
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

const GENERATOR_VERSION = "merkora-nextjs-scaffold/1.6.0";

function requiredText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`Le champ ${field} est invalide.`);
  }
  return value.trim();
}

function safeModuleId(value: unknown): string {
  if (typeof value !== "string" || value.length > 50 ||
    !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)) {
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

function storefrontSlugFor(projectName: string, projectId: string): string {
  const base = projectName.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48).replace(/-+$/g, "") || "boutique";
  const suffix = projectId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-6);
  if (!suffix) throw new Error("Identifiant du projet invalide pour la boutique.");
  return `${base}-${suffix}`;
}

function componentName(id: string): string {
  return id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
}

export function generateProjectSource(input: ProjectSourceInput): GeneratedProjectSource {
  const projectId = requiredText(input.projectId, "identifiant du projet", 160);
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
        dependencies: { next: "^16.2.4", react: "^19.2.0", "react-dom": "^19.2.0", ...(modules.some((module) => sweetShopModeForModule(module.id) !== null) ? { "@supabase/supabase-js": "2.119.0" } : {}) },
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
    { path: "src/components/module-workspace.tsx", content: "\"use client\";\n\nimport { useEffect, useState, type FormEvent } from \"react\";\n\ntype WorkItem = { id: string; label: string; done: boolean };\n\nexport function ModuleWorkspace({ storageKey, title, description }: { storageKey: string; title: string; description: string }) {\n  const [items, setItems] = useState<WorkItem[]>([]);\n  const [draft, setDraft] = useState(\"\");\n  const [ready, setReady] = useState(false);\n  const [storageWarning, setStorageWarning] = useState<string | null>(null);\n\n  useEffect(() => {\n    try {\n      const saved = window.localStorage.getItem(storageKey);\n      if (saved) {\n        const parsed: unknown = JSON.parse(saved);\n        if (Array.isArray(parsed)) setItems(parsed.filter((item): item is WorkItem => item && typeof item.id === \"string\" && typeof item.label === \"string\" && typeof item.done === \"boolean\"));\n      }\n    } catch {\n      setItems([]);\n      setStorageWarning(\"Le stockage local est indisponible. Les actions ne seront pas conservées après fermeture.\");\n    } finally { setReady(true); }\n  }, [storageKey]);\n\n  useEffect(() => {\n    if (!ready) return;\n    try {\n      window.localStorage.setItem(storageKey, JSON.stringify(items));\n      setStorageWarning(null);\n    } catch {\n      setStorageWarning(\"Enregistrement impossible dans ce navigateur. Libérez de l’espace ou autorisez le stockage local.\");\n    }\n  }, [items, ready, storageKey]);\n\n  function addItem(event: FormEvent<HTMLFormElement>) {\n    event.preventDefault();\n    const label = draft.trim();\n    if (!label) return;\n    setItems((current) => [...current, { id: crypto.randomUUID(), label, done: false }]);\n    setDraft(\"\");\n  }\n\n  function toggleItem(id: string) {\n    setItems((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item));\n  }\n\n  const completed = items.filter((item) => item.done).length;\n  return (\n    <section className=\"card\" aria-label={\"Espace de travail : \" + title}>\n      <p className=\"eyebrow\">Suivi local du module</p>\n      <h2>{title}</h2>\n      <p>{description}</p>\n      <p>{completed}/{items.length} action(s) terminée(s)</p>\n      <form onSubmit={addItem}>\n        <label htmlFor={storageKey + \"-new-item\"}>Nouvelle action</label>\n        <input id={storageKey + \"-new-item\"} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={180} placeholder=\"Ajouter une action à suivre…\" />\n        <button type=\"submit\" disabled={!draft.trim()}>Ajouter</button>\n      </form>\n      {items.length === 0 ? <p>Aucune action pour le moment.</p> : (\n        <ul>{items.map((item) => <li key={item.id}><label><input type=\"checkbox\" checked={item.done} onChange={() => toggleItem(item.id)} /> <span>{item.done ? <s>{item.label}</s> : item.label}</span></label></li>)}</ul>\n      )}\n      <p role=\"status\" aria-live=\"polite\">{storageWarning ?? \"Prototype : ces actions restent enregistrées dans ce navigateur uniquement. Elles ne sont pas encore partagées avec un compte ou une équipe.\"}</p>\n    </section>\n  );\n}" },
    {
      path: "src/app/page.tsx",
      content: `const modules = [\n${moduleData}\n];\n\nexport default function HomePage() {\n  return (\n    <main>\n      <p className="eyebrow">Espace de travail</p>\n      <h1>{${jsString(projectName)}}</h1>\n      <p className="lead">{${jsString(projectDescription)}}</p>\n      <section className="grid" aria-label="Modules du projet">\n        {modules.map((module) => (\n          <a className="card" href={"/modules/" + module.id} key={module.id}>\n            <h2>{module.title}</h2>\n            <p>{module.description}</p>\n          </a>\n        ))}\n      </section>\n      <footer>Première base générée par MerKora GDJ · Version de génération 1.6.0</footer>\n    </main>\n  );\n}\n`,
    },
    {
      path: "README.md",
      content: `# ${projectName}\n\n${projectDescription}\n\n## Démarrage\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Périmètre généré\n\n${modules.map((module) => `- **${module.title}** — ${module.description}`).join("\n")}\n\n## Connexion Supabase\n\nPour activer les données partagées, copiez .env.example vers .env.local et renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY. Configurez les mêmes valeurs dans les variables d’environnement de l’hébergement. N’utilisez jamais une clé service_role dans le navigateur.\n\nLe catalogue public ne montre que les produits actifs d’une boutique publiée. Le propriétaire se connecte avec son compte Supabase Auth pour gérer les produits, les commandes et les demandes personnalisées. Les commandes sont recalculées en base à partir des prix du catalogue et peuvent préciser retrait sur place ou livraison avec adresse ; aucun paiement n’est déclenché par cette application. Le propriétaire peut téléverser les photos de ses propres réalisations. Les clients peuvent créer un compte, se connecter et retrouver uniquement leurs propres commandes et demandes personnalisées. Les commandes créées pendant une session authentifiée sont automatiquement rattachées au compte par la base de données. Les clients peuvent joindre une photo d’exemple à une demande personnalisée ; ces photos de référence restent privées et ne sont visibles que par le propriétaire et le client concerné.\n\nLa boutique Asho Sweet est créée non publiée et sans produits préremplis. Ajoutez les vrais articles et tarifs, vérifiez les informations et publiez seulement lorsque le propriétaire donne son accord.\n\nLa persistance et les contrôles d’accès utilisent Supabase RLS. Les variables de connexion et la publication de la boutique doivent être configurées avant la mise en service.\n`,
    },
  ];

  const hasSweetShopModules = modules.some((module) => sweetShopModeForModule(module.id) !== null);
  if (hasSweetShopModules) {
    files.push(createSweetShopWorkspaceFile(storefrontSlugFor(projectName, projectId)));
    files.push({ path: "src/components/customer-account-panel.tsx", content: customerAccountPanelSource });
    files.push({ path: ".env.example", content: "NEXT_PUBLIC_SUPABASE_URL=\\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\\n" });
    const stylesheet = files.find((file) => file.path === "src/app/globals.css");
    if (stylesheet) stylesheet.content += sweetShopStyles;
  }

  for (const module of modules) {
    const component = componentName(module.id);
    files.push({
      path: `src/app/modules/${module.id}/page.tsx`,
      content: sweetShopModeForModule(module.id)
        ? createSweetShopModulePage(module.id, module.title, module.description)
        : `import { ModuleWorkspace } from "@/components/module-workspace";\n\nexport default function ${component}ModulePage() {\n  return (\n    <main>\n      <p className="eyebrow">Module du projet</p>\n      <h1>{${jsString(module.title)}}</h1>\n      <p className="lead">{${jsString(module.description)}}</p>\n      <ModuleWorkspace storageKey={${jsString("merkora-module-" + module.id)}} title={${jsString(module.title)}} description={${jsString(module.description)}} />\n      <p><a href="/">← Retour à l’espace de travail</a></p>\n    </main>\n  );\n}\n`,
    });
  }

  const digest = createProjectMemoryDigest({ generatorVersion: GENERATOR_VERSION, files });
  return { generatorVersion: GENERATOR_VERSION, files, digest, moduleIds: modules.map((module) => module.id) };
}
