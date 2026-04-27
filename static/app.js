const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const transactionDateInput = document.getElementById("transaction-date");
const submitTransactionBtn = document.getElementById("submit-transaction");
const cancelEditTransactionBtn = document.getElementById("cancel-edit-transaction");
const incomeValue = document.getElementById("income-value");
const expenseValue = document.getElementById("expense-value");
const balanceValue = document.getElementById("balance-value");
const transactionsList = document.getElementById("transactions-list");
const trendText = document.getElementById("trend-text");
const forecastIncome = document.getElementById("forecast-income");
const forecastExpense = document.getElementById("forecast-expense");
const forecastSavings = document.getElementById("forecast-savings");
const adviceList = document.getElementById("advice-list");
const categoryBreakdown = document.getElementById("category-breakdown");
const categoryChartCanvas = document.getElementById("category-chart");
const budgetProgress = document.getElementById("budget-progress");
const analyticsSummary = document.getElementById("analytics-summary");
const cashflowChartCanvas = document.getElementById("cashflow-chart");
const analyticsComparison = document.getElementById("analytics-comparison");
const dailyHeatmap = document.getElementById("daily-heatmap");
const categoryTrendChartCanvas = document.getElementById("category-trend-chart");
const goalsList = document.getElementById("goals-list");
const optimizationPlan = document.getElementById("optimization-plan");
let categoryChart = null;
let trendChart = null;
let cashflowChart = null;
let categoryTrendChart = null;
const budgetForm = document.getElementById("budget-form");
const budgetCategory = document.getElementById("budget-category");
const budgetAmount = document.getElementById("budget-amount");
const budgetMonth = document.getElementById("budget-month");
const budgetSubmit = document.getElementById("budget-submit");
const cancelEditBudgetBtn = document.getElementById("cancel-edit-budget");
const budgetSuggestions = document.getElementById("budget-suggestions");
const recurringSummary = document.getElementById("recurring-summary");
const recurringList = document.getElementById("recurring-list");
const goalForm = document.getElementById("goal-form");
const goalName = document.getElementById("goal-name");
const goalTarget = document.getElementById("goal-target");
const goalSaved = document.getElementById("goal-saved");
const goalDeadline = document.getElementById("goal-deadline");
const filterMonth = document.getElementById("filter-month");
const overviewMonth = document.getElementById("overview-month");
const filterSource = document.getElementById("filter-source");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");
const filterSearch = document.getElementById("filter-search");
const filterSort = document.getElementById("filter-sort");
const exportCsv = document.getElementById("export-csv");
const exportReport = document.getElementById("export-report");
const csvImportForm = document.getElementById("csv-import-form");
const csvFile = document.getElementById("csv-file");
const csvDateOrder = document.getElementById("csv-date-order");
const csvPreviewSubmit = document.getElementById("csv-preview-submit");
const csvImportSubmit = document.getElementById("csv-import-submit");
const csvClearImport = document.getElementById("csv-clear-import");
const csvPreview = document.getElementById("csv-preview");
const csvImportResult = document.getElementById("csv-import-result");
const csvMappingInputs = {
    date_column: document.getElementById("csv-date-column"),
    amount_column: document.getElementById("csv-amount-column"),
    debit_column: document.getElementById("csv-debit-column"),
    credit_column: document.getElementById("csv-credit-column"),
    note_column: document.getElementById("csv-note-column"),
    type_column: document.getElementById("csv-type-column"),
    category_column: document.getElementById("csv-category-column"),
};
const themeLightBtn = document.getElementById("theme-light");
const themeDarkBtn = document.getElementById("theme-dark");
const vipInsightsList = document.getElementById("vip-insights-list");
const vipInsightText = document.getElementById("vip-insight-text");
const vipRunwayValue = document.getElementById("vip-runway-value");
const vipFocusValue = document.getElementById("vip-focus-value");
const vipRiskValue = document.getElementById("vip-risk-value");
const vipAskInput = document.getElementById("vip-ask-input");
const vipAskSend = document.getElementById("vip-ask-send");
const vipAskAnswer = document.getElementById("vip-ask-answer");
const aiScoreValue = document.getElementById("ai-score-value");
const riskLevelValue = document.getElementById("risk-level-value");
const healthIndexValue = document.getElementById("health-index-value");
const budgetAdherenceValue = document.getElementById("budget-adherence-value");
const financialStyleValue = document.getElementById("financial-style-value");
const spendingTargetValue = document.getElementById("spending-target-value");
const savingsVelocityValue = document.getElementById("savings-velocity-value");
const priorityGoalValue = document.getElementById("priority-goal-value");
const financialBlueprintText = document.getElementById("financial-blueprint-text");
const goalSuggestionList = document.getElementById("goal-suggestion-list");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const clearChatBtn = document.getElementById("clear-chat");
const aiScope = document.getElementById("ai-scope");
const loadDemoDataBtn = document.getElementById("load-demo-data");
const generateAiInsightBtn = document.getElementById("generate-ai-insight");
const generateMonthReportBtn = document.getElementById("generate-month-report");
const generateYearReportBtn = document.getElementById("generate-year-report");
const aiInsightStatus = document.getElementById("ai-insight-status");
const aiHealthStatus = document.getElementById("ai-health-status");
const aiInsightResult = document.getElementById("ai-insight-result");
const starterChips = document.querySelectorAll(".starter-chip");
const savingsRateValue = document.getElementById("savings-rate-value");
const topCategoryValue = document.getElementById("top-category-value");
const biggestExpenseValue = document.getElementById("biggest-expense-value");
const quickInsightsList = document.getElementById("quick-insights-list");
const transactionModal = document.getElementById("transaction-modal");
const closeTransactionModalBtn = document.getElementById("close-transaction-modal");
const cancelModalEditBtn = document.getElementById("cancel-modal-edit");
const editTransactionForm = document.getElementById("edit-transaction-form");
const editTransactionId = document.getElementById("edit-transaction-id");
const editDescription = document.getElementById("edit-description");
const editAmount = document.getElementById("edit-amount");
const editDate = document.getElementById("edit-date");
const editType = document.getElementById("edit-type");
const editCategory = document.getElementById("edit-category");
const authStatus = document.getElementById("auth-status");
const authEmail = document.getElementById("auth-email");
const authName = document.getElementById("auth-name");
const authPassword = document.getElementById("auth-password");
const authLoginBtn = document.getElementById("auth-login");
const authRegisterBtn = document.getElementById("auth-register");
const authLogoutBtn = document.getElementById("auth-logout");
const backupDbBtn = document.getElementById("backup-db");
const restoreForm = document.getElementById("restore-form");
const restoreFile = document.getElementById("restore-file");
const restoreSubmitBtn = restoreForm?.querySelector("button[type='submit']");
const dataStatus = document.getElementById("data-status");
const pwaStatus = document.getElementById("pwa-status");
const resetSessionBtn = document.getElementById("reset-session");
const sessionStatus = document.getElementById("session-status");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
let editingTransactionId = null;
let editingBudgetId = null;
let chatHistory = [];
let csrfToken = null;

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " VND";
}

function formatDate(value) {
    if (!value) {
        return "";
    }
    const [year, month, day] = String(value).split("-");
    return year && month && day ? `${day}/${month}/${year}` : value;
}

function activeSource() {
    return filterSource?.value || "all";
}

function appendSourceParam(params) {
    const source = activeSource();
    if (source && source !== "all") {
        params.set("source", source);
    }
}

function chartTextColor() {
    return document.body.classList.contains("dark-theme") ? "#cbd5e1" : "#475569";
}

function chartGridColor() {
    return document.body.classList.contains("dark-theme") ? "rgba(148, 163, 184, 0.18)" : "rgba(100, 116, 139, 0.18)";
}

function clampPercent(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return 0;
    }
    return Math.max(0, Math.min(numeric, 100));
}

function todayLocalISO() {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

async function requestJson(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const shouldSendCsrf = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
    const buildRequestOptions = () => {
        const requestOptions = { ...options };
        if (shouldSendCsrf) {
            requestOptions.headers = {
                ...(options.headers || {}),
                "X-CSRF-Token": csrfToken || "",
            };
        }
        return requestOptions;
    };
    const isCsrfError = (response, data) =>
        response.status === 403 && String(data.error || "").toLowerCase().includes("csrf");

    if (shouldSendCsrf && !csrfToken) {
        await refreshClientCsrfToken();
    }
    let response = await fetch(url, buildRequestOptions());
    let data = await response.json().catch(() => ({}));
    if (isCsrfError(response, data)) {
        csrfToken = null;
        await refreshClientCsrfToken();
        response = await fetch(url, buildRequestOptions());
        data = await response.json().catch(() => ({}));
    }
    if (data.csrfToken) {
        csrfToken = data.csrfToken;
    }
    if (!response.ok) {
        throw new Error(data.error || "Yêu cầu thất bại");
    }
    return data;
}

async function refreshClientCsrfToken() {
    const response = await fetch("/api/auth/status");
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || "Không thể lấy CSRF token");
    }
    csrfToken = data.csrfToken;
    return data;
}

async function fetchHealthStatus() {
    return requestJson("/api/health");
}

async function resetClientSessionState() {
    csrfToken = null;
    chatHistory = [];
    await refreshClientCsrfToken();
    if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.update()));
    }
}

function switchTab(tabName) {
    tabButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.tab === tabName);
    });
    localStorage.setItem("financeTab", tabName);
}

function initTabs() {
    const savedTab = localStorage.getItem("financeTab") || "overview";
    switchTab(savedTab);
}

function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("financeTheme", theme);
    const activeId = theme === "dark" ? "theme-dark" : "theme-light";
    [themeLightBtn, themeDarkBtn].forEach(btn => btn.classList.toggle("active", btn.id === activeId));
    if (trendChart || categoryChart) {
        refreshData();
    }
}

function initTheme() {
    const saved = localStorage.getItem("financeTheme") || "light";
    applyTheme(saved);
    setActiveMonth(new Date().toISOString().slice(0, 7), false);
    setDefaultTransactionDate();
}

function setActiveMonth(month, shouldRefresh = true) {
    if (!month) {
        return;
    }
    filterMonth.value = month;
    if (overviewMonth) {
        overviewMonth.value = month;
    }
    if (budgetMonth) {
        budgetMonth.value = month;
    }
    if (shouldRefresh) {
        refreshData();
    }
}

async function fetchSummary() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    return requestJson(`/api/summary?${params.toString()}`);
}

async function fetchDashboardSummary() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    return requestJson(`/api/dashboard-summary?${params.toString()}`);
}

async function fetchAnalytics12m() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    return requestJson(`/api/analytics-12m?${params.toString()}`);
}

async function fetchTransactions() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    if (filterType.value) {
        params.set("type", filterType.value);
    }
    if (filterCategory.value.trim()) {
        params.set("category", filterCategory.value.trim());
    }
    if (filterSearch.value.trim()) {
        params.set("search", filterSearch.value.trim());
    }
    if (filterSort.value) {
        params.set("sort", filterSort.value);
    }
    appendSourceParam(params);
    return requestJson(`/api/transactions?${params.toString()}`);
}

async function fetchBudgets() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    return requestJson(`/api/budgets?${params.toString()}`);
}

async function fetchBudgetSuggestions() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    return requestJson(`/api/budget-suggestions?${params.toString()}`);
}

async function fetchRecurringTransactions() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    return requestJson(`/api/recurring-transactions?${params.toString()}`);
}

async function fetchMonthlySummary() {
    const params = new URLSearchParams();
    appendSourceParam(params);
    return requestJson(`/api/monthly-summary?${params.toString()}`);
}

async function fetchAiInsight() {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    const response = await fetch(`/api/ai-insight?${params.toString()}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok && !data.spending_insights) {
        throw new Error(data.error || "Không thể tạo phân tích AI");
    }
    return data;
}

async function loadDemoData() {
    return requestJson("/api/demo-data", { method: "POST" });
}

async function askAi(message, history = []) {
    const data = await requestJson("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, month: filterMonth.value, scope: aiScope.value, source: activeSource() }),
    });
    return data;
}

async function fetchAiReport(scope) {
    return requestJson("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: filterMonth.value, scope, source: activeSource() }),
    });
}

async function fetchAuthStatus() {
    return requestJson("/api/auth/status");
}

async function submitAuth(mode) {
    return requestJson(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: authEmail.value.trim(),
            name: authName.value.trim(),
            password: authPassword.value,
        }),
    });
}

async function logoutAuth() {
    return requestJson("/api/auth/logout", { method: "POST" });
}

async function restoreDatabase() {
    const formData = new FormData();
    formData.append("file", restoreFile.files[0]);
    return requestJson("/api/restore/db", {
        method: "POST",
        body: formData,
    });
}

async function downloadBackupDatabase() {
    const response = await fetch("/api/backup/db");
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Không thể tải backup DB.");
    }
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch?.[1] || "lux-money-backup.db";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

async function importCsvFile() {
    const formData = new FormData();
    formData.append("file", csvFile.files[0]);
    Object.entries(csvMappingInputs).forEach(([key, input]) => {
        if (input.value.trim()) {
            formData.append(key, input.value.trim());
        }
    });
    formData.append("date_order", csvDateOrder?.value || "auto");
    return requestJson("/api/import/csv", {
        method: "POST",
        body: formData,
    });
}

async function previewCsvFile() {
    const formData = new FormData();
    formData.append("file", csvFile.files[0]);
    Object.entries(csvMappingInputs).forEach(([key, input]) => {
        if (input.value.trim()) {
            formData.append(key, input.value.trim());
        }
    });
    formData.append("date_order", csvDateOrder?.value || "auto");
    return requestJson("/api/import/csv/preview", {
        method: "POST",
        body: formData,
    });
}

async function clearImportedTransactions() {
    return requestJson("/api/import/csv", { method: "DELETE" });
}

function populateCsvMappingOptions(headers = [], suggestedMapping = {}) {
    Object.entries(csvMappingInputs).forEach(([key, select]) => {
        const currentValue = suggestedMapping[key] || select.value || "";
        const emptyLabel = select.dataset.placeholder || "Không dùng";
        select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>`;
        headers.forEach((header) => {
            const option = document.createElement("option");
            option.value = header;
            option.textContent = header;
            select.appendChild(option);
        });
        select.value = headers.includes(currentValue) ? currentValue : "";
    });
}

function renderCsvPreview(data) {
    populateCsvMappingOptions(data.headers || [], data.suggestedMapping || {});
    if (csvDateOrder && data.suggestedMapping?.date_order && csvDateOrder.value === "auto") {
        csvDateOrder.dataset.detectedOrder = data.suggestedMapping.date_order;
    }
    const rows = data.previewRows || [];
    const errors = data.errors || [];
    if (!rows.length && !errors.length) {
        csvPreview.innerHTML = `<div class="empty-state">File có ${data.totalRows || 0} dòng nhưng chưa đọc được dòng preview hợp lệ.</div>`;
        return;
    }

    const rowHtml = rows.map((item) => {
        const tx = item.transaction || {};
        return `
            <tr>
                <td>${item.row}</td>
                <td>${escapeHtml(formatDate(tx.date))}</td>
                <td>${escapeHtml(tx.type === "income" ? "Thu" : "Chi")}</td>
                <td>${escapeHtml(tx.category)}</td>
                <td>${escapeHtml(tx.note)}</td>
                <td>${formatCurrency(tx.amount)}</td>
            </tr>
        `;
    }).join("");
    const errorHtml = errors.length ? `
        <div class="csv-preview-errors">
            ${errors.map((item) => `<p>Dòng ${item.row}: ${escapeHtml(item.error)}</p>`).join("")}
        </div>
    ` : "";

    csvPreview.innerHTML = `
        <div class="csv-preview-header">
            <strong>Preview ${rows.length}/${data.totalRows || rows.length} dòng</strong>
            <span>Mapping đã được gợi ý tự động. Định dạng ngày: ${escapeHtml(data.suggestedMapping?.date_order || "auto")}. Có thể chỉnh dropdown rồi bấm “Xem trước” lại.</span>
        </div>
        <div class="csv-preview-table-wrap">
            <table class="csv-preview-table">
                <thead>
                    <tr>
                        <th>Dòng</th>
                        <th>Ngày</th>
                        <th>Loại</th>
                        <th>Danh mục</th>
                        <th>Ghi chú</th>
                        <th>Số tiền</th>
                    </tr>
                </thead>
                <tbody>${rowHtml}</tbody>
            </table>
        </div>
        ${errorHtml}
    `;
}

function renderMonthlyChart(monthlySummary) {
    const trendChartCanvas = document.getElementById("trend-chart");
    if (!monthlySummary || monthlySummary.length === 0) {
        if (trendChart) {
            trendChart.destroy();
            trendChart = null;
        }
        return;
    }

    const sorted = [...monthlySummary].sort((a, b) => a.month.localeCompare(b.month));
    const labels = sorted.map(t => t.month);
    const incomeData = sorted.map(t => Number(t.total_income || 0));
    const expenseData = sorted.map(t => Number(t.total_expense || 0));

    if (trendChart) {
        trendChart.destroy();
    }
    trendChart = new Chart(trendChartCanvas, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Thu nhập",
                data: incomeData,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
            }, {
                label: "Chi tiêu",
                data: expenseData,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top", labels: { color: chartTextColor() } },
            },
            scales: {
                x: {
                    ticks: { color: chartTextColor() },
                    grid: { color: chartGridColor() },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartTextColor(),
                        callback: function(value) {
                            return value.toLocaleString("vi-VN") + " VND";
                        }
                    },
                    grid: { color: chartGridColor() },
                }
            }
        },
    });
}

function renderCategoryBreakdown(categories) {
    categoryBreakdown.innerHTML = "";
    if (!categories || Object.keys(categories).length === 0) {
        categoryBreakdown.innerHTML = "<p>Chưa có dữ liệu phân bổ danh mục.</p>";
        if (categoryChart) {
            categoryChart.destroy();
            categoryChart = null;
        }
        return;
    }

    const labels = [];
    const values = [];
    Object.entries(categories).forEach(([category, amount]) => {
        const item = document.createElement("div");
        item.className = "breakdown-item";
        item.innerHTML = `
            <span>${escapeHtml(category)}</span>
            <span>${formatCurrency(amount)}</span>
        `;
        categoryBreakdown.appendChild(item);
        labels.push(category);
        values.push(Number(amount || 0));
    });

    if (categoryChart) {
        categoryChart.destroy();
    }
    categoryChart = new Chart(categoryChartCanvas, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6", "#a855f7"],
                borderColor: document.body.classList.contains("dark-theme") ? "#1e293b" : "#ffffff",
                borderWidth: 2,
            }],
        },
        options: {
            plugins: {
                legend: { position: "bottom", labels: { color: chartTextColor() } },
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

function renderBudgetProgress(items) {
    budgetProgress.innerHTML = "";
    if (!items || items.length === 0) {
        budgetProgress.innerHTML = "<p>Chưa có ngân sách tháng.</p>";
        return;
    }
    items.forEach((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "budget-item";
        const usedPercent = clampPercent(item.usedPercent);
        wrapper.innerHTML = `
            <div class="budget-header">
                <span>${escapeHtml(item.category)}</span>
                <span>${formatCurrency(item.spent)} / ${formatCurrency(item.budgetAmount)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${usedPercent}%"></div>
            </div>
            <p class="budget-status">${escapeHtml(item.status)} - ${usedPercent}%</p>
        `;
        budgetProgress.appendChild(wrapper);
    });
}

function renderBudgetList(items, progressItems = []) {
    const budgetList = document.getElementById("budget-list");
    budgetList.innerHTML = "";
    if (!items || items.length === 0) {
        budgetList.innerHTML = "<p>Chưa có ngân sách cho tháng này. Tạo ngân sách theo danh mục, app sẽ tự cập nhật phần đã dùng từ giao dịch.</p>";
        return;
    }
    const progressByKey = new Map(
        (progressItems || []).map((item) => [`${item.month || filterMonth.value}|${item.category}`, item])
    );
    items.forEach((item) => {
        const progress = progressByKey.get(`${item.month}|${item.category}`) || {};
        const budgetValue = Number(progress.budgetAmount ?? item.amount ?? 0);
        const spentValue = Number(progress.spent ?? 0);
        const remainingValue = budgetValue - spentValue;
        const usedPercent = clampPercent(progress.usedPercent ?? (budgetValue > 0 ? (spentValue / budgetValue) * 100 : 0));
        const statusText = progress.status || (remainingValue >= 0 ? "Còn trong ngân sách" : "Vượt ngân sách");
        const wrapper = document.createElement("div");
        wrapper.className = "budget-item";
        wrapper.innerHTML = `
            <div class="budget-header">
                <span>${escapeHtml(item.category)}</span>
                <span>${formatCurrency(spentValue)} / ${formatCurrency(budgetValue)}</span>
            </div>
            <div class="budget-auto-row">
                <span>Tháng: ${escapeHtml(item.month)}</span>
                <span>${escapeHtml(statusText)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${remainingValue < 0 ? "danger-fill" : ""}" style="width: ${usedPercent}%"></div>
            </div>
            <div class="budget-auto-row">
                <span>Đã dùng từ giao dịch: ${formatCurrency(spentValue)}</span>
                <span>${remainingValue >= 0 ? "Còn lại" : "Vượt"}: ${formatCurrency(Math.abs(remainingValue))}</span>
            </div>
            <div class="transaction-actions">
                <button class="edit-button" data-id="${item.id}">Sửa</button>
                <button class="delete-button" data-id="${item.id}">Xóa ngân sách</button>
            </div>
        `;
        wrapper.querySelector(".edit-button").addEventListener("click", () => startEditBudget(item));
        wrapper.querySelector(".delete-button").addEventListener("click", async () => {
            try {
                await deleteBudget(item.id);
                await refreshData();
            } catch (error) {
                alert(error.message || "Xóa ngân sách thất bại. Vui lòng thử lại.");
            }
        });
        budgetList.appendChild(wrapper);
    });
}

function renderGoals(items) {
    goalsList.innerHTML = "";
    if (!items || items.length === 0) {
        goalsList.innerHTML = "<p>Chưa có mục tiêu tiết kiệm.</p>";
        return;
    }
    items.forEach((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "goal-item";
        const progressPercent = clampPercent(item.progressPercent);
        wrapper.innerHTML = `
            <div class="goal-header">
                <span>${escapeHtml(item.name)}</span>
                <span>${progressPercent}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill goal-fill" style="width: ${progressPercent}%"></div>
            </div>
            <p>${formatCurrency(item.savedAmount)} / ${formatCurrency(item.targetAmount)} • Hạn: ${escapeHtml(item.deadline)}</p>
            <button class="delete-button" data-id="${item.id}">Xóa mục tiêu</button>
        `;
        const deleteBtn = wrapper.querySelector(".delete-button");
        deleteBtn.addEventListener("click", async () => {
            try {
                await deleteGoal(item.id);
                await refreshData();
            } catch (error) {
                alert(error.message || "Xóa mục tiêu thất bại. Vui lòng thử lại.");
            }
        });
        goalsList.appendChild(wrapper);
    });
}

function renderOptimizationPlan(optimization) {
    optimizationPlan.innerHTML = "";
    if (!optimization) {
        optimizationPlan.innerHTML = "<p>Không có dữ liệu tối ưu hóa.</p>";
        return;
    }
    const actions = document.createElement("div");
    actions.className = "optimization-actions";
    actions.innerHTML = `<h3>Hành động đề xuất</h3>`;
    optimization.actions.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        actions.appendChild(p);
    });

    const summary = document.createElement("div");
    summary.className = "optimization-summary";
    summary.innerHTML = `
        <p><strong>Dư khả dụng hàng tháng:</strong> ${formatCurrency(optimization.availableSavings)}</p>
    `;

    const topList = document.createElement("div");
    topList.className = "optimization-block";
    topList.innerHTML = `<h4>Top chi phí lớn</h4>`;
    optimization.topExpenseCategories.forEach((item) => {
        const row = document.createElement("div");
        row.className = "optimization-row";
        row.innerHTML = `<span>${escapeHtml(item.category)}</span><span>${formatCurrency(item.amount)}</span><p>${escapeHtml(item.suggestion)}</p>`;
        topList.appendChild(row);
    });

    const goalList = document.createElement("div");
    goalList.className = "optimization-block";
    goalList.innerHTML = `<h4>Kế hoạch mục tiêu</h4>`;
    optimization.goalAllocation.forEach((item) => {
        const row = document.createElement("div");
        row.className = "optimization-row";
        row.innerHTML = `<span>${escapeHtml(item.goal)}</span><span>${formatCurrency(item.recommendedMonthly)}</span><p>${escapeHtml(item.note)}</p>`;
        goalList.appendChild(row);
    });

    optimizationPlan.appendChild(summary);
    optimizationPlan.appendChild(actions);
    optimizationPlan.appendChild(topList);
    optimizationPlan.appendChild(goalList);
}

function renderAIMetrics(summary) {
    if (!summary) {
        aiScoreValue.textContent = "--";
        riskLevelValue.textContent = "Đang tải...";
        healthIndexValue.textContent = "--";
        budgetAdherenceValue.textContent = "--";
        return;
    }
    aiScoreValue.textContent = summary.aiScore || 0;
    riskLevelValue.textContent = summary.riskLevel || "Ổn định";
    healthIndexValue.textContent = summary.healthIndex ? `${summary.healthIndex} / 100` : "--";
    budgetAdherenceValue.textContent = summary.budgetAdherenceText || "Chưa có ngân sách";
}

function renderFinancialStrategy(summary) {
    if (!summary) {
        financialStyleValue.textContent = "Đang tải...";
        spendingTargetValue.textContent = "Đang tải...";
        savingsVelocityValue.textContent = "Đang tải...";
        priorityGoalValue.textContent = "Đang tải...";
        financialBlueprintText.textContent = "Đang phân tích bản đồ tài chính...";
        goalSuggestionList.innerHTML = "<li>Đang tải...</li>";
        return;
    }

    financialStyleValue.textContent = summary.financialStyle || "Chưa xác định";
    spendingTargetValue.textContent = summary.recommendedExpenseCap ? formatCurrency(summary.recommendedExpenseCap) : "Chưa có dữ liệu";
    if (summary.monthlySavings || summary.recommendedSavingsGoal) {
        savingsVelocityValue.textContent = `${formatCurrency(summary.monthlySavings)} / ${formatCurrency(summary.recommendedSavingsGoal)}`;
    } else {
        savingsVelocityValue.textContent = "Chưa có dòng tiền dương";
    }
    priorityGoalValue.textContent = summary.priorityGoal || "Không có mục tiêu cần ưu tiên";
    financialBlueprintText.textContent = summary.financialBlueprint?.join(" ") || "Thêm giao dịch để nhận bản đồ tài chính.";

    goalSuggestionList.innerHTML = "";
    if (summary.goalRecommendations && summary.goalRecommendations.length > 0) {
        summary.goalRecommendations.forEach((advice) => {
            const item = document.createElement("li");
            item.textContent = advice;
            goalSuggestionList.appendChild(item);
        });
    } else {
        goalSuggestionList.innerHTML = "<li>Chưa có đề xuất mục tiêu chi tiêu cụ thể.</li>";
    }
}

function renderVipInsights(summary, dashboard) {
    vipInsightsList.innerHTML = "";
    if (!summary) {
        vipInsightsList.innerHTML = "<li>Đang tải phân tích VIP...</li>";
        vipInsightText.textContent = "Đang phân tích dữ liệu tài chính...";
        return;
    }

    const savingsRate = dashboard?.savingsRate ?? (summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 100) : 0);
    const trendTooltip = summary.forecast?.trend || "Ổn định";
    const topCategory = dashboard?.topSpendingCategory;
    const biggestExpense = dashboard?.biggestExpense;
    const comparison = dashboard?.comparison || {};
    const recurring = dashboard?.recurringTransactions || [];
    const topCategoryText = topCategory
        ? `${topCategory.category} đang dẫn đầu với ${formatCurrency(topCategory.total)}.`
        : "Chưa đủ dữ liệu danh mục.";
    const riskLabel = summary.riskLevel || (savingsRate < 10 ? "Cao" : savingsRate < 20 ? "Trung bình" : "Thấp");
    const monthlyRunway = summary.expense > 0 ? Math.max(1, Math.round(summary.balance / Math.max(summary.expense, 1) * 30)) : 0;

    vipInsightText.textContent = summary.income > 0
        ? `Tháng ${dashboard?.month || filterMonth.value}, dòng tiền ròng ${formatCurrency(summary.balance)}, tỷ lệ tiết kiệm ${Number(savingsRate).toFixed(1)}%. ${topCategoryText}`
        : "Chưa có dữ liệu đủ mạnh. Bấm “Nạp dữ liệu mẫu 12 tháng” để xem dashboard và AI Insight đầy đủ.";

    vipRunwayValue.textContent = summary.expense > 0 ? `${monthlyRunway} ngày` : "--";
    vipFocusValue.textContent = topCategory ? topCategory.category : "Data";
    vipRiskValue.textContent = riskLabel;

    const overspentCategoryTips = summary.topOverspentCategories || [];
    const insights = [
        `Executive pulse: ${trendTooltip.toLowerCase()}, VIP score ${summary.aiScore || 0}/100, risk ${riskLabel}.`,
        `Savings rate: ${Number(savingsRate).toFixed(1)}%. ${savingsRate >= 20 ? "Có dư địa tốt để tăng đầu tư hoặc quỹ khẩn cấp." : "Nên đặt trần chi tiêu tuần cho danh mục lớn nhất."}`,
        `Category watch: ${topCategoryText}`,
        biggestExpense ? `Biggest transaction: ${biggestExpense.note} (${formatCurrency(biggestExpense.amount)}).` : "Biggest transaction: chưa có dữ liệu chi tiêu tháng này.",
        comparison.expenseChange !== undefined ? `Month-over-month expense delta: ${formatCurrency(comparison.expenseChange)} so với ${comparison.previousMonth}.` : "Month-over-month: cần thêm dữ liệu tháng trước.",
    ];
    if (recurring.length) {
        insights.push(`Recurring radar: ${recurring.slice(0, 3).map((item) => item.note).join(", ")}.`);
    }
    overspentCategoryTips.forEach((tip) => insights.push(`Budget alert: ${tip}`));

    insights.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        vipInsightsList.appendChild(item);
    });
}

function renderAnalytics12m(analytics) {
    const summary = analytics?.summary || {};
    analyticsSummary.innerHTML = "";
    if (!analytics?.monthly?.length) {
        analyticsSummary.innerHTML = "<div class=\"empty-state compact-empty\">Chưa đủ dữ liệu 12 tháng để phân tích.</div>";
        if (analyticsComparison) {
            analyticsComparison.innerHTML = "";
        }
        if (dailyHeatmap) {
            dailyHeatmap.innerHTML = "";
        }
        if (cashflowChart) {
            cashflowChart.destroy();
            cashflowChart = null;
        }
        if (categoryTrendChart) {
            categoryTrendChart.destroy();
            categoryTrendChart = null;
        }
        return;
    }

    const cards = [
        ["Tổng thu", formatCurrency(summary.totalIncome)],
        ["Tổng chi", formatCurrency(summary.totalExpense)],
        ["Dòng tiền ròng", formatCurrency(summary.totalCashFlow)],
        ["Chi TB/tháng", formatCurrency(summary.averageMonthlyExpense)],
        ["Savings rate TB", `${Number(summary.averageSavingsRate || 0).toFixed(1)}%`],
        ["Tháng chi cao nhất", summary.highestExpenseMonth ? `${summary.highestExpenseMonth.month} · ${formatCurrency(summary.highestExpenseMonth.total_expense)}` : "--"],
    ];
    cards.forEach(([label, value]) => {
        const item = document.createElement("div");
        item.className = "analytics-card";
        item.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
        analyticsSummary.appendChild(item);
    });

    const compare = analytics.compareToAverage || {};
    if (analyticsComparison) {
        const expenseDelta = Number(compare.expenseDelta || 0);
        const savingsRateDelta = Number(compare.savingsRateDelta || 0);
        const cashFlowDelta = Number(compare.cashFlowDelta || 0);
        analyticsComparison.innerHTML = `
            <div class="comparison-row ${expenseDelta <= 0 ? "positive" : "negative"}">
                <span>Chi tiêu</span>
                <strong>${expenseDelta <= 0 ? "Thấp hơn" : "Cao hơn"} ${formatCurrency(Math.abs(expenseDelta))}</strong>
            </div>
            <div class="comparison-row ${cashFlowDelta >= 0 ? "positive" : "negative"}">
                <span>Dòng tiền</span>
                <strong>${cashFlowDelta >= 0 ? "+" : "-"}${formatCurrency(Math.abs(cashFlowDelta))}</strong>
            </div>
            <div class="comparison-row ${savingsRateDelta >= 0 ? "positive" : "negative"}">
                <span>Savings rate</span>
                <strong>${savingsRateDelta >= 0 ? "+" : ""}${savingsRateDelta.toFixed(1)}%</strong>
            </div>
        `;
    }

    if (dailyHeatmap) {
        dailyHeatmap.innerHTML = "";
        (analytics.dailySpending || []).forEach((day) => {
            const cell = document.createElement("div");
            cell.className = `heatmap-cell level-${Number(day.level || 0)}`;
            cell.title = `${day.date}: ${formatCurrency(day.total)}`;
            cell.textContent = day.day;
            dailyHeatmap.appendChild(cell);
        });
    }

    const labels = analytics.monthly.map((item) => item.month);
    const cashFlow = analytics.monthly.map((item) => Number(item.cash_flow || 0));
    const savingsRate = analytics.monthly.map((item) => Number(item.savings_rate || 0));
    if (cashflowChart) {
        cashflowChart.destroy();
    }
    cashflowChart = new Chart(cashflowChartCanvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                type: "bar",
                label: "Dòng tiền ròng",
                data: cashFlow,
                backgroundColor: cashFlow.map((value) => value >= 0 ? "rgba(34, 197, 94, 0.65)" : "rgba(239, 68, 68, 0.65)"),
                borderRadius: 8,
                yAxisID: "y",
            }, {
                type: "line",
                label: "Savings rate %",
                data: savingsRate,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                tension: 0.35,
                yAxisID: "y1",
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "top", labels: { color: chartTextColor() } } },
            scales: {
                x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
                y: {
                    beginAtZero: true,
                    ticks: { color: chartTextColor(), callback: (value) => value.toLocaleString("vi-VN") },
                    grid: { color: chartGridColor() },
                },
                y1: {
                    position: "right",
                    ticks: { color: chartTextColor(), callback: (value) => `${value}%` },
                    grid: { drawOnChartArea: false },
                },
            },
        },
    });

    if (categoryTrendChartCanvas) {
        const trendPalette = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];
        const trendItems = analytics.categoryTrend || [];
        if (categoryTrendChart) {
            categoryTrendChart.destroy();
        }
        categoryTrendChart = new Chart(categoryTrendChartCanvas, {
            type: "line",
            data: {
                labels,
                datasets: trendItems.map((item, index) => ({
                    label: item.category,
                    data: (item.values || []).map((value) => Number(value || 0)),
                    borderColor: trendPalette[index % trendPalette.length],
                    backgroundColor: `${trendPalette[index % trendPalette.length]}22`,
                    tension: 0.35,
                    pointRadius: 3,
                    borderWidth: 2,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top", labels: { color: chartTextColor() } } },
                scales: {
                    x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
                    y: {
                        beginAtZero: true,
                        ticks: { color: chartTextColor(), callback: (value) => value.toLocaleString("vi-VN") },
                        grid: { color: chartGridColor() },
                    },
                },
            },
        });
    }
}

function renderBudgetSuggestions(items) {
    budgetSuggestions.innerHTML = "";
    if (!items || items.length === 0) {
        budgetSuggestions.innerHTML = "<p class=\"empty-state\">Chưa đủ dữ liệu để gợi ý ngân sách. Hãy thêm giao dịch trong vài tháng.</p>";
        return;
    }
    items.slice(0, 6).forEach((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "budget-item suggestion-item";
        wrapper.innerHTML = `
            <div class="budget-header">
                <span>${escapeHtml(item.category)}</span>
                <span>${formatCurrency(item.suggestedAmount)}</span>
            </div>
            <div class="budget-auto-row">
                <span>Trung bình: ${formatCurrency(item.averageExpense)}</span>
                <span>Xu hướng: ${escapeHtml(item.trend)}</span>
            </div>
            <div class="budget-auto-row">
                <span>Ngân sách hiện tại: ${item.currentBudget === null ? "Chưa có" : formatCurrency(item.currentBudget)}</span>
                <span>Dựa trên ${item.basisMonths} tháng</span>
            </div>
            <button class="secondary-button apply-suggestion">Dùng gợi ý này</button>
        `;
        wrapper.querySelector(".apply-suggestion").addEventListener("click", () => {
            editingBudgetId = null;
            budgetCategory.value = item.category;
            budgetAmount.value = item.suggestedAmount;
            budgetMonth.value = item.targetMonth;
            budgetSubmit.textContent = "Lưu ngân sách";
            cancelEditBudgetBtn.classList.add("hidden");
            switchTab("budgets");
            budgetCategory.focus();
        });
        budgetSuggestions.appendChild(wrapper);
    });
}

function renderRecurringTransactions(data) {
    if (!recurringSummary || !recurringList) {
        return;
    }
    const items = data?.items || [];
    const activeCount = items.filter((item) => item.status !== "ignored").length;
    recurringSummary.innerHTML = `
        <div class="recurring-summary-card">
            <span>Dự kiến mỗi tháng</span>
            <strong>${formatCurrency(data?.totalEstimatedMonthly || 0)}</strong>
            <small>${activeCount} khoản đang theo dõi · ${items.length - activeCount} khoản đã bỏ qua</small>
        </div>
        <div class="recurring-summary-card">
            <span>Kỳ dự báo</span>
            <strong>${escapeHtml(data?.nextMonth || "--")}</strong>
            <small>Dựa trên lịch sử giao dịch hiện có</small>
        </div>
    `;

    recurringList.innerHTML = "";
    if (!items.length) {
        recurringList.innerHTML = `
            <div class="empty-state">
                <strong>Chưa phát hiện khoản định kỳ.</strong>
                <p>Khi có ít nhất hai giao dịch giống nhau ở nhiều tháng, app sẽ tự gợi ý tại đây.</p>
            </div>
        `;
        return;
    }

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = `recurring-card status-${escapeHtml(item.status || "likely")}`;
        card.innerHTML = `
            <div class="recurring-card-top">
                <span class="metric-pill">${escapeHtml(item.status === "confirmed" ? "OK" : item.status === "ignored" ? "SKIP" : "AUTO")}</span>
                <strong>${escapeHtml(item.note)}</strong>
            </div>
            <p>${escapeHtml(item.category)} • ${item.occurrences} lần ghi nhận</p>
            <div class="recurring-amount">${formatCurrency(item.estimatedAmount)}</div>
            <small>Các tháng gần đây: ${escapeHtml((item.months || []).join(", "))}</small>
            <div class="recurring-actions">
                <button class="secondary-button confirm-recurring">Xác nhận</button>
                <button class="secondary-button ignore-recurring">Bỏ qua</button>
            </div>
        `;
        card.querySelector(".confirm-recurring").addEventListener("click", () => updateRecurringRule(item, "confirmed"));
        card.querySelector(".ignore-recurring").addEventListener("click", () => updateRecurringRule(item, "ignored"));
        recurringList.appendChild(card);
    });
}

async function updateRecurringRule(item, status) {
    await requestJson("/api/recurring-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ruleKey: item.ruleKey,
            note: item.note,
            category: item.category,
            status,
        }),
    });
    await refreshData();
}

async function refreshAuthStatus() {
    if (!authStatus) {
        return;
    }
    try {
        const status = await fetchAuthStatus();
        if (status.authenticated) {
            authStatus.textContent = `Đang đăng nhập: ${status.user.name} (${status.user.email})${status.user.isAdmin ? " · Admin" : ""}. Giao dịch mới sẽ gắn với tài khoản này.`;
            authLogoutBtn.disabled = false;
        } else {
            authStatus.textContent = status.userCount > 0
                ? "Chưa đăng nhập. Bạn vẫn có thể dùng app local, nhưng dữ liệu mới không gắn với user."
                : "Chưa có tài khoản local. Tạo tài khoản nếu muốn gắn dữ liệu mới với user.";
            authLogoutBtn.disabled = true;
        }
        const canManageDb = Boolean(status.authenticated && status.user?.isAdmin);
        backupDbBtn.disabled = !canManageDb;
        if (restoreSubmitBtn) {
            restoreSubmitBtn.disabled = !canManageDb;
        }
        if (!canManageDb && dataStatus) {
            dataStatus.textContent = "Backup/restore DB chỉ dành cho admin. Thiết lập ADMIN_EMAILS rồi đăng nhập bằng email admin để dùng.";
        } else if (dataStatus && dataStatus.textContent.includes("chỉ dành cho admin")) {
            dataStatus.textContent = "Sẵn sàng thao tác dữ liệu.";
        }
    } catch (error) {
        authStatus.textContent = error.message || "Không thể kiểm tra tài khoản.";
    }
}

function refreshPwaStatus() {
    if (!pwaStatus) {
        return;
    }
    const swSupported = "serviceWorker" in navigator;
    const standalone = window.matchMedia?.("(display-mode: standalone)").matches;
    pwaStatus.textContent = swSupported
        ? standalone ? "Đang chạy ở chế độ app/PWA." : "Trình duyệt hỗ trợ PWA. Có thể dùng Install app nếu trình duyệt hiển thị."
        : "Trình duyệt này chưa hỗ trợ service worker/PWA.";
}

async function refreshAiHealthStatus() {
    if (!aiHealthStatus) {
        return;
    }
    try {
        const health = await fetchHealthStatus();
        const mode = health.openai?.configured && health.openai?.sdkAvailable
            ? `OpenAI cloud sẵn sàng (${health.openai.model})`
            : "Đang dùng AI local fallback vì chưa có OPENAI_API_KEY hoặc SDK.";
        aiHealthStatus.textContent = mode;
    } catch (error) {
        aiHealthStatus.textContent = error.message || "Không thể kiểm tra trạng thái AI.";
    }
}

function startEditBudget(item) {
    editingBudgetId = item.id;
    budgetCategory.value = item.category;
    budgetAmount.value = item.amount;
    budgetMonth.value = item.month;
    budgetSubmit.textContent = "Cập nhật ngân sách";
    cancelEditBudgetBtn.classList.remove("hidden");
    budgetCategory.focus();
}

function resetBudgetForm() {
    editingBudgetId = null;
    budgetCategory.value = "";
    budgetAmount.value = "";
    budgetMonth.value = filterMonth.value || "";
    budgetSubmit.textContent = "Lưu ngân sách";
    cancelEditBudgetBtn.classList.add("hidden");
}

function renderAiInsight(insight) {
    aiInsightResult.innerHTML = "";
    const allItems = [
        ...(insight.spending_insights || []),
        ...(insight.patterns || []),
        ...(insight.suggestions || []),
    ];
    if (!allItems.length) {
        aiInsightResult.innerHTML = `
            <div class="empty-state compact-empty">
                <strong>Chưa đủ dữ liệu để AI phân tích.</strong>
                <p>Thêm vài giao dịch thu/chi trong tháng đang xem hoặc bấm nạp dữ liệu mẫu 12 tháng để xem cách hoạt động.</p>
            </div>
        `;
        return;
    }
    const hero = document.createElement("div");
    hero.className = "insight-hero";
    hero.innerHTML = `
        <span>AI brief ${escapeHtml(insight.month || filterMonth.value || "")}</span>
        <strong>${escapeHtml((insight.spending_insights || [])[1] || (insight.spending_insights || [])[0] || "Phân tích dữ liệu tháng đang chọn.")}</strong>
        <small>${escapeHtml(insight.source === "openai" ? "OpenAI" : "Local fallback")}</small>
    `;
    aiInsightResult.appendChild(hero);

    const sections = [
        ["Tổng quan", insight.spending_insights || []],
        ["Mẫu chi tiêu", insight.patterns || []],
        ["Hành động nên làm", insight.suggestions || []],
    ];
    sections.forEach(([title, items]) => {
        const card = document.createElement("div");
        card.className = "insight-card";
        const heading = document.createElement("h4");
        heading.textContent = title;
        const list = document.createElement("ul");
        if (items.length === 0) {
            const item = document.createElement("li");
            item.textContent = "Chưa có dữ liệu.";
            list.appendChild(item);
        } else {
            items.forEach((text) => {
                const item = document.createElement("li");
                item.textContent = text;
                list.appendChild(item);
            });
        }
        card.appendChild(heading);
        card.appendChild(list);
        aiInsightResult.appendChild(card);
    });
}

function renderAiReport(report) {
    aiInsightResult.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "ai-report-card compact-empty";
    const list = (title, items) => `
        <div class="report-block">
            <h4>${escapeHtml(title)}</h4>
            <ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
    `;
    wrapper.innerHTML = `
        <span class="report-scope">${escapeHtml(report.scope === "year" ? "12 tháng" : report.month)}</span>
        <h3>${escapeHtml(report.title)}</h3>
        <p>${escapeHtml(report.overview)}</p>
        <div class="report-grid">
            ${list("Rủi ro", report.risks)}
            ${list("Cơ hội", report.opportunities)}
            ${list("Hành động", report.actions)}
        </div>
    `;
    aiInsightResult.appendChild(wrapper);
}

async function generateAiReport(scope) {
    const button = scope === "year" ? generateYearReportBtn : generateMonthReportBtn;
    button.disabled = true;
    aiInsightStatus.textContent = scope === "year" ? "Đang tạo report 12 tháng..." : "Đang tạo report tháng...";
    try {
        const report = await fetchAiReport(scope);
        renderAiReport(report);
        aiInsightStatus.textContent = "Đã tạo report tài chính.";
    } catch (error) {
        aiInsightStatus.textContent = error.message || "Không thể tạo report.";
    } finally {
        button.disabled = false;
    }
}

function renderDashboardExtras(dashboard) {
    savingsRateValue.textContent = `${Number(dashboard.savingsRate || 0).toFixed(1)}%`;
    topCategoryValue.textContent = dashboard.topSpendingCategory
        ? `${dashboard.topSpendingCategory.category}`
        : "--";
    biggestExpenseValue.textContent = dashboard.biggestExpense
        ? `${dashboard.biggestExpense.note} · ${formatCurrency(dashboard.biggestExpense.amount)}`
        : "--";

    quickInsightsList.innerHTML = "";
    (dashboard.quickInsights || []).forEach((text) => {
        const item = document.createElement("div");
        item.className = "quick-insight";
        item.textContent = text;
        quickInsightsList.appendChild(item);
    });

    if (dashboard.recurringTransactions?.length) {
        const recurring = document.createElement("div");
        recurring.className = "quick-insight recurring-insight";
        recurring.textContent = `Likely recurring: ${dashboard.recurringTransactions.map(item => item.note).slice(0, 3).join(", ")}`;
        quickInsightsList.appendChild(recurring);
    }
}

function groupTransactionsByMonth(transactions) {
    return transactions.reduce((groups, tx) => {
        const month = (tx.date || "").slice(0, 7) || "Không rõ tháng";
        groups[month] = groups[month] || [];
        groups[month].push(tx);
        return groups;
    }, {});
}

function renderTransactions(transactions) {
    transactionsList.innerHTML = "";
    if (!transactions.length) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <strong>Không tìm thấy giao dịch</strong>
                <p>Thử đổi bộ lọc hoặc thêm giao dịch mới để xem phân tích.</p>
            </div>
        `;
        return;
    }

    const grouped = groupTransactionsByMonth(transactions);
    Object.keys(grouped).sort((a, b) => b.localeCompare(a)).forEach((month) => {
        const section = document.createElement("div");
        section.className = "transaction-month-group";
        const monthTotal = grouped[month].reduce((total, tx) => total + (tx.type === "expense" ? tx.amount : 0), 0);
        section.innerHTML = `
            <div class="month-group-header">
                <h3>${escapeHtml(month)}</h3>
                <span>${grouped[month].length} giao dịch · chi ${formatCurrency(monthTotal)}</span>
            </div>
        `;
        grouped[month].forEach((tx) => {
            const item = document.createElement("div");
            item.className = `transaction-item ${tx.type === "income" ? "income-row" : "expense-row"}`;
            item.innerHTML = `
                <span><strong>${tx.type === "income" ? "Thu" : "Chi"}</strong></span>
                <span>${escapeHtml(formatDate(tx.date))}</span>
                <span>${escapeHtml(tx.note)}</span>
                <span>${escapeHtml(tx.category)}</span>
                <span class="source-badge source-${escapeHtml(tx.source || "manual")}">${escapeHtml({ sample: "Mẫu", import: "CSV", manual: "Tay" }[tx.source] || tx.source || "Tay")}</span>
                <span style="font-weight:700;">${formatCurrency(tx.amount)}</span>
                <div class="transaction-actions">
                    <button class="edit-button" data-id="${tx.id}">Sửa</button>
                    <button class="delete-button" data-id="${tx.id}">Xóa</button>
                </div>
            `;
            item.querySelector(".edit-button").addEventListener("click", () => startEditTransaction(tx));
            item.querySelector(".delete-button").addEventListener("click", async () => {
                if (!confirm("Bạn chắc chắn muốn xóa giao dịch này?")) {
                    return;
                }
                try {
                    await deleteTransaction(tx.id);
                    await refreshData();
                } catch (error) {
                    alert(error.message || "Xóa giao dịch thất bại. Vui lòng thử lại.");
                }
            });
            section.appendChild(item);
        });
        transactionsList.appendChild(section);
    });
}

async function refreshAiInsight() {
    generateAiInsightBtn.disabled = true;
    aiInsightStatus.textContent = `Đang phân tích dữ liệu tháng ${filterMonth.value || "hiện tại"}...`;
    try {
        const insight = await fetchAiInsight();
        renderAiInsight(insight);
        aiInsightStatus.textContent = insight.source === "openai"
            ? `Đã tạo phân tích bằng OpenAI cho tháng ${insight.month || filterMonth.value}.`
            : insight.message || "Đã tạo phân tích dự phòng.";
    } catch (error) {
        aiInsightStatus.textContent = error.message || "Không thể tạo phân tích AI.";
    } finally {
        generateAiInsightBtn.disabled = false;
    }
}

async function sendVipQuestion() {
    const message = vipAskInput.value.trim();
    if (!message) return;
    vipAskSend.disabled = true;
    vipAskAnswer.textContent = "LUX AI đang đọc dữ liệu giao dịch...";
    try {
        const data = await askAi(message);
        vipAskAnswer.textContent = data.source === "local-fallback" && data.message
            ? `${data.response}\n\n${data.message}`
            : data.response;
        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: data.response });
        vipAskInput.value = "";
    } catch (error) {
        vipAskAnswer.textContent = error.message || "Không thể hỏi AI lúc này.";
    } finally {
        vipAskSend.disabled = false;
    }
}

async function refreshData() {
    // Show loading
    const loadingElements = [incomeValue, expenseValue, balanceValue, trendText, forecastIncome, forecastExpense, forecastSavings, adviceList, categoryBreakdown, budgetProgress, goalsList, optimizationPlan, financialStyleValue, spendingTargetValue, savingsVelocityValue, priorityGoalValue, financialBlueprintText, goalSuggestionList];
    loadingElements.forEach(el => {
        if (el.tagName === "DIV") {
            el.innerHTML = '<div class="loading-spinner"></div>';
        } else {
            el.textContent = "Đang tải...";
        }
    });

    try {
        const [summary, dashboard, budgets, budgetSuggestionItems, recurringData, monthlySummary, analytics12m, transactions] = await Promise.all([
            fetchSummary(),
            fetchDashboardSummary(),
            fetchBudgets(),
            fetchBudgetSuggestions(),
            fetchRecurringTransactions(),
            fetchMonthlySummary(),
            fetchAnalytics12m(),
            fetchTransactions(),
        ]);

        incomeValue.textContent = formatCurrency(summary.income);
        expenseValue.textContent = formatCurrency(summary.expense);
        balanceValue.textContent = formatCurrency(summary.balance);

        renderAIMetrics(summary);
        renderFinancialStrategy(summary);
        trendText.textContent = summary.forecast.trend;
        forecastIncome.textContent = formatCurrency(summary.forecast.next30DaysIncome);
        forecastExpense.textContent = formatCurrency(summary.forecast.next30DaysExpense);
        forecastSavings.textContent = formatCurrency(summary.forecast.recommendedSavings);

        adviceList.innerHTML = "";
        summary.advice.forEach((line, index) => {
            const p = document.createElement("p");
            p.textContent = line;
            p.style.animationDelay = `${index * 0.1}s`;
            adviceList.appendChild(p);
        });

        renderCategoryBreakdown(
            Object.fromEntries((dashboard.categorySummary || []).map((item) => [item.category, item.total]))
        );
        renderBudgetProgress(summary.budgetProgress);
        renderBudgetList(budgets, summary.budgetProgress);
        renderBudgetSuggestions(budgetSuggestionItems);
        renderRecurringTransactions(recurringData);
        renderGoals(summary.goals);
        renderOptimizationPlan(summary.optimization);
        renderDashboardExtras(dashboard);
        renderVipInsights(summary, dashboard);
        renderMonthlyChart(monthlySummary);
        renderAnalytics12m(analytics12m);
        renderTransactions(transactions);
    } catch (error) {
        incomeValue.textContent = "--";
        expenseValue.textContent = "--";
        balanceValue.textContent = "--";
        adviceList.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.textContent = error.message || "Không thể tải dữ liệu. Vui lòng thử lại.";
        adviceList.appendChild(errorMessage);
    }
}

function resetTransactionForm() {
    editingTransactionId = null;
    descriptionInput.value = "";
    amountInput.value = "";
    typeInput.value = "expense";
    categoryInput.value = "";
    setDefaultTransactionDate();
    submitTransactionBtn.textContent = "Lưu giao dịch";
    cancelEditTransactionBtn.classList.add("hidden");
}

function startEditTransaction(tx) {
    editingTransactionId = tx.id;
    editTransactionId.value = tx.id;
    editDescription.value = tx.note || tx.description || "";
    editAmount.value = tx.amount;
    editType.value = tx.type;
    editCategory.value = tx.category || "";
    editDate.value = tx.date || todayLocalISO();
    transactionModal.classList.remove("hidden");
    transactionModal.setAttribute("aria-hidden", "false");
    editDescription.focus();
}

function closeTransactionModal() {
    editingTransactionId = null;
    transactionModal.classList.add("hidden");
    transactionModal.setAttribute("aria-hidden", "true");
}

transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitTransactionBtn.disabled = true;
    submitTransactionBtn.textContent = editingTransactionId ? "Đang cập nhật..." : "Đang lưu...";
    const payload = {
        note: descriptionInput.value.trim(),
        description: descriptionInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        category: categoryInput.value,
        date: transactionDateInput.value,
    };
    try {
        const url = editingTransactionId ? `/api/transactions/${editingTransactionId}` : "/api/transactions";
        await requestJson(url, {
            method: editingTransactionId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        resetTransactionForm();
        await refreshData();
    } catch (error) {
        alert(error.message || "Lưu giao dịch thất bại. Vui lòng thử lại.");
    } finally {
        submitTransactionBtn.disabled = false;
        submitTransactionBtn.textContent = editingTransactionId ? "Cập nhật giao dịch" : "Lưu giao dịch";
    }
});

cancelEditTransactionBtn.addEventListener("click", resetTransactionForm);

editTransactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = editTransactionId.value;
    const payload = {
        note: editDescription.value.trim(),
        description: editDescription.value.trim(),
        amount: parseFloat(editAmount.value),
        type: editType.value,
        category: editCategory.value.trim(),
        date: editDate.value,
    };
    try {
        await requestJson(`/api/transactions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        closeTransactionModal();
        await refreshData();
    } catch (error) {
        alert(error.message || "Cập nhật giao dịch thất bại. Vui lòng thử lại.");
    }
});

closeTransactionModalBtn.addEventListener("click", closeTransactionModal);
cancelModalEditBtn.addEventListener("click", closeTransactionModal);
transactionModal.addEventListener("click", (event) => {
    if (event.target === transactionModal) {
        closeTransactionModal();
    }
});

budgetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
        category: budgetCategory.value.trim(),
        amount: parseFloat(budgetAmount.value),
        month: budgetMonth.value || undefined,
    };
    try {
        await requestJson(editingBudgetId ? `/api/budgets/${editingBudgetId}` : "/api/budgets", {
            method: editingBudgetId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        resetBudgetForm();
        await refreshData();
    } catch (error) {
        alert(error.message || "Lưu ngân sách thất bại. Vui lòng thử lại.");
    }
});

cancelEditBudgetBtn.addEventListener("click", resetBudgetForm);

goalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
        name: goalName.value.trim(),
        target_amount: parseFloat(goalTarget.value),
        saved_amount: parseFloat(goalSaved.value),
        deadline: goalDeadline.value || undefined,
    };
    try {
        await requestJson("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        goalName.value = "";
        goalTarget.value = "";
        goalSaved.value = "";
        goalDeadline.value = "";
        await refreshData();
    } catch (error) {
        alert(error.message || "Lưu mục tiêu thất bại. Vui lòng thử lại.");
    }
});

filterMonth.addEventListener("change", () => setActiveMonth(filterMonth.value));
overviewMonth.addEventListener("change", () => setActiveMonth(overviewMonth.value));
[filterSource, filterType, filterCategory, filterSearch, filterSort].forEach((input) => {
    input.addEventListener("input", refreshData);
    input.addEventListener("change", refreshData);
});

themeLightBtn.addEventListener("click", () => applyTheme("light"));
themeDarkBtn.addEventListener("click", () => applyTheme("dark"));
generateAiInsightBtn.addEventListener("click", refreshAiInsight);
generateMonthReportBtn.addEventListener("click", () => generateAiReport("month"));
generateYearReportBtn.addEventListener("click", () => generateAiReport("year"));
vipAskSend.addEventListener("click", sendVipQuestion);
vipAskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendVipQuestion();
});
loadDemoDataBtn.addEventListener("click", async () => {
    loadDemoDataBtn.disabled = true;
    loadDemoDataBtn.textContent = "Đang nạp dữ liệu...";
    try {
        const result = await loadDemoData();
        setActiveMonth(result.month, false);
        await refreshData();
        await refreshAiInsight();
        switchTab("overview");
    } catch (error) {
        alert(error.message || "Không thể nạp dữ liệu mẫu.");
    } finally {
        loadDemoDataBtn.disabled = false;
        loadDemoDataBtn.textContent = "Nạp dữ liệu mẫu 12 tháng";
    }
});
clearChatBtn.addEventListener("click", () => {
    chatHistory = [];
    chatMessages.innerHTML = "";
    addChatMessage("Đã xóa hội thoại. Bạn có thể hỏi tôi về tháng hiện tại, danh mục rủi ro hoặc kế hoạch tiết kiệm tiếp theo.");
});

starterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        chatInput.value = chip.dataset.question;
        sendChatMessage();
    });
});

tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
});

exportCsv.addEventListener("click", () => {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    const url = `/api/export/csv?${params.toString()}`;
    window.open(url, "_blank");
});

exportReport.addEventListener("click", () => {
    const params = new URLSearchParams();
    if (filterMonth.value) {
        params.set("month", filterMonth.value);
    }
    appendSourceParam(params);
    window.open(`/api/export/report?${params.toString()}`, "_blank");
});

authLoginBtn.addEventListener("click", async () => {
    authStatus.textContent = "Đang đăng nhập...";
    try {
        const result = await submitAuth("login");
        authStatus.textContent = result.message;
        authPassword.value = "";
        await refreshAuthStatus();
    } catch (error) {
        authStatus.textContent = error.message || "Đăng nhập thất bại.";
    }
});

authRegisterBtn.addEventListener("click", async () => {
    authStatus.textContent = "Đang tạo tài khoản...";
    try {
        const result = await submitAuth("register");
        authStatus.textContent = result.message;
        authPassword.value = "";
        await refreshAuthStatus();
    } catch (error) {
        authStatus.textContent = error.message || "Không thể tạo tài khoản.";
    }
});

authLogoutBtn.addEventListener("click", async () => {
    try {
        const result = await logoutAuth();
        authStatus.textContent = result.message;
        await refreshAuthStatus();
    } catch (error) {
        authStatus.textContent = error.message || "Không thể đăng xuất.";
    }
});

backupDbBtn.addEventListener("click", async () => {
    dataStatus.textContent = "Đang chuẩn bị backup DB...";
    try {
        await downloadBackupDatabase();
        dataStatus.textContent = "Đã tải backup DB.";
    } catch (error) {
        dataStatus.textContent = error.message || "Không thể tải backup DB.";
    }
});

restoreForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!restoreFile.files.length) {
        dataStatus.textContent = "Vui lòng chọn file backup SQLite.";
        return;
    }
    if (!confirm("Restore sẽ thay database hiện tại. App sẽ tạo bản .bak trước khi ghi đè. Tiếp tục?")) {
        return;
    }
    dataStatus.textContent = "Đang restore database...";
    try {
        const result = await restoreDatabase();
        dataStatus.textContent = result.message;
        await refreshData();
        await refreshAuthStatus();
    } catch (error) {
        dataStatus.textContent = error.message || "Restore thất bại.";
    }
});

resetSessionBtn?.addEventListener("click", async () => {
    sessionStatus.textContent = "Đang làm mới phiên...";
    resetSessionBtn.disabled = true;
    try {
        await resetClientSessionState();
        await refreshAuthStatus();
        await refreshAiHealthStatus();
        sessionStatus.textContent = "Đã làm mới phiên. Bạn có thể thử lại thao tác vừa lỗi.";
    } catch (error) {
        sessionStatus.textContent = error.message || "Không thể làm mới phiên.";
    } finally {
        resetSessionBtn.disabled = false;
    }
});

csvFile.addEventListener("change", () => {
    populateCsvMappingOptions([]);
    csvPreview.className = "csv-preview empty-state";
    csvPreview.textContent = csvFile.files.length
        ? "Bấm “Xem trước” để app đọc header và gợi ý mapping cột."
        : "Chọn file rồi bấm “Xem trước” để kiểm tra mapping trước khi import.";
    csvImportResult.textContent = "Chưa import file nào.";
});

csvPreviewSubmit.addEventListener("click", async () => {
    if (!csvFile.files.length) {
        csvPreview.textContent = "Vui lòng chọn file CSV/TSV/XLSX.";
        return;
    }
    csvPreviewSubmit.disabled = true;
    csvPreviewSubmit.textContent = "Đang preview...";
    csvPreview.textContent = "Đang đọc file và chuẩn hóa vài dòng đầu...";
    try {
        const result = await previewCsvFile();
        csvPreview.className = "csv-preview";
        renderCsvPreview(result);
    } catch (error) {
        csvPreview.className = "csv-preview empty-state";
        csvPreview.textContent = error.message || "Không thể preview file.";
    } finally {
        csvPreviewSubmit.disabled = false;
        csvPreviewSubmit.textContent = "Xem trước";
    }
});

csvImportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!csvFile.files.length) {
        csvImportResult.textContent = "Vui lòng chọn file CSV/TSV/XLSX.";
        return;
    }
    csvImportSubmit.disabled = true;
    csvImportSubmit.textContent = "Đang import...";
    csvImportResult.textContent = "Đang đọc file...";
    try {
        const result = await importCsvFile();
        const errorPreview = (result.errors || [])
            .slice(0, 3)
            .map((item) => `Dòng ${item.row}: ${item.error}`)
            .join(" | ");
        csvImportResult.innerHTML = `
            <strong>${escapeHtml(result.message || "Đã import file")}</strong>
            <p>Thêm mới: ${Number(result.inserted || 0)} · Bỏ qua trùng: ${Number(result.skippedDuplicates || 0)} · Lỗi: ${Number(result.errorCount || 0)}</p>
            ${errorPreview ? `<p>${escapeHtml(errorPreview)}</p>` : ""}
        `;
        await refreshData();
    } catch (error) {
        csvImportResult.textContent = error.message || "Import file thất bại.";
    } finally {
        csvImportSubmit.disabled = false;
        csvImportSubmit.textContent = "Import file";
    }
});

csvClearImport?.addEventListener("click", async () => {
    const confirmed = window.confirm("Xóa tất cả giao dịch đã import? Dữ liệu mẫu và giao dịch nhập tay sẽ được giữ lại.");
    if (!confirmed) {
        return;
    }
    csvClearImport.disabled = true;
    csvImportResult.textContent = "Đang xóa dữ liệu import...";
    try {
        const result = await clearImportedTransactions();
        csvImportResult.innerHTML = `
            <strong>${escapeHtml(result.message || "Đã xóa dữ liệu import")}</strong>
            <p>Đã xóa: ${Number(result.deleted || 0)} giao dịch import.</p>
        `;
        await refreshData();
    } catch (error) {
        csvImportResult.textContent = error.message || "Không thể xóa dữ liệu import.";
    } finally {
        csvClearImport.disabled = false;
    }
});

async function deleteTransaction(id) {
    await requestJson(`/api/transactions/${id}`, { method: "DELETE" });
}

async function deleteGoal(id) {
    await requestJson(`/api/goals/${id}`, { method: "DELETE" });
}

async function deleteBudget(id) {
    await requestJson(`/api/budgets/${id}`, { method: "DELETE" });
}

function addChatMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${isUser ? 'user' : 'ai'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage(message, true);
    const outgoingHistory = chatHistory.slice(-8);
    chatHistory.push({ role: "user", content: message });
    chatInput.value = "";

    // Show typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message ai typing";
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const data = await askAi(message, outgoingHistory);

        // Remove typing indicator
        chatMessages.removeChild(typingDiv);
        const responseText = data.source === "local-fallback" && data.message
            ? `${data.response}\n\n${data.message}`
            : data.response;
        addChatMessage(responseText);
        chatHistory.push({ role: "assistant", content: data.response });
    } catch (error) {
        // Remove typing indicator
        if (chatMessages.contains(typingDiv)) {
            chatMessages.removeChild(typingDiv);
        }
        addChatMessage(error.message || "Không thể kết nối với AI. Vui lòng thử lại.");
    }
}

chatSend.addEventListener("click", sendChatMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
});

// Add welcome message
addChatMessage("Xin chào! Tôi là AI tài chính của bạn. Hãy hỏi tôi về tiết kiệm, chi tiêu, đầu tư, ngân sách hoặc mục tiêu nhé! 💰");

populateCsvMappingOptions([]);
initTheme();
initTabs();
refreshAuthStatus();
refreshPwaStatus();
refreshAiHealthStatus();
refreshData();

function setDefaultTransactionDate() {
    const today = todayLocalISO();
    transactionDateInput.value = today;
    transactionDateInput.removeAttribute("max");
}
