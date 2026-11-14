"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LandingPage } from "@/components/marketing/landing-page";
import { ClientWorkspaceShell } from "@/components/workspace/client-workspace-shell";
import { ClientProjectHome } from "@/components/workspace/client-project-home";
import { ClientUnderstandingStartStep } from "@/components/workspace/client-understanding-start-step";
import { ClientProjectJourney } from "@/components/workspace/client-project-journey";
import type { Project } from "@/lib/project-types";
import { analyzeNeed } from "@/lib/discovery";
import { analyzeUniversalProjectIntent } from "@/lib/universal-project-understanding";
import { selectNextDiscoveryQuestion, type DiscoveryQuestionSelection } from "@/lib/universal-project-discovery";
import {
  createClientJourneyState,
  canEnterJourneyStage,
  restoreClientJourneyState,
  type ClientJourneyDecisions,
  type ClientJourneyStage,
  type ClientJourneyState,
} from "@/lib/client-journey";
import { getClientWorkspaceView } from "@/lib/client-workspace-view";
import {
  buildRecommendations,
  validateNeed,
  type NeedCategory,
  type NeedInput,
  type Recommendation,
} from "@/lib/solution-recommendations";

const PROJECTS_STORAGE_KEY = "merkora-gdj-projects-v1";
const JOURNEY_STORAGE_KEY = "merkora-gdj-journey-v1";

const initialForm: NeedInput = {
  title: "",
  category: "other",
  problem: "",
  desiredOutcome: "À clarifier avec vous",
  budget: "À définir",
  urgency: "normal",
};

type JourneyRecord = {
  state: ClientJourneyState;
  decisions: ClientJourneyDecisions;
  discovery: DiscoveryQuestionSelection;
};

function makeId() {
  return `MK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function defaultDecisions(): ClientJourneyDecisions {
  return {
    selectedProposalIds: [],
    proposalSelectionConfirmed: false,
    selectedConceptId: null,
    designValidated: false,
  };
}

function createJourneyRecord(project: Project): JourneyRecord {
  const analysis = analyzeUniversalProjectIntent(`${project.title}\n${project.problem}\n${project.desiredOutcome}`);
  return {
    state: createClientJourneyState(project.id),
    decisions: defaultDecisions(),
    discovery: selectNextDiscoveryQuestion(analysis, []),
  };
}

function restoreJourneyRecord(projectId: string, value: unknown, project: Project): JourneyRecord {
  const fallback = createJourneyRecord(project);
  if (!value || typeof value !== "object") return fallback;
  const record = value as Record<string, unknown>;
  const state = restoreClientJourneyState(record.state);
  const rawDecisions = record.decisions && typeof record.decisions === "object"
    ? record.decisions as Record<string, unknown>
    : {};
  const decisions: ClientJourneyDecisions = {
    selectedProposalIds: Array.isArray(rawDecisions.selectedProposalIds)
      ? rawDecisions.selectedProposalIds.filter((item): item is string => typeof item === "string").slice(0, 40)
      : [],
    proposalSelectionConfirmed: rawDecisions.proposalSelectionConfirmed === true,
    selectedConceptId: typeof rawDecisions.selectedConceptId === "string" ? rawDecisions.selectedConceptId : null,
    designValidated: rawDecisions.designValidated === true,
  };
  const rawDiscovery = record.discovery as DiscoveryQuestionSelection | undefined;
  const discovery = rawDiscovery && typeof rawDiscovery === "object" &&
    Array.isArray(rawDiscovery.remainingGaps) && Array.isArray(rawDiscovery.contradictions) &&
    typeof rawDiscovery.readyForSolutionReview === "boolean"
      ? rawDiscovery
      : fallback.discovery;

  return {
    state: state.projectId === projectId ? state : fallback.state,
    decisions,
    discovery,
  };
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [journeys, setJourneys] = useState<Record<string, JourneyRecord>>({});
  const [form, setForm] = useState<NeedInput>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const mergeCloudProjects = useCallback((cloudProjects: Project[]) => {
    setProjects((current) => {
      const localIds = new Set(current.map((project) => project.id));
      return [...current, ...cloudProjects.filter((project) => !localIds.has(project.id))];
    });
  }, []);

  const mergeCloudJourneys = useCallback((cloudJourneys: Record<string, unknown>, cloudProjects: Project[]) => {
    setJourneys((current) => {
      const next = { ...current };
      for (const [projectId, value] of Object.entries(cloudJourneys)) {
        if (next[projectId]) continue;
        const project = cloudProjects.find((item) => item.id === projectId) ??
          projects.find((item) => item.id === projectId);
        if (project) next[projectId] = restoreJourneyRecord(projectId, value, project);
      }
      return next;
    });
  }, [projects]);

  useEffect(() => {
    try {
      const savedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (savedProjects) {
        const parsed: unknown = JSON.parse(savedProjects);
        if (Array.isArray(parsed)) setProjects(parsed as Project[]);
      }
      const savedJourneys = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
      if (savedJourneys) {
        const parsed: unknown = JSON.parse(savedJourneys);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const restored: Record<string, JourneyRecord> = {};
          for (const [projectId, value] of Object.entries(parsed)) {
            const saved = value as { project?: Project };
            if (saved?.project && typeof saved.project.id === "string") {
              restored[projectId] = restoreJourneyRecord(projectId, value, saved.project);
            }
          }
          setJourneys(restored);
        }
      }
    } catch {
      // A corrupted local cache must not prevent the workspace from opening.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [projects, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      const persisted: Record<string, JourneyRecord & { project: Project }> = {};
      for (const [projectId, journey] of Object.entries(journeys)) {
        const project = projects.find((item) => item.id === projectId);
        if (project) persisted[projectId] = { ...journey, project };
      }
      window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Journey navigation remains usable even when browser storage is unavailable.
    }
  }, [journeys, projects, storageReady]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  );
  const activeJourney = activeProject
    ? journeys[activeProject.id] ?? createJourneyRecord(activeProject)
    : null;
  const activeProjectRecommendations = activeProject
    ? activeProject.recommendations.length > 0 ? activeProject.recommendations : buildRecommendations(activeProject)
    : [];
  const workspaceView = getClientWorkspaceView(activeJourney?.state.stage ?? "welcome", Boolean(activeProject));

  function startDiscovery(example?: { title: string; category: NeedCategory }) {
    setForm(example ? { ...initialForm, title: example.title, category: example.category } : initialForm);
    setActiveProjectId(null);
    setShowForm(true);
    setShowLanding(false);
    setErrors([]);
  }

  function submitNeed(description: string) {
    const firstSentence = description.split(/[.!?\n]/).map((part) => part.trim()).find(Boolean) ?? description;
    const title = firstSentence.split(/\s+/).slice(0, 7).join(" ").slice(0, 80) || form.title.trim() || "Nouveau projet";
    const preparedForm: NeedInput = {
      ...form,
      title,
      problem: description,
      desiredOutcome: form.desiredOutcome.trim() || "À clarifier avec vous",
      budget: "À définir",
      urgency: "normal",
    };
    const validation = validateNeed(preparedForm);
    setErrors(validation);
    if (validation.length > 0) return;

    const discovery = analyzeNeed(preparedForm);
    const project: Project = {
      ...preparedForm,
      title,
      id: makeId(),
      createdAt: new Date().toISOString(),
      status: "discovery",
      recommendations: discovery.recommendations.length > 0 ? discovery.recommendations : buildRecommendations(preparedForm),
      discovery,
    };

    setProjects((current) => [project, ...current]);
    setJourneys((current) => ({ ...current, [project.id]: createJourneyRecord(project) }));
    setActiveProjectId(project.id);
    setForm(initialForm);
    setErrors([]);
    setShowForm(false);
    setShowLanding(false);
  }

  function openProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    if (project && !journeys[projectId]) {
      setJourneys((current) => ({ ...current, [projectId]: createJourneyRecord(project) }));
    }
    setActiveProjectId(projectId);
    setShowForm(false);
    setShowLanding(false);
  }

  function updateJourney(projectId: string, update: (current: JourneyRecord) => JourneyRecord) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setJourneys((current) => {
      const record = current[projectId] ?? createJourneyRecord(project);
      return { ...current, [projectId]: update(record) };
    });
  }

  const handleDiscoveryChange = useCallback((selection: DiscoveryQuestionSelection) => {
    if (!activeProject) return;
    updateJourney(activeProject.id, (record) => ({ ...record, discovery: selection }));
  }, [activeProject, projects]);

  function handleDecisionsChange(decisions: ClientJourneyDecisions) {
    if (!activeProject) return;
    updateJourney(activeProject.id, (record) => ({ ...record, decisions }));
  }

  const handleConceptVersionChange = useCallback((versionId: string) => {
    if (!activeProject) return;
    updateJourney(activeProject.id, (record) => ({
      ...record,
      decisions: {
        ...record.decisions,
        selectedConceptId: versionId,
        designValidated: record.decisions.selectedConceptId === versionId ? record.decisions.designValidated : false,
      },
    }));
  }, [activeProject, projects]);

  function handleStageChange(stage: ClientJourneyStage, decisionsOverride?: ClientJourneyDecisions) {
    if (!activeProject || !activeJourney) return;
    const decisions = decisionsOverride ?? activeJourney.decisions;
    const input = {
      projectId: activeProject.id,
      currentStage: activeJourney.state.stage,
      discovery: activeJourney.discovery,
      decisions,
    };
    if (!canEnterJourneyStage(stage, input)) return;
    updateJourney(activeProject.id, (record) => ({
      ...record,
      decisions,
      state: {
        ...record.state,
        stage,
        completedStages: stage === record.state.stage
          ? record.state.completedStages
          : [...new Set([...record.state.completedStages, record.state.stage])],
      },
    }));
  }

  function updateProjectRecommendations(id: string, recommendations: Recommendation[]) {
    setProjects((current) => current.map((project) => project.id === id ? { ...project, recommendations } : project));
  }

  function deleteProject(id: string) {
    if (!window.confirm("Supprimer ce projet enregistré dans ce navigateur ?")) return;
    setProjects((current) => current.filter((project) => project.id !== id));
    setJourneys((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    if (activeProjectId === id) setActiveProjectId(null);
  }

  function openHome() {
    setActiveProjectId(null);
    setShowForm(false);
    setErrors([]);
  }

  if (showLanding) {
    return (
      <LandingPage
        onStartDiscovery={startDiscovery}
        onOpenWorkspace={() => setShowLanding(false)}
        projectCount={projects.length}
      />
    );
  }

  return (
    <ClientWorkspaceShell
      projects={projects}
      activeProject={activeProject}
      activeStage={showForm ? "home" : workspaceView}
      storageReady={storageReady}
      onCloudProjectsLoaded={mergeCloudProjects}
      onCloudJourneysLoaded={mergeCloudJourneys}
      localJourneys={journeys}
      onOpenHome={openHome}
      onStartProject={() => startDiscovery()}
      onNavigate={handleStageChange}
      onDeleteProject={activeProject ? () => deleteProject(activeProject.id) : undefined}
    >
      {showForm ? (
        <ClientUnderstandingStartStep
          initialTitle={form.title}
          error={errors[0]}
          onSubmit={submitNeed}
          onCancel={openHome}
        />
      ) : activeProject && activeJourney ? (
        <ClientProjectJourney
          project={{ ...activeProject, recommendations: activeProjectRecommendations }}
          stage={activeJourney.state.stage}
          discovery={activeJourney.discovery}
          decisions={activeJourney.decisions}
          onDiscoveryChange={handleDiscoveryChange}
          onDecisionsChange={handleDecisionsChange}
          onRecommendationsChange={(recommendations) => updateProjectRecommendations(activeProject.id, recommendations)}
          onStageChange={handleStageChange}
          onConceptVersionChange={handleConceptVersionChange}
        />
      ) : (
        <ClientProjectHome projects={projects} onStart={() => startDiscovery()} onResume={openProject} />
      )}
    </ClientWorkspaceShell>
  );
}
