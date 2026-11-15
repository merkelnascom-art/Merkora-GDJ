import type { ConversationMessage, NeedDimension, NeedEvidence, QuestionCandidate, ValidationDecision } from "./types";
export type IntentKind = "organize_event"|"reservation"|"invitation"|"request"|"create_project"|"invention"|"improve"|"solve"|"explore"|"unknown";
export type UnderstandingStage = "clarification"|"summary_validation"|"complete";
export interface UnderstandingSession {
 id:string;conversationId:string;originalDescription:string;intentKind:IntentKind;messages:ConversationMessage[];
 evidence:NeedEvidence[];validations:ValidationDecision[];askedQuestionIds:string[];deferredDimensions:NeedDimension[];
 stage:UnderstandingStage;pendingQuestion:QuestionCandidate|null;summary?:string;version:number;intentClues:string[];
 privacyConsiderations:string[];contradictions:{topic:string;statementA:string;statementB:string;question:string;confirmationRequired:boolean}[];
 resolvedContradictionKeys:string[];deferredContradictionKeys:string[];
}
let seq=0;const makeId=(p:string)=>p+"-"+Date.now()+"-"+(++seq);const now=()=>new Date().toISOString();
const extractors:Array<[NeedDimension,RegExp]>=[
 ["project_scope",/(?:ça s'appelle|cela s'appelle|le projet s'appelle|nommé|nommée)\s*[:«]?\s*[^.!?\n]+/i],
 ["problem",/(?:j'ai remarqué que|le problème (?:est que|:)|la difficulté (?:est que|:)|ils ne savent pas|elles ne savent pas|se perdent|n'arriv\w* pas|manque de|stress\w*|frustr\w*|désorganis\w*|retard\w*)[^.!?\n]*/i],
 ["goal",/(?:ce que je veux|je souhaite|mon objectif|le but est|afin de|pour leur permettre de|pour permettre à)[^.!?\n]*/i],
 ["preference",/(?:application|plateforme|logiciel|site web|outil|jeu|système|service|agent|agence|solution)[^.!?\n]*/i],
 ["audience",/(?:élèves|étudiants|apprenants|jeunes|clients|patients|joueurs|visiteurs|voyageurs|membres|employés|enseignants)[^.!?\n]*/i],
 ["feature",/(?:par des questions|des tests|questionnaire|quiz|relevés|notes|analyse|propose(?:r)?|réservation|notification|paiement|choisir|sélectionner|défile|disparaît|réapparaît)[^.!?\n]*/i],
 ["context",/(?:après le bac|après leur bac|à l'école|dans les écoles|en ligne|sur place|à domicile|sans connexion|sans compte)[^.!?\n]*/i],
 ["resource",/(?:relevés|bulletins|documents|photos|fichiers|notes|données|téléphone|ordinateur|internet)[^.!?\n]*/i],
 ["constraint",/(?:sans connexion|sans compte|obligatoire|budget|délai|gratuit|limite|confidentiel|autorisation|consentement)[^.!?\n]*/i],
 ["cause",/(?:parce que|car|à cause de|puisque|en raison de)[^.!?\n]*/i]
];
function addEvidence(all:NeedEvidence[],d:NeedDimension,v:string,m:ConversationMessage,q=v):NeedEvidence[]{
 const value=v.trim();if(!value||all.some(e=>e.dimension===d&&e.value.toLowerCase()===value.toLowerCase()))return all;
 return [...all,{id:makeId("evidence"),dimension:d,value,status:"user_stated",sourceMessageId:m.id,sourceQuote:q,confidence:.86,createdAt:now()}];
}
function extract(text:string,m:ConversationMessage,prior:NeedEvidence[]):NeedEvidence[]{
 let out=prior;
 for(const [d,re] of extractors){const match=text.match(re);if(!match)continue;let value=match[0];
  if(d==="project_scope")value=value.replace(/^(?:ça s'appelle|cela s'appelle|le projet s'appelle|nommé|nommée)\s*[:«]?\s*/i,"").replace(/[»"]$/,"").trim();
  out=addEvidence(out,d,value,m,match[0]);
 }
 const actor=text.match(/(?:les élèves|des élèves|aux élèves|les jeunes|des jeunes|les étudiants|les apprenants|les joueurs|les clients|les patients)/i);
 if(actor)out=addEvidence(out,"actor",actor[0],m,actor[0]);
 const noContext=text.match(/(?:pas de cadre particulier|aucun contexte|pas de contexte précis|accessible à tous)/i);
 if(noContext)out=addEvidence(out,"context",noContext[0],m,noContext[0]);
 return out;
}
function classify(text:string):IntentKind{
 const t=text.toLocaleLowerCase("fr");
 if(/réserv|reservation|réserver|rendez-vous|booking/.test(t))return "reservation";
 if(/organiser|organisation/.test(t)&&/anniversaire|fête|soirée|mariage|événement/.test(t))return "organize_event";
 if(/inviter|invitation|convier/.test(t))return "invitation";
 if(/demande|solliciter|requête/.test(t))return "request";
 if(/invention|inventer|nouvelle invention/.test(t))return "invention";
 if(/j'ai une idée|j’ai une idée|idée à développer|idée à explorer|je veux imaginer|je réfléchis/.test(t)&&!/(?:application|plateforme|jeu|site web|logiciel)/.test(t))return "explore";
 if(/créer|creer|concevoir|développer|developper|lancer|mettre en place/.test(t))return "create_project";
 if(/améliorer|optimiser|moderniser/.test(t))return "improve";
 if(/problème|difficulté|résoudre|retard|désorganis/.test(t))return "solve";
 return "unknown";
}
function newMessage(cid:string,role:ConversationMessage["role"],content:string):ConversationMessage{return{id:makeId("message"),conversationId:cid,role,content,createdAt:now()};}
function makeQuestion(d:NeedDimension,prompt:string,why:string):QuestionCandidate{return{id:"missing-"+d+"-v2",dimension:d,prompt,rationale:why,impact:.9,uncertainty:.8,decisionRelevance:.9,answerability:.9};}
const REPAIR=/(tu n'as pas (?:encore )?compris|tu n’as pas (?:encore )?compris|tu ne comprends pas|tu ne me comprends pas|tu ne me suis pas|tu m'écoutes pas|tu m’écoutes pas|tu es à côté)/i;
function makeSummary(s:UnderstandingSession):string{
 const labels:Partial<Record<NeedDimension,string>>={project_scope:"Nom du projet",problem:"Situation et problème",goal:"Objectif",preference:"Solution envisagée",audience:"Public concerné",actor:"Personnes et rôles",feature:"Fonctionnement et fonctionnalités",context:"Cadre",resource:"Données et ressources",constraint:"Contraintes",cause:"Causes"};
 const order:NeedDimension[]=["project_scope","problem","audience","goal","preference","feature","context","resource","constraint","cause","actor"];
 const lines=order.flatMap(d=>{const items=s.evidence.filter(e=>e.dimension===d);return items.length?[labels[d]||d,...items.map(e=>"• "+e.value)]:[];});
 return ["Voici ce que j'ai compris à partir de l'ensemble de ton récit. Les informations ci-dessous viennent de tes propres messages.","","Description initiale : « "+s.originalDescription+" »","",...lines,"","Les informations absentes restent à préciser. Je ne les transforme pas en faits et je ne te redemanderai pas ce que tu as déjà expliqué.","","Cette compréhension est provisoire : tu peux la corriger ou la confirmer."].join("\n");
}
function advance(s:UnderstandingSession):UnderstandingSession{
 const last=s.messages.filter(m=>m.role==="visitor").at(-1)?.content||"";
 if(REPAIR.test(last)){
  const q=makeQuestion("unknown","Tu as raison : ma réponse précédente n'a pas exploité ce que tu avais déjà expliqué. Qu'ai-je déformé ou laissé de côté ?","Réparer le décalage sans traiter ta remarque comme une donnée métier.");
  return {...s,pendingQuestion:q,stage:"clarification",messages:[...s.messages,newMessage(s.conversationId,"merkora","Je reconnais le décalage. Je reprends ton récit complet. "+q.prompt)],version:s.version+1};
 }
 const has=(d:NeedDimension)=>s.evidence.some(e=>e.dimension===d);
 const rich=(has("problem")||has("goal"))&&(has("preference")||has("feature"))&&(has("audience")||has("context")||has("resource"));
 if(rich){const text=makeSummary(s);return{...s,pendingQuestion:null,stage:"summary_validation",summary:text,version:s.version+1,messages:[...s.messages,newMessage(s.conversationId,"merkora",text)]};}
 if(s.intentKind==="explore"&&!has("problem")&&!has("goal")&&!has("preference")&&!has("feature")){
  const q=makeQuestion("unknown","Raconte-moi ton idée avec tes propres mots. Tu peux tout expliquer librement : ce que tu imagines, pourquoi, pour qui et comment tu voudrais que cela fonctionne.","Tu as annoncé une idée, mais tu ne l'as pas encore décrite. Je t'invite à l'exposer librement avant toute question de détail.");
  return {...s,pendingQuestion:q,stage:"clarification",askedQuestionIds:[...s.askedQuestionIds,q.id],version:s.version+1,messages:[...s.messages,newMessage(s.conversationId,"merkora",q.prompt)]};
 }
 const missing:Array<[NeedDimension,string,string]>=[
 ["problem","Quelle situation précise veux-tu changer ou quel problème veux-tu résoudre ?","Le problème central n'est pas encore explicite."],
 ["goal","Quel résultat concret aimerais-tu obtenir ?","Le résultat attendu reste à préciser."],
 ["preference","As-tu déjà imaginé une forme de solution, ou souhaites-tu que nous l'explorions ?","La forme de solution reste inconnue."],
 ["audience","Qui utilisera cette solution ou en bénéficiera ?","Le public n'est pas encore identifié."],
 ["feature","Comment imagines-tu que cela fonctionne, étape par étape ?","Le fonctionnement n'est pas encore assez détaillé."],
 ["context","Dans quel cadre ou environnement cela devra-t-il fonctionner ?","Le contexte peut changer la conception."],
 ];
 const next=missing.find(([d])=>!has(d)&&!s.deferredDimensions.includes(d));
 if(!next){const text=makeSummary(s);return{...s,pendingQuestion:null,stage:"summary_validation",summary:text,version:s.version+1,messages:[...s.messages,newMessage(s.conversationId,"merkora",text)]};}
 const q=makeQuestion(next[0],next[1],next[2]);
 return{...s,pendingQuestion:q,stage:"clarification",askedQuestionIds:[...s.askedQuestionIds,q.id],version:s.version+1,messages:[...s.messages,newMessage(s.conversationId,"merkora",q.prompt)]};
}
export function beginUnderstanding(raw:string):UnderstandingSession{
 const text=raw.trim();if(!text)throw new Error("A first description is required.");
 const cid=makeId("conversation"),first=newMessage(cid,"visitor",text);
 const s:UnderstandingSession={id:makeId("understanding"),conversationId:cid,originalDescription:text,intentKind:classify(text),messages:[first],evidence:extract(text,first,[]),validations:[],askedQuestionIds:[],deferredDimensions:[],stage:"clarification",pendingQuestion:null,version:1,intentClues:[],privacyConsiderations:[],contradictions:[],resolvedContradictionKeys:[],deferredContradictionKeys:[]};
 return advance(s);
}
export function answerUnderstanding(s:UnderstandingSession,answer:string):UnderstandingSession{
 const text=answer.trim();if(!text||s.stage!=="clarification"||!s.pendingQuestion)return s;
 const visitor=newMessage(s.conversationId,"visitor",text);
 const evidence=extract(text,visitor,s.evidence);
 const hasPending=evidence.some(e=>e.dimension===s.pendingQuestion?.dimension&&e.sourceMessageId===visitor.id);
 const complete=hasPending?evidence:addEvidence(evidence,s.pendingQuestion.dimension,text,visitor,text);
 return advance({...s,messages:[...s.messages,visitor],evidence:complete,pendingQuestion:null,version:s.version+1});
}
export function deferUnderstandingQuestion(s:UnderstandingSession):UnderstandingSession{
 if(!s.pendingQuestion)return s;
 return advance({...s,deferredDimensions:[...s.deferredDimensions,s.pendingQuestion.dimension],pendingQuestion:null,messages:[...s.messages,newMessage(s.conversationId,"merkora","D'accord, je garde ce point en attente sans inventer de réponse.")],version:s.version+1});
}
export function decideUnderstandingSummary(s:UnderstandingSession,decision:"confirmed"|"corrected"|"rejected"|"deferred",correction?:string):UnderstandingSession{
 if(!s.summary)throw new Error("No summary to validate.");
 const validation:ValidationDecision={id:makeId("validation"),conversationId:s.conversationId,subject:"understanding_summary",presentedText:s.summary,decision,correction,evidenceIds:s.evidence.map(e=>e.id),createdAt:now()};
 if(decision==="corrected"&&correction?.trim()){const m=newMessage(s.conversationId,"visitor",correction.trim());return advance({...s,messages:[...s.messages,m],evidence:extract(correction.trim(),m,s.evidence),validations:[...s.validations,validation],stage:"clarification",summary:undefined,version:s.version+1});}
 return {...s,validations:[...s.validations,validation],evidence:decision==="confirmed"?s.evidence.map(e=>({...e,status:"validated"})):s.evidence,stage:"complete",summary:decision==="confirmed"?s.summary.replace("provisoire","validée"):s.summary,version:s.version+1,messages:[...s.messages,newMessage(s.conversationId,"merkora",decision==="confirmed"?"Merci. Tu as confirmé cette compréhension.":"Compréhension conservée sans validation.")]};
}
