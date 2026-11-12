import ts from "typescript";
import { describe, expect, it } from "vitest";
import { generateProjectSource, type ProjectSourceInput } from "./project-generator";

const input: ProjectSourceInput = {
  projectId: "MK-TEST-000001",
  projectName: "Gestion de présence",
  projectDescription: "Suivre les arrivées et retards du personnel.",
  modules: [
    { id: "attendance", title: "Présences", description: "Pointage et retards." },
    { id: "staff", title: "Personnel", description: "Profils et équipes." },
  ],
};

describe("generateProjectSource", () => {
  it("generates a runnable Next.js scaffold with every approved module", () => {
    const result = generateProjectSource(input);
    expect(result.files.map((file) => file.path)).toContain("package.json");
    expect(result.files.map((file) => file.path)).toContain("src/app/page.tsx");
    expect(result.files.map((file) => file.path)).toContain("src/components/module-workspace.tsx");
    expect(result.files.find((file) => file.path === "src/app/modules/attendance/page.tsx")?.content).toContain("<ModuleWorkspace");
    expect(result.files.find((file) => file.path === "src/components/module-workspace.tsx")?.content).toContain("localStorage");
    expect(result.files.find((file) => file.path === "src/components/module-workspace.tsx")?.content).toContain("aria-label");
    expect(result.files.find((file) => file.path === "src/components/module-workspace.tsx")?.content).toContain("setStorageWarning");
    expect(result.files.find((file) => file.path === "src/components/module-workspace.tsx")?.content).toContain('role="status"');
    expect(result.files.find((file) => file.path === "src/app/page.tsx")?.content).toContain("1.4.0");
    expect(result.files.map((file) => file.path)).toContain("src/app/modules/attendance/page.tsx");
    expect(result.files.map((file) => file.path)).toContain("src/app/modules/staff/page.tsx");
    expect(result.files.find((file) => file.path === "src/app/modules/attendance/page.tsx")?.content).toContain("Pointage et retards.");
    expect(result.files.find((file) => file.path === "src/app/page.tsx")?.content).toContain("Présences");
    expect(result.files.every((file) => file.content.length > 0)).toBe(true);
  });

  it("escapes untrusted text before placing it in generated JSX", () => {
    const result = generateProjectSource({
      ...input,
      projectName: "</title><script>alert(1)</script>",
      modules: [{ id: "xss", title: "{danger}", description: "<img src=x onerror=alert(1)>" }],
    });
    const page = result.files.find((file) => file.path === "src/app/page.tsx")?.content ?? "";
    expect(page).not.toContain("<script>");
    expect(page).not.toContain("<img");
    expect(page).toContain("\\u003cscript\\u003e");
  });

  it("rejects an empty scope and unsafe or duplicate module identifiers", () => {
    expect(() => generateProjectSource({ ...input, modules: [] })).toThrow(/module/i);
    expect(() => generateProjectSource({ ...input, modules: [{ id: "../admin", title: "Admin", description: "" }] })).toThrow(/identifiant/i);
    expect(() => generateProjectSource({ ...input, modules: [
      { id: "staff", title: "A", description: "First" },
      { id: "staff", title: "B", description: "Second" },
    ] })).toThrow(/unique/i);
  });

  it("rejects module identifiers that would create invalid TypeScript component names", () => {
    expect(() => generateProjectSource({
      ...input,
      modules: [{ id: "123-dashboard", title: "Tableau", description: "Vue de synthèse." }],
    })).toThrow(/identifiant/i);
  });

  it("emits syntactically valid TypeScript and TSX files", () => {
    const result = generateProjectSource(input);
    for (const file of result.files.filter((item) => item.path.endsWith(".tsx"))) {
      const output = ts.transpileModule(file.content, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
        reportDiagnostics: true,
      });
      expect(output.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)).toEqual([]);
    }
  });

  it("produces a deterministic manifest digest for identical input", () => {
    expect(generateProjectSource(input).digest).toBe(generateProjectSource(input).digest);
  });

  it("generates Asho Sweet catalogue, custom-order, and cart workflows instead of generic local task lists", () => {
    const sweetShop = generateProjectSource({
      projectId: "MK-MWAWRAVH-1FWG",
      projectName: "Asho Sweet",
      projectDescription: "Catalogue de gâteaux, commandes personnalisées et validation de panier.",
      modules: [
        { id: "catalogue-de-gateau-et-de-patisserie", title: "Catalogue de gâteaux et pâtisseries", description: "Présenter les produits et leurs prix." },
        { id: "commande-personnalisee", title: "Commande personnalisée", description: "Recueillir les demandes de créations sur mesure." },
        { id: "panier-et-validation-de-commande", title: "Panier et validation de commande", description: "Récapituler et valider les commandes." },
      ],
    });
    const paths = sweetShop.files.map((file) => file.path);
    expect(paths).toContain("src/components/sweet-shop-workspace.tsx");
    expect(paths).toContain(".env.example");
    expect(sweetShop.files.find((file) => file.path === "src/app/modules/catalogue-de-gateau-et-de-patisserie/page.tsx")?.content).toContain('mode="catalogue"');
    expect(sweetShop.files.find((file) => file.path === "src/app/modules/commande-personnalisee/page.tsx")?.content).toContain('mode="custom-order"');
    expect(sweetShop.files.find((file) => file.path === "src/app/modules/panier-et-validation-de-commande/page.tsx")?.content).toContain('mode="cart"');
    const workspace = sweetShop.files.find((file) => file.path === "src/components/sweet-shop-workspace.tsx")?.content ?? "";
    expect(workspace).toContain("Prix en FCFA");
    expect(workspace).toContain('const STOREFRONT_SLUG = "asho-sweet-vh1fwg"');
    expect(workspace).toContain("createClient");
    expect(workspace).toContain("signInWithPassword");
    expect(workspace).toContain("project_store_orders");
    expect(workspace).toContain("project_store_custom_requests");
    expect(workspace).toContain("creation_type");
    expect(workspace).toContain("fulfillment_method");
    expect(workspace).toContain("Adresse de livraison");
    expect(workspace).toContain("Retrait sur place");
    expect(workspace).toContain("En préparation");
    expect(workspace).toContain("Devis proposé");
    expect(workspace).toContain("sessionStorage");
    expect(workspace).toContain("Voir mon panier");
    expect(workspace).not.toContain("localStorage");
    expect(workspace).toContain("Le catalogue sera affiché ici");
    expect(workspace).toContain("sans paiement");
    expect(sweetShop.files.find((file) => file.path === "package.json")?.content).toContain('"@supabase/supabase-js": "2.119.0"');
  });

});