const storageKey = "biweekly-management-updates";
const starterUpdates = [
  {
    id: "2026-09-15", title: "15 Sep 2026", period: "15 - 28 Sep 2026",
    summary: "Progress continues across the SKO upgrade, enterprise monitoring, Private 5G monitoring, and TWAMP dashboard activities. The immediate focus is applying the validated SKO workaround, aligning validation plans with JIO and TAC, and closing dashboard testing findings.",
    tasks: [
      { title: "SKO upgrades", owner: "Rishabh / TAC", status: "progress", detail: "Resolved the IP address test failure by validating TAC workaround SR-701292448 on one SKO. The two-stage upgrade completed successfully; proceed with remaining SKOs after required validation." },
      { title: "RJIO TWAMP Enterprise monitoring enhancement", owner: "Rishabh / JIO", status: "progress", detail: "Enhancement planning has started using CPE-side SFPs. JIO responded to the proposed approach; align the test setup, validation plan, and rollout with Mr. Navin." },
      { title: "JIO Private 5G monitoring - Gujarat", owner: "Rishabh / TAC / JIO", status: "progress", detail: "JIO will provide two Azure VMs for SKO and SC. Continue coordination on VM readiness, deployment requirements, and monitoring validation under TAC case SR-701316769." },
      { title: "TWAMP session monitoring dashboards", owner: "Rishabh", status: "progress", detail: "Dashboard development is complete. Testing and bug fixes are in progress." }
    ],
    discussion: ["Confirm the remaining SKO upgrade validation and rollout sequence.", "Agree the TWAMP SFP test setup and validation plan with Mr. Navin.", "Confirm Azure VM readiness and deployment prerequisites for Gujarat Private 5G monitoring."],
    nextSteps: ["Apply the validated TAC workaround to the remaining SKO upgrades.", "Finalize the RJIO TWAMP Enterprise test and rollout plan.", "Validate the Gujarat VM deployment and resolve TWAMP dashboard test findings."]
  },
  {
    id: "2026-09-01", title: "01 Sep 2026", period: "01 - 14 Sep 2026",
    summary: "Established the reporting baseline and completed the first pass of KPI mapping. The next cycle will concentrate on validation and operational readiness.",
    tasks: [
      { title: "KPI inventory", owner: "Rishabh", status: "complete", detail: "Consolidated available circuit, hostname, and RT KPI source files." },
      { title: "Mapping rules", owner: "Rishabh", status: "complete", detail: "Implemented the initial enterprise circuit matching rules." },
      { title: "Stakeholder validation", owner: "Project team", status: "progress", detail: "Reviewing report definitions and exception categories." }
    ],
    discussion: ["Validate KPI definitions with operations.", "Confirm the production reporting cadence."],
    nextSteps: ["Address validation findings.", "Prepare operational handover material."]
  }
];

let updates = JSON.parse(localStorage.getItem(storageKey) || "null") || starterUpdates;
let currentId = new URLSearchParams(location.search).get("update") || updates[0].id;
let activeFilter = "all";
const $ = (selector) => document.querySelector(selector);

function currentUpdate() { return updates.find((update) => update.id === currentId) || updates[0]; }
function statusLabel(status) { return status === "progress" ? "In progress" : status === "blocked" ? "Needs input" : "Complete"; }
function refreshIcons() { window.lucide?.createIcons(); }

function render() {
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
  if (!isNew) Object.assign(form.elements, { title: { value: update.title }, period: { value: update.period }, summary: { value: update.summary }, tasks: { value: taskLines(update.tasks) }, discussion: { value: update.discussion.join("\n") }, nextSteps: { value: update.nextSteps.join("\n") } });
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