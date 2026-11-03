export interface ExecutionGraphTask{id:string;dependencyIds:readonly string[]}
export function orderExecutionTasks(tasks:readonly ExecutionGraphTask[]):string[]{
 const byId=new Map<string,ExecutionGraphTask>();for(const task of tasks){if(!task.id.trim())throw new Error("Task identifier required.");if(byId.has(task.id))throw new Error("Duplicate task identifier.");byId.set(task.id,task);}
 for(const task of tasks)for(const dep of task.dependencyIds)if(!byId.has(dep)||dep===task.id)throw new Error("Invalid task dependency.");
 const pending=new Map<string,Set<string>>(),dependents=new Map<string,string[]>();for(const task of tasks){pending.set(task.id,new Set(task.dependencyIds));for(const dep of task.dependencyIds){const list=dependents.get(dep)??[];list.push(task.id);dependents.set(dep,list);}}
 const ready=[...byId.keys()].filter(id=>pending.get(id)?.size===0).sort(),ordered:string[]=[];
 while(ready.length){const id=ready.shift();if(!id)continue;ordered.push(id);for(const child of dependents.get(id)??[]){const deps=pending.get(child);deps?.delete(id);if(deps?.size===0){ready.push(child);ready.sort();}}}
 if(ordered.length!==tasks.length)throw new Error("Cyclic task dependencies.");return ordered;
}