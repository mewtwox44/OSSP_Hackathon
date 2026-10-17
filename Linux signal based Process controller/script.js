cat > dashboard/script.js <<'EOF'
const statusValue = document.getElementById("statusValue");
const statusHint = document.getElementById("statusHint");
const pidValue = document.getElementById("pidValue");
const actionCount = document.getElementById("actionCount");
const stateTag = document.getElementById("stateTag");
const stateIndicator = document.getElementById("stateIndicator");
const consoleBox = document.getElementById("console");
const activityList = document.getElementById("activityList");

let actions = 0;

function timestamp() {
    return new Date().toLocaleTimeString();
}

function addConsole(message) {
    const line = document.createElement("p");
    const time = document.createElement("span");

    time.className = "console-time";
    time.textContent = timestamp();
    line.append(time, document.createTextNode(" " + message));
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

function addActivity(action, detail) {
    if (activityList.querySelector(".empty-state")) {
        activityList.innerHTML = "";
    }

    const item = document.createElement("div");
    item.className = "activity-item";

    const mark = document.createElement("div");
    mark.className = "activity-mark";
    mark.textContent = "✓";

    const text = document.createElement("div");
    text.className = "activity-text";

    const title = document.createElement("strong");
    title.textContent = action;

    const subtitle = document.createElement("span");
    subtitle.textContent = `${detail} · ${timestamp()}`;

    text.append(title, subtitle);
    item.append(mark, text);
    activityList.prepend(item);
}

function updateStatus(data) {
    const status = data.status || "Not started";

    statusValue.textContent = status;
    pidValue.textContent = data.pid ?? "—";
    stateTag.textContent = status.toUpperCase();

    const colors = {
        "Running": "#43d9a3",
        "Sleeping": "#7c8cff",
        "Paused": "#ffbf69",
        "Waiting": "#ffbf69",
        "Terminated": "#ff7085",
        "Not started": "#677186"
    };

    const color = colors[status] || "#677186";
    stateIndicator.style.background = color;
    stateIndicator.style.boxShadow = `0 0 12px ${color}44`;

    const hints = {
        "Running": "Worker is active",
        "Sleeping": "Worker is waiting",
        "Paused": "Worker stopped by SIGSTOP",
        "Waiting": "Worker waiting for I/O",
        "Terminated": "Worker has stopped",
        "Not started": "Start a worker to begin"
    };

    statusHint.textContent = hints[status] || "Linux process status";
}

async function refreshStatus() {
    try {
        const response = await fetch("/api/status", { cache: "no-store" });
        if (!response.ok) throw new Error("Status request failed");

        const data = await response.json();
        updateStatus(data);
    } catch (error) {
        statusValue.textContent = "Offline";
        statusHint.textContent = "Start the C server to reconnect";
        addConsole("Cannot connect to the C server.");
    }
}

async function runAction(action) {
    try {
        const response = await fetch(`/api/${action}`, {
            method: "POST",
            cache: "no-store"
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            addConsole(data.message || "The action failed.");
            await refreshStatus();
            return;
        }

        actions++;
        actionCount.textContent = actions;

        addConsole(data.message);
        addActivity(action.toUpperCase(), data.message);

        await refreshStatus();
    } catch (error) {
        addConsole("Request failed. Check that the C server is running.");
    }
}

document.getElementById("startBtn")
    .addEventListener("click", () => runAction("start"));

document.getElementById("pauseBtn")
    .addEventListener("click", () => runAction("pause"));

document.getElementById("resumeBtn")
    .addEventListener("click", () => runAction("resume"));

document.getElementById("terminateBtn")
    .addEventListener("click", () => runAction("terminate"));

document.getElementById("restartBtn")
    .addEventListener("click", () => runAction("restart"));

refreshStatus();
setInterval(refreshStatus, 2000);
EOF
