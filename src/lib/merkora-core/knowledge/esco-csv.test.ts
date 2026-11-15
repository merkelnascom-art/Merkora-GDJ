import { describe, expect, it } from "vitest";
import { parseESCOCsvLanguageFiles } from "./esco-csv";

describe("official ESCO CSV language-pack parser", () => {
  it("merges occupation labels and descriptions across languages by stable URI", () => {
    const bundle = parseESCOCsvLanguageFiles({
      datasetVersion: "1.2.1",
      files: [
        {
          language: "fr",
          type: "occupation",
          content: 'conceptUri,preferredLabel,altLabels,description\nhttps://data.europa.eu/esco/occupation/1,"Développeur logiciel","Programmeur\nIngénieur logiciel","Conçoit, teste et maintient des logiciels."\n',
        },
        {
          language: "en",
          type: "occupation",
          content: 'conceptUri,preferredLabel,altLabels,description\nhttps://data.europa.eu/esco/occupation/1,"Software developer","Programmer","Designs and maintains software."\n',
        },
      ],
    });

    expect(bundle.concepts).toHaveLength(1);
    expect(bundle.concepts[0]).toMatchObject({
      uri: "https://data.europa.eu/esco/occupation/1",
      type: "occupation",
      preferredLabels: { fr: "Développeur logiciel", en: "Software developer" },
      descriptions: {
        fr: "Conçoit, teste et maintient des logiciels.",
        en: "Designs and maintains software.",
      },
      alternativeLabels: {
        fr: ["Programmeur", "Ingénieur logiciel"],
        en: ["Programmer"],
      },
    });
  });

  it("reads the official ESCO concept headings and occupation-skill relation files", () => {
    const bundle = parseESCOCsvLanguageFiles({
      datasetVersion: "1.2.1",
      files: [{
        language: "fr",
        type: "occupation",
        content: 'Concept URI,Concept PT,Definition,Parent Concept URI\nurn:occupation:teacher,Enseignant,"Transmet des savoirs.",urn:group:education\n',
      }, {
        language: "fr",
        type: "skill",
        content: 'Concept URI,Concept PT,Definition\nurn:skill:pedagogy,Pédagogie,"Capacité à enseigner."\n',
      }],
      occupationSkillRelationsCsv: 'Occupation URI,Skill URI,Relation type\nurn:occupation:teacher,urn:skill:pedagogy,Essential\n',
      broaderRelationFiles: [{
        type: "occupation",
        content: 'Concept URI,Parent Concept URI\nurn:occupation:teacher,urn:group:education\n',
      }],
    });

    expect(bundle.concepts.find((item) => item.uri === "urn:occupation:teacher")?.broaderUri).toBe("urn:group:education");
    expect(bundle.occupationSkillRelations).toEqual([{
      occupationUri: "urn:occupation:teacher",
      skillUri: "urn:skill:pedagogy",
      relation: "essential",
    }]);
  });

  it("supports quoted commas, escaped quotes and rejects conflicting labels for one URI/language", () => {
    const bundle = parseESCOCsvLanguageFiles({
      datasetVersion: "1.2.1",
      files: [{
        language: "fr",
        type: "skill",
        content: 'conceptUri,preferredLabel,description\nurn:skill:1,"Gestion, analyse et contrôle","Dit ""comprendre"", puis décider."\n',
      }],
    });
    expect(bundle.concepts[0].preferredLabels.fr).toBe("Gestion, analyse et contrôle");
    expect(bundle.concepts[0].descriptions?.fr).toBe('Dit "comprendre", puis décider.');

    expect(() => parseESCOCsvLanguageFiles({
      datasetVersion: "1.2.1",
      files: [{
        language: "fr",
        type: "occupation",
        content: 'conceptUri,preferredLabel\nurn:occupation:1,Comptable\nurn:occupation:1,Juriste\n',
      }],
    })).toThrow(/conflicting preferred labels/i);
  });
});
