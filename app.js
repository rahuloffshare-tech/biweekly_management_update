const storageKey = "biweekly-management-updates";
const starterUpdates = [   {     id: "2026-09-30", title: "30 Sep 2026", period: "30 Sep 2026",     summary: "Evaluating JIO Agentic AI PCA connectivity options and validating IPv4/IPv6 dual stack. The legacy PCA Onboard orchestrator was rejected by the customer. Private 5G VM setup is complete; network connectivity and routing dependencies remain in progress.",     tasks: [       { title: "JIO - Agentic AI", owner: "Rahul / JIO NPE / Waquar", status: "progress", detail: "Evaluating two SFP-to-Agentic PCA connectivity options with the JIO NPE team and Waquar: Delhi sensor reachability versus Nagpur sensor onboarding. Validating PCA IPv4/IPv6 dual stack. The customer rejected the legacy PCA Onboard orchestrator; this was conveyed to the Cisco AI team on the daily call." },       { title: "JIO - Private 5G", owner: "Rahul / JIO internal teams", status: "progress", detail: "VM setup is completed and ready from our end. Actively collaborating with internal JIO teams to close pending network connectivity and routing dependencies." },  { title: "New PCA deployment - 10K session support", owner: "Pooja", status: "progress", detail: "Supporting the new PCA deployment designed to support 10K sessions." }, { title: "PCA + CNC integration architecture changes", owner: "Pooja", status: "progress", detail: "Supporting changes to the existing PCA setup for the PCA + CNC integration architecture, including use of the built-in PCA orchestrator for session provisioning from CNC during session creation or modification." }, { title: "TWAMP platform upgrade", owner: "Rahul", status: "progress", detail: "Completed the transition from XML-based to CSV-based data collection and validated it on both JCP and CNAAP NMS platforms, ensuring compatibility and continuity for the planned TWAMP upgrades. Proceeding with the TWAMP software upgrade as planned. Each listed IP requires an approximately 2-hour maintenance window; associated TWAMP services may be temporarily interrupted or unavailable during this period. The upgrade aims to improve stability, supportability, and operational efficiency." },  { title: "New PCA deployment - 10K session support", owner: "Pooja", status: "progress", detail: "Supporting the new PCA deployment designed to support 10K sessions." }, { title: "PCA + CNC integration architecture changes", owner: "Pooja", status: "progress", detail: "Supporting changes to the existing PCA setup for the PCA + CNC integration architecture, including use of the built-in PCA orchestrator for session provisioning from CNC during session creation or modification." }      ],     discussion: [],     nextSteps: []   },
  {
    id: "2026-09-15", title: "15 Sep 2026", period: "15 - 28 Sep 2026",
    summary: "Progress continues across the SKO upgrade, enterprise monitoring, Private 5G monitoring, and TWAMP dashboard activities. The immediate focus is applying the validated SKO workaround, aligning validation plans with JIO and TAC, and closing dashboard testing findings.",
    tasks: [
      { title: "SKO upgrades", owner: "Rahul / TAC", status: "progress", detail: "Resolved the IP address test failure by validating TAC workaround SR-701292448 on one SKO. The two-stage upgrade completed successfully; proceed with remaining SKOs after required validation." },
      { title: "RJIO TWAMP Enterprise monitoring enhancement", owner: "Rahul / JIO", status: "progress", detail: "Enhancement planning has started using CPE-side SFPs. JIO responded to the proposed approach; align the test setup, validation plan, and rollout with Mr. Navin." },
      { title: "JIO Private 5G monitoring - Gujarat", owner: "Rahul / TAC / JIO", status: "progress", detail: "JIO will provide two Azure VMs for SKO and SC. Continue coordination on VM readiness, deployment requirements, and monitoring validation under TAC case SR-701316769." },
      { title: "TWAMP session monitoring dashboards", owner: "Rahul", status: "progress", detail: "Dashboard development is complete. Testing and bug fixes are in progress." },  { title: "New PCA deployment - 10K session support", owner: "Pooja", status: "progress", detail: "Supporting the new PCA deployment designed to support 10K sessions." }, { title: "PCA + CNC integration architecture changes", owner: "Pooja", status: "progress", detail: "Supporting changes to the existing PCA setup for the PCA + CNC integration architecture, including use of the built-in PCA orchestrator for session provisioning from CNC during session creation or modification." }, { title: "TWAMP platform upgrade", owner: "Rahul", status: "progress", detail: "Completed the transition from XML-based to CSV-based data collection and validated it on both JCP and CNAAP NMS platforms, ensuring compatibility and continuity for the planned TWAMP upgrades. Proceeding with the TWAMP software upgrade as planned. Each listed IP requires an approximately 2-hour maintenance window; associated TWAMP services may be temporarily interrupted or unavailable during this period. The upgrade aims to improve stability, supportability, and operational efficiency." }
    ],
    discussion: ["Confirm the remaining SKO upgrade validation and rollout sequence.", "Agree the TWAMP SFP test setup and validation plan with Mr. Navin.", "Confirm Azure VM readiness and deployment prerequisites for Gujarat Private 5G monitoring."],
    nextSteps: ["Apply the validated TAC workaround to the remaining SKO upgrades.", "Finalize the RJIO TWAMP Enterprise test and rollout plan.", "Validate the Gujarat VM deployment and resolve TWAMP dashboard test findings."]
  }
]

const savedUpdates = JSON.parse(localStorage.getItem(storageKey) || "null"); let updates = savedUpdates   ? [       ...starterUpdates.filter((item) => !savedUpdates.some((update) => update.id === item.id)),       ...savedUpdates         .filter((update) => update.id !== "2026-09-01")         .map((update) => {           if (update.id !== "2026-09-30") return update;           const savedTasks = update.tasks || [];                      return { ...update, tasks: savedTasks.filter((task) => task.title !== "TWAMP platform upgrade - JCP and CNAAP") };         })     ]   : starterUpdates;
updates = updates.map((update) => { if (update.id !== "2026-09-30" && update.id !== "2026-09-15") return update; const starterUpdate = starterUpdates.find((item) => item.id === update.id); const twampTask = starterUpdate.tasks.find((task) => task.title === "TWAMP platform upgrade"); const tasks = update.tasks || []; return tasks.some((task) => task.title === twampTask.title) ? update : { ...update, tasks: [...tasks, twampTask] }; }); updates = updates.map((update) => ({ ...update, tasks: (update.tasks || []).map((task) => ({ ...task, owner: (task.owner || "").replace("Rahul", "Rahul") })) })); updates = updates.map((update) => { if (update.id !== "2026-09-30") return update; const starterUpdate = starterUpdates.find((item) => item.id === update.id); const tasks = update.tasks || []; const missingTasks = starterUpdate.tasks.filter((starterTask) => !tasks.some((task) => task.title === starterTask.title)); return missingTasks.length ? { ...update, tasks: [...tasks, ...missingTasks] } : update; }); updates = updates.map((update) => { if (update.id !== "2026-09-30" && update.id !== "2026-09-15") return update; const starterUpdate = starterUpdates.find((item) => item.id === update.id); const tasks = update.tasks || []; const missingTasks = starterUpdate.tasks.filter((starterTask) => !tasks.some((task) => task.title === starterTask.title)); return missingTasks.length ? { ...update, tasks: [...tasks, ...missingTasks] } : update; }); updates = updates.map((update) => ({ ...update, tasks: Array.from(new Map((update.tasks || []).map((task) => [task.title, task])).values()) })); updates = updates.map((update) => ({ ...update, tasks: (update.tasks || []).filter((task) => task.title !== "TWAMP platform upgrade - JCP and CNAAP") })); updates = updates.map((update) => ({ ...update, tasks: (update.tasks || []).filter((task) => task.title !== "TWAMP Dashboard") })); const removedTaskTitlesByEdition = {
  "2026-09-30": new Set(["PCA + CNC integration architecture changes"]),
  "2026-09-15": new Set(["SKO upgrades"])
};
updates = updates.map((update) => {
  const removedTaskTitles = removedTaskTitlesByEdition[update.id];
  return removedTaskTitles ? { ...update, tasks: (update.tasks || []).filter((task) => !removedTaskTitles.has(task.title)) } : update;
});
updates = updates.map((update) => {
  if (update.id !== "2026-09-30" && update.id !== "2026-09-15") return update;
  const task = { title: "TWAMP session monitoring dashboards", owner: "Rahul", status: "progress", detail: "Dashboard development is complete. Testing and bug fixes are in progress." };
  const tasks = update.tasks || [];
  return tasks.some((item) => item.title === task.title) ? update : { ...update, tasks: [...tasks, task] };
});
localStorage.setItem(storageKey, JSON.stringify(updates));
const canonicalAgenticTask = { title: "JIO - Agentic AI - CA-CNC", owner: "Pooja and Rahul / JIO teams", status: "progress", detail: "Evaluating two SFP-to-Agentic PCA connectivity options with the JIO NPE team and Waqar. Delhi sensor reachability versus Nagpur sensor onboarding. Validating PCA IPv4/IPv6 dual stack. The customer rejected the legacy PCA Onboard orchestrator; this was conveyed to the Cisco AI team on the daily call." };
updates = updates.map((update) => {
  if (update.id !== "2026-09-30") return update;
  const tasks = (update.tasks || []).filter((task) => task.title !== "JIO - Agentic AI");
  const hasCanonicalTask = tasks.some((task) => task.title === canonicalAgenticTask.title);
  return { ...update, tasks: hasCanonicalTask ? tasks.map((task) => task.title === canonicalAgenticTask.title ? canonicalAgenticTask : task) : [...tasks, canonicalAgenticTask] };
});
const requestedUpdate = new URLSearchParams(location.search).get("update");
let currentId = requestedUpdate || updates[0].id;
let activeFilter = "all";
const $ = (selector) => document.querySelector(selector);

function currentUpdate() { return updates.find((update) => update.id === currentId) || updates[0]; }
function statusLabel(status) { return status === "progress" ? "In progress" : status === "blocked" ? "Needs input" : "Complete"; }
function refreshIcons() { window.lucide?.createIcons(); }

function renderArchive() { const cards = updates.slice(0, 5).map((update, index) => { const topics = (update.tasks || []).map((task) => "<li>" + task.title + "</li>").join(""); return "<article class=\"archive-card\"><div class=\"archive-copy\"><div class=\"archive-date\">" + update.title + (index === 0 ? " <span class=\"archive-latest\">LATEST</span>" : "") + "</div><ul class=\"archive-topics\">" + topics + "</ul></div><button class=\"archive-open\" type=\"button\" data-update-id=\"" + update.id + "\">Open &#8594;</button></article>"; }).join(""); document.title = "Bi Weekly updates JIO - Updates Archive"; document.body.innerHTML = "<style>body{background:#08151f}.archive-shell{width:min(100% - 32px,1120px);margin:20px auto 32px;background:#14232f;border-radius:12px;overflow:hidden;box-shadow:0 14px 34px rgba(27,39,52,.12)}.archive-hero{padding:42px 58px 34px;color:#fff;background:linear-gradient(110deg,#101820,#1b2734 60%,#005073);border-bottom:5px solid #00bceb}.archive-hero h1{margin:0 0 8px;font-size:clamp(28px,4vw,40px)}.archive-hero p{margin:0;color:#c6d7e1;font-size:19px}.archive-content{background:#14232f;padding:40px 58px 54px}.archive-content h2{margin:0 0 20px;color:#596673;text-transform:uppercase}.archive-card{background:#172936;color:#e6f1f5;display:flex;align-items:center;gap:24px;padding:20px 24px 20px 28px;border:1px solid #d7dee3;border-left:5px solid #00bceb;border-radius:10px;box-shadow:0 7px 15px rgba(31,58,77,.08)}.archive-copy{min-width:0;flex:1}.archive-date{font-size:23px;font-weight:700}.archive-topics{margin:8px 0 0;padding-left:22px;color:#a9bdc8;font-size:17px;line-height:1.55}.archive-topics li::marker{color:#049fd9}.archive-latest{margin-left:8px;padding:4px 10px;border-radius:999px;background:#e3f3eb;color:#438461;font-size:12px}.archive-open{border:0;border-radius:9px;padding:13px 25px;color:#fff;background:#049fd9;font:inherit;font-size:17px;font-weight:700}.archive-footer{margin-top:54px;padding:18px;color:#b8cad4;background:#101820;text-align:center}@media(max-width:640px){.archive-shell{width:calc(100% - 20px);margin:10px auto}.archive-hero,.archive-content{padding-left:24px;padding-right:24px}.archive-card{align-items:flex-start;flex-direction:column}.archive-open{width:100%}}</style><main class=\"archive-shell\"><header class=\"archive-hero\"><h1>Bi Weekly updates JIO - Updates Archive</h1><p>Consolidated account &amp; project updates, published every two weeks</p></header><section class=\"archive-content\"><h2>Editions</h2><div>" + cards + "</div></section><footer class=\"archive-footer\">Confidential - Internal Use Only &nbsp;•&nbsp; Prepared by Rahul and Pooja</footer></main>"; document.querySelectorAll(".archive-open").forEach((button) => button.addEventListener("click", () => { location.href = location.pathname + "?update=" + button.dataset.updateId; })); }
function render()
{
  const update = currentUpdate();
  currentId = update.id;
  $("#edition-select").innerHTML = updates.map((item, index) => `<option value="${item.id}">${item.title}${index === 0 ? " - latest" : ""}</option>`).join("");
  $("#edition-select").value = update.id;
  $("#period-label").textContent = update.period.toUpperCase();
  $("#update-title").textContent = update.title;
  $("#executive-note").textContent = update.summary;
  $("#edition-badge").hidden = updates.indexOf(update) !== 0;
  ["complete", "progress", "blocked"].forEach((status) => { const countId = status === "complete" ? "completed" : status === "progress" ? "in-progress" : status; $("#" + countId + "-count").textContent = update.tasks.filter((task) => task.status === status).length; });
  const tasks = activeFilter === "all" ? update.tasks : update.tasks.filter((task) => task.status === activeFilter);
  $("#task-list").innerHTML = tasks.map((task) => `<article class="task ${task.status}"><span class="task-bar"></span><div><h3>${task.title}</h3><p>${task.detail}</p></div><span class="owner">${task.owner}</span><span class="status task-status ${task.status}">${statusLabel(task.status)}</span></article>`).join("") || "<p class=\"executive-note\">No tasks match this filter.</p>";
  $("#discussion-list").innerHTML = update.discussion.map((item) => `<li>${item}</li>`).join("");
  $("#next-list").innerHTML = update.nextSteps.map((item) => `<li>${item}</li>`).join("");
  history.replaceState({}, "", `${location.pathname}?update=${encodeURIComponent(update.id)}`);
  refreshIcons();
}

function saveUpdates() { localStorage.setItem(storageKey, JSON.stringify(updates)); }
function toast(message) { $("#toast").textContent = message; $("#toast").classList.add("visible"); setTimeout(() => $("#toast").classList.remove("visible"), 2400); }
function listLines(text) { return text.split("\n").map((item) => item.trim()).filter(Boolean); }
function taskLines(tasks) { return tasks.map((task) => `${task.title} | ${task.owner} | ${task.status} | ${task.detail}`).join("\n"); }

function openEditor(isNew) {
  const update = currentUpdate(); const form = $("#update-form"); form.reset(); form.dataset.mode = isNew ? "new" : "edit";
  $("#dialog-title").textContent = isNew ? "New bi-weekly update" : "Edit bi-weekly update";
  if (!isNew) {
    const setField = (name, value) => {
      const field = form.elements.namedItem(name);
      if (field) field.value = value ?? "";
    };
    setField("title", update.title);
    setField("period", update.period);
    setField("summary", update.summary);
    setField("tasks", taskLines(update.tasks));
    setField("discussion", update.discussion.join("\n"));
    setField("nextSteps", update.nextSteps.join("\n"));
  }
  $("#editor-dialog").showModal(); refreshIcons();
}

$("#edition-select").addEventListener("change", (event) => { currentId = event.target.value; activeFilter = "all"; document.querySelectorAll(".filter").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all")); render(); });
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.filter; document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button)); render(); }));
$("#new-update").addEventListener("click", () => openEditor(true)); $("#edit-update").addEventListener("click", () => openEditor(false));
$("#close-dialog").addEventListener("click", () => $("#editor-dialog").close()); $("#cancel-dialog").addEventListener("click", () => $("#editor-dialog").close());
$("#update-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const parsedTasks = listLines(form.get("tasks")).map((line) => { const [title, owner, status, detail] = line.split("|").map((part) => part.trim()); return { title, owner: owner || "Unassigned", status: ["complete", "progress", "blocked"].includes(status) ? status : "progress", detail: detail || "" }; }).filter((task) => task.title); const item = { id: event.currentTarget.dataset.mode === "new" ? `${Date.now()}` : currentId, title: form.get("title"), period: form.get("period"), summary: form.get("summary"), tasks: parsedTasks, discussion: listLines(form.get("discussion")), nextSteps: listLines(form.get("nextSteps")) }; if (event.currentTarget.dataset.mode === "new") { updates.unshift(item); } else { updates = updates.map((update) => update.id === currentId ? item : update); } currentId = item.id; saveUpdates(); $("#editor-dialog").close(); render(); toast("Update saved on this browser."); });
$("#copy-link").addEventListener("click", async () => { try { await navigator.clipboard.writeText(location.href); toast("Page link copied."); } catch { toast("Copy the link from your browser address bar."); } });
$("#export-data").addEventListener("click", () => { const download = document.createElement("a"); download.href = URL.createObjectURL(new Blob([JSON.stringify(updates, null, 2)], { type: "application/json" })); download.download = "biweekly-updates.json"; download.click(); URL.revokeObjectURL(download.href); });
render();
