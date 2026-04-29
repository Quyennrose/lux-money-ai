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
const languageSelect = document.getElementById("language-select");
const languageViBtn = document.getElementById("language-vi");
const languageEnBtn = document.getElementById("language-en");
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
let currentLanguage = localStorage.getItem("lux-money-language") || "vi";
let languageObserver = null;
const originalTextNodes = new WeakMap();

const LANGUAGE_TEXT = {
    "Ngôn ngữ": "Language",
    "Tiếng Việt": "Vietnamese",
    "Chọn giao diện": "Theme",
    "Sáng": "Light",
    "Tối": "Dark",
    "Bảng điều khiển tài chính thông minh": "Money intelligence dashboard",
    "THU": "IN",
    "CHI": "OUT",
    "RÒNG": "NET",
    "RR": "RISK",
    "SK": "HLTH",
    "NS": "BUD",
    "TK": "SAVE",
    "Theo dõi dòng tiền, ngân sách và thói quen chi tiêu theo từng tháng với AI phân tích thực tế.": "Track cash flow, budgets, and monthly spending behavior with practical AI analysis.",
    "Tổng quan": "Overview",
    "Giao dịch": "Transactions",
    "Ngân sách": "Budgets",
    "Định kỳ": "Recurring",
    "Mục tiêu": "Goals",
    "Dữ liệu": "Data",
    "Tổng quan theo tháng": "Monthly Overview",
    "Chọn tháng để bảng điều khiển, ngân sách, giao dịch và phân tích AI chỉ tính trên đúng kỳ đó.": "Choose a month so dashboard metrics, budgets, transactions, and AI insights use the same period.",
    "Tháng đang xem": "Selected month",
    "Thêm giao dịch": "Add Transaction",
    "Mô tả": "Description",
    "Ví dụ: Mua đồ siêu thị": "Example: Grocery shopping",
    "Số tiền": "Amount",
    "Ngày giao dịch": "Transaction date",
    "Loại": "Type",
    "Chi tiêu": "Expense",
    "Thu nhập": "Income",
    "Danh mục": "Category",
    "Tự động (dựa trên mô tả)": "Automatic (based on description)",
    "Ăn uống": "Food",
    "Đi lại": "Transport",
    "Giải trí": "Entertainment",
    "Hóa đơn": "Bills",
    "Mua sắm": "Shopping",
    "Tiết kiệm": "Savings",
    "Đầu tư": "Investment",
    "Khác": "Other",
    "Lưu giao dịch": "Save transaction",
    "Hủy chỉnh sửa": "Cancel edit",
    "Ngân sách tháng": "Monthly Budget",
    "Số tiền ngân sách": "Budget amount",
    "Tháng": "Month",
    "Lưu ngân sách": "Save budget",
    "Mục tiêu tiết kiệm": "Savings Goals",
    "Tên mục tiêu": "Goal name",
    "Ví dụ: Du lịch": "Example: Travel",
    "Số tiền cần đạt": "Target amount",
    "Tiền đã tiết kiệm": "Saved amount",
    "Hạn chót": "Deadline",
    "Lưu mục tiêu": "Save goal",
    "Tóm tắt dòng tiền": "Cash Flow Summary",
    "Các chỉ số chính của tháng đang xem, trình bày gọn để quét nhanh trên desktop.": "Key metrics for the selected month, optimized for quick desktop scanning.",
    "Số dư": "Balance",
    "Trung bình": "Medium",
    "Ngân sách tuân thủ": "Budget adherence",
    "Tỷ lệ tiết kiệm": "Saving rate",
    "Top danh mục": "Top category",
    "Chi lớn nhất": "Largest expense",
    "Điểm VIP": "VIP Score",
    "Rủi ro VIP": "VIP Risk",
    "Chỉ số sức khỏe": "Health Index",
    "Trung tâm giao dịch": "Transaction Command Center",
    "Lọc, tìm kiếm, sắp xếp và rà soát giao dịch theo tháng.": "Filter, search, sort, and review transactions by month.",
    "Xuất báo cáo CSV": "Export CSV",
    "Xuất báo cáo HTML": "Export HTML report",
    "Nguồn dữ liệu": "Data source",
    "Tất cả": "All",
    "Dữ liệu mẫu": "Sample data",
    "Dữ liệu thật": "Real data",
    "Nhập tay": "Manual entry",
    "Nhập CSV": "CSV import",
    "Ví dụ: Ăn uống": "Example: Food",
    "Tìm kiếm": "Search",
    "Tìm theo ghi chú...": "Search by note...",
    "Sắp xếp": "Sort",
    "Mới nhất": "Newest",
    "Cũ nhất": "Oldest",
    "Số tiền cao nhất": "Highest amount",
    "Số tiền thấp nhất": "Lowest amount",
    "Nhập giao dịch": "Import Transactions",
    "Tải lên file CSV, TSV hoặc XLSX từ ngân hàng/file tự xuất. Bỏ trống ánh xạ nếu file dùng tên cột phổ biến như ngày, số tiền, ghi chú.": "Upload a bank CSV, TSV, XLSX, or exported file. Leave mapping blank if the file uses common column names such as date, amount, or note.",
    "File CSV/TSV/XLSX": "CSV/TSV/XLSX file",
    "Định dạng ngày": "Date format",
    "Tự nhận diện": "Auto detect",
    "Cột ngày": "Date column",
    "Cột số tiền": "Amount column",
    "Cột debit": "Debit column",
    "Cột credit": "Credit column",
    "Cột ghi chú": "Note column",
    "Cột loại": "Type column",
    "Cột danh mục": "Category column",
    "Không dùng": "Not used",
    "Tự phân loại": "Auto categorize",
    "Xem trước": "Preview",
    "Nhập file": "Import file",
    "Xóa dữ liệu đã nhập": "Clear imported data",
    "Chọn file rồi bấm “Xem trước” để kiểm tra ánh xạ trước khi nhập.": "Choose a file and click Preview to check column mapping before import.",
    "Chưa nhập file nào.": "No file imported yet.",
    "Xu hướng theo tháng": "Monthly Trends",
    "Phân tích 12 tháng": "12-Month Analytics",
    "Nhìn nhanh dòng tiền, tỷ lệ tiết kiệm và tháng có chi tiêu cao nhất.": "Quickly review cash flow, saving rate, and the highest-spending month.",
    "So với trung bình 12 tháng": "Compared with 12-month average",
    "Bản đồ nhiệt chi tiêu tháng": "Monthly spending heatmap",
    "Xu hướng top danh mục": "Top category trend",
    "Phân tích tài chính": "Financial Analysis",
    "Xu hướng:": "Trend:",
    "Đang tải...": "Loading...",
    "Thu nhập dự báo 30 ngày:": "30-day forecast income:",
    "Chi tiêu dự báo 30 ngày:": "30-day forecast expenses:",
    "Tiết kiệm đề xuất:": "Suggested savings:",
    "Góc nhìn VIP từ LUX AI": "Lux AI VIP Insights",
    "Bản phân tích điều hành cho tháng hiện tại: rủi ro, cơ hội và hành động ưu tiên.": "Executive analysis for the current month: risks, opportunities, and priority actions.",
    "Nạp dữ liệu mẫu 12 tháng": "Load 12-month sample data",
    "Tổng quan VIP": "VIP Overview",
    "Tải dữ liệu để hiển thị gợi ý VIP.": "Load data to show VIP suggestions.",
    "Ưu tiên hành động": "Priority actions",
    "Rủi ro": "Risk",
    "Hỏi LUX AI ngay trên bảng điều khiển": "Ask Lux AI from the dashboard",
    "Ví dụ: “Tháng này tôi chi nhiều nhất ở đâu?” hoặc “Làm sao tiết kiệm hơn tháng sau?”": "Example: “Where did I spend the most this month?” or “How can I save more next month?”",
    "Nhập câu hỏi bất kỳ về dữ liệu tài chính...": "Ask any question about your financial data...",
    "Hỏi AI": "Ask AI",
    "AI sẽ trả lời dựa trên giao dịch thật trong ứng dụng.": "AI will answer based on transactions in the app.",
    "Chiến lược tài chính cá nhân": "Personal Financial Strategy",
    "Phong cách tài chính": "Financial style",
    "Giới hạn chi tiêu": "Spending limit",
    "Tiết kiệm mục tiêu": "Target savings",
    "Mục tiêu ưu tiên": "Priority goal",
    "Bản đồ tài chính": "Financial blueprint",
    "Các bước thông minh sẽ hiện ra sau khi bạn nhập dữ liệu.": "Smart next steps will appear after you enter data.",
    "Kế hoạch tối ưu": "Optimization Plan",
    "Phân bổ theo danh mục": "Category Breakdown",
    "Tiến trình ngân sách": "Budget Progress",
    "Gợi ý ngân sách tháng sau": "Next Month Budget Suggestions",
    "Dựa trên chi tiêu gần đây để đề xuất mức ngân sách thực tế hơn.": "Based on recent spending to suggest more realistic budget targets.",
    "Danh sách ngân sách": "Budget List",
    "Khoản định kỳ": "Recurring Items",
    "Tự phát hiện các khoản lặp lại như thuê nhà, hóa đơn, đăng ký dịch vụ hoặc đầu tư định kỳ từ giao dịch hiện có.": "Automatically detects recurring items such as rent, bills, subscriptions, or scheduled investments from existing transactions.",
    "Hỏi AI Tài Chính": "Ask Financial AI",
    "Phân tích chi tiêu bằng AI": "AI Spending Insights",
    "Phân tích giao dịch bằng OpenAI và đề xuất hành động tiếp theo.": "Analyze transactions with OpenAI and suggest next actions.",
    "Tạo phân tích AI": "Generate AI insight",
    "Báo cáo tháng": "Monthly report",
    "Báo cáo 12 tháng": "12-month report",
    "Sẵn sàng phân tích dữ liệu giao dịch.": "Ready to analyze transaction data.",
    "Đang kiểm tra chế độ AI...": "Checking AI mode...",
    "Chưa tạo phân tích chi tiêu bằng AI.": "No AI Spending Insight generated yet.",
    "Bấm “Tạo phân tích AI” để xem tóm tắt theo tháng đang chọn, gồm tổng quan, mẫu chi tiêu và hành động nên làm.": "Click Generate AI insight to view a brief for the selected month, including summary, spending patterns, and recommended actions.",
    "Trợ lý LUX AI": "Lux AI Assistant",
    "Hỏi tự do về chi tiêu, ngân sách, so sánh tháng và kế hoạch tiết kiệm. AI sẽ dùng dữ liệu giao dịch hiện có.": "Ask freely about spending, budgets, month comparisons, and saving plans. AI uses the available transaction data.",
    "Phạm vi": "Scope",
    "Tháng đang xem": "Selected month",
    "12 tháng gần nhất": "Last 12 months",
    "Hỏi AI về tài chính của bạn...": "Ask AI about your finances...",
    "Gửi": "Send",
    "Xóa hội thoại": "Clear chat",
    "Giao dịch theo tháng": "Monthly Transactions",
    "Dữ liệu, tài khoản & cài đặt ứng dụng": "Data, Account & App Settings",
    "Sao lưu/khôi phục SQLite, đăng nhập cục bộ và cài ứng dụng như PWA. Dữ liệu mẫu hiện tại không bị xóa trừ khi bạn khôi phục DB khác.": "Backup/restore SQLite, local login, and install the app as a PWA. Current sample data is not deleted unless you restore another database.",
    "Tài khoản cục bộ": "Local account",
    "Đang kiểm tra trạng thái...": "Checking status...",
    "Tên hiển thị": "Display name",
    "Tên của bạn": "Your name",
    "Mật khẩu": "Password",
    "Tối thiểu 6 ký tự": "At least 6 characters",
    "Đăng nhập": "Log in",
    "Tạo tài khoản": "Create account",
    "Đăng xuất": "Log out",
    "Sao lưu / Khôi phục": "Backup / Restore",
    "Sao lưu tải file `finance.db`. Khôi phục sẽ thay DB hiện tại và ứng dụng tự tạo bản `.bak` trước khi ghi đè. Trên web công khai, phần này chỉ dành cho quản trị viên.": "Backup downloads the `finance.db` file. Restore replaces the current database and creates a `.bak` file before overwriting. On public deployments, this is admin-only.",
    "Tải bản sao lưu DB": "Download DB backup",
    "File sao lưu SQLite": "SQLite backup file",
    "Khôi phục DB": "Restore DB",
    "Chưa có thao tác dữ liệu.": "No data action yet.",
    "Ứng dụng có manifest và service worker để chạy giống ứng dụng đã cài trên máy hỗ trợ PWA.": "The app has a manifest and service worker so supported browsers can run it like an installed app.",
    "Đang kiểm tra PWA...": "Checking PWA...",
    "Sửa lỗi phiên": "Session fix",
    "Dùng khi trình duyệt báo CSRF token không hợp lệ sau khi server khởi động lại, đăng nhập/đăng xuất hoặc PWA lưu bản cũ.": "Use this when the browser reports an invalid CSRF token after server restart, login/logout, or an old PWA cache.",
    "Làm mới phiên": "Refresh session",
    "Sẵn sàng.": "Ready.",
    "Chỉnh sửa giao dịch": "Edit transaction",
    "Cập nhật ngày, danh mục, số tiền và ghi chú.": "Update date, category, amount, and note.",
    "Ghi chú": "Note",
    "Ngày": "Date",
    "Lưu thay đổi": "Save changes",
    "Hủy": "Cancel",
    "Đang phân tích...": "Analyzing...",
    "Đang tải...": "Loading...",
    "Ổn định": "Stable",
    "Cao": "High",
    "Thấp": "Low",
    "Tăng": "Increasing",
    "Giảm": "Decreasing",
    "Chưa xác định": "Not determined",
    "Chưa có ngân sách": "No budget yet",
    "Còn trong ngân sách": "Within budget",
    "Vượt ngân sách": "Over budget",
    "Chưa có dữ liệu": "No data yet",
    "Không có mục tiêu cần ưu tiên": "No priority goal",
    "Không đủ dữ liệu": "Not enough data",
    "Dữ liệu hiện ổn định. Tiếp tục cập nhật giao dịch để AI đưa ra gợi ý chính xác hơn.": "Data looks stable. Keep updating transactions so AI can provide more accurate suggestions.",
    "Mẹo AI: Theo dõi chi tiêu hàng ngày để tránh vượt ngân sách bất ngờ.": "AI tip: Track daily spending to avoid unexpected budget overruns.",
    "Gợi ý: Đặt mục tiêu tiết kiệm cụ thể để có động lực tài chính.": "Suggestion: Set a specific savings goal to stay motivated.",
    "Cảnh báo: Chi tiêu chiếm >80% thu nhập. Hãy lập kế hoạch tiết kiệm khẩn cấp.": "Warning: Spending is above 80% of income. Build an urgent savings plan.",
    "Đã import file": "File imported",
    "Đã xóa dữ liệu import": "Imported data deleted",
    "Đã đăng nhập": "Signed in",
    "Đã đăng xuất": "Signed out",
    "Đã tạo tài khoản": "Account created",
    "Đã restore database thành công. Hãy refresh trang để tải lại dữ liệu.": "Database restored successfully. Refresh the page to reload data.",
    "Đã nạp dữ liệu mẫu 12 tháng. Dữ liệu thật của bạn không bị xóa.": "Loaded 12-month sample data. Your real data was not deleted."
};

function translationFor(value) {
    const text = String(value ?? "");
    const trimmed = text.trim();
    if (!trimmed) {
        return text;
    }
    const translated = LANGUAGE_TEXT[trimmed];
    if (!translated) {
        return text;
    }
    return text.replace(trimmed, translated);
}

function translateText(value) {
    return currentLanguage === "en" ? translationFor(value) : value;
}

function t(viText, enText) {
    return currentLanguage === "en" ? enText : viText;
}

const CATEGORY_LABELS_EN = {
    "Ăn uống": "Food",
    "Đi lại": "Transport",
    "Giải trí": "Entertainment",
    "Hóa đơn": "Bills",
    "Mua sắm": "Shopping",
    "Tiết kiệm": "Savings",
    "Đầu tư": "Investment",
    "Khác": "Other",
    "Nhà ở": "Housing",
    "Sức khỏe": "Health",
    "Du lịch": "Travel",
    "Học tập": "Education",
    "Lương": "Salary",
};

const NOTE_LABELS_EN = {
    "Cafe và ăn trưa": "Coffee and lunch",
    "Du lịch ngắn ngày": "Short trip",
    "Grab và gửi xe đi làm": "Grab and work parking",
    "Khám sức khỏe định kỳ": "Routine health check",
    "Khóa học và sách": "Courses and books",
    "Lương tháng": "Monthly salary",
    "Mua thực phẩm siêu thị": "Supermarket groceries",
    "Mua đồ cá nhân": "Personal shopping",
    "Netflix và xem phim": "Netflix and movies",
    "Thưởng dự án": "Project bonus",
    "Tiền thuê nhà": "Rent payment",
    "Ăn ngoài cuối tuần": "Weekend dining out",
    "Điện nước và internet": "Utilities and internet",
    "Đầu tư ETF định kỳ": "Recurring ETF investment",
};

function displayCategory(value) {
    return currentLanguage === "en" ? (CATEGORY_LABELS_EN[value] || value || "") : (value || "");
}

function displayNote(value) {
    return currentLanguage === "en" ? (NOTE_LABELS_EN[value] || value || "") : (value || "");
}

function setElementLanguageText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (!originalTextNodes.has(node)) {
            originalTextNodes.set(node, node.nodeValue);
        }
        const original = originalTextNodes.get(node);
        node.nodeValue = currentLanguage === "en" ? translationFor(original) : original;
        return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    ["placeholder", "data-placeholder", "title", "aria-label"].forEach((attr) => {
        if (!node.hasAttribute(attr)) {
            return;
        }
        const key = `i18nOriginal${attr.replace(/[^a-z]/gi, "")}`;
        if (!node.dataset[key]) {
            node.dataset[key] = node.getAttribute(attr);
        }
        const original = node.dataset[key];
        node.setAttribute(attr, currentLanguage === "en" ? translationFor(original) : original);
    });
}

function applyLanguage(root = document.body) {
    document.documentElement.lang = currentLanguage;
    document.title = currentLanguage === "en"
        ? "Lux Money AI - Personal Finance Dashboard"
        : "Lux Money AI - Bảng điều khiển tài chính cá nhân";
    setElementLanguageText(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
        setElementLanguageText(walker.currentNode);
    }
    languageViBtn?.classList.toggle("active", currentLanguage === "vi");
    languageEnBtn?.classList.toggle("active", currentLanguage === "en");
    if (languageSelect && languageSelect.value !== currentLanguage) {
        languageSelect.value = currentLanguage;
    }
}

function setLanguage(language) {
    currentLanguage = language === "en" ? "en" : "vi";
    localStorage.setItem("lux-money-language", currentLanguage);
    applyLanguage();
    refreshAiHealthStatus();
    refreshData();
}

function initLanguage() {
    languageSelect?.addEventListener("change", () => setLanguage(languageSelect.value));
    languageViBtn?.addEventListener("click", () => setLanguage("vi"));
    languageEnBtn?.addEventListener("click", () => setLanguage("en"));
    applyLanguage();
}

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
    if (!year || !month || !day) {
        return value;
    }
    return currentLanguage === "en" ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
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
    params.set("language", currentLanguage);
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
        body: JSON.stringify({ message, history, month: filterMonth.value, scope: aiScope.value, source: activeSource(), language: currentLanguage }),
    });
    return data;
}

async function fetchAiReport(scope) {
    return requestJson("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: filterMonth.value, scope, source: activeSource(), language: currentLanguage }),
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
        throw new Error(data.error || t("Không thể tải bản sao lưu DB.", "Could not download DB backup."));
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
        csvPreview.innerHTML = `<div class="empty-state">${t(`File có ${data.totalRows || 0} dòng nhưng chưa đọc được dòng xem trước hợp lệ.`, `The file has ${data.totalRows || 0} rows, but no valid preview rows could be read.`)}</div>`;
        return;
    }

    const rowHtml = rows.map((item) => {
        const tx = item.transaction || {};
        return `
            <tr>
                <td>${item.row}</td>
                <td>${escapeHtml(formatDate(tx.date))}</td>
                <td>${escapeHtml(tx.type === "income" ? t("Thu", "Income") : t("Chi", "Expense"))}</td>
                <td>${escapeHtml(displayCategory(tx.category))}</td>
                <td>${escapeHtml(displayNote(tx.note))}</td>
                <td>${formatCurrency(tx.amount)}</td>
            </tr>
        `;
    }).join("");
    const errorHtml = errors.length ? `
        <div class="csv-preview-errors">
            ${errors.map((item) => `<p>${t("Dòng", "Row")} ${item.row}: ${escapeHtml(item.error)}</p>`).join("")}
        </div>
    ` : "";

    csvPreview.innerHTML = `
        <div class="csv-preview-header">
            <strong>${t("Xem trước", "Preview")} ${rows.length}/${data.totalRows || rows.length} ${t("dòng", "rows")}</strong>
            <span>${t("Ánh xạ đã được gợi ý tự động. Định dạng ngày:", "Mapping was suggested automatically. Date format:")} ${escapeHtml(data.suggestedMapping?.date_order || "auto")}. ${t("Có thể chỉnh danh sách chọn rồi bấm “Xem trước” lại.", "Adjust the dropdowns and click Preview again if needed.")}</span>
        </div>
        <div class="csv-preview-table-wrap">
            <table class="csv-preview-table">
                <thead>
                    <tr>
                        <th>${t("Dòng", "Row")}</th>
                        <th>${t("Ngày", "Date")}</th>
                        <th>${t("Loại", "Type")}</th>
                        <th>${t("Danh mục", "Category")}</th>
                        <th>${t("Ghi chú", "Note")}</th>
                        <th>${t("Số tiền", "Amount")}</th>
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
                label: t("Thu nhập", "Income"),
                data: incomeData,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
            }, {
                label: t("Chi tiêu", "Expense"),
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
        categoryBreakdown.innerHTML = `<p>${t("Chưa có dữ liệu phân bổ danh mục.", "No category breakdown data yet.")}</p>`;
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
            <span>${escapeHtml(displayCategory(category))}</span>
            <span>${formatCurrency(amount)}</span>
        `;
        categoryBreakdown.appendChild(item);
        labels.push(displayCategory(category));
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
        budgetProgress.innerHTML = `<p>${t("Chưa có ngân sách tháng.", "No monthly budget yet.")}</p>`;
        return;
    }
    items.forEach((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "budget-item";
        const usedPercent = clampPercent(item.usedPercent);
        wrapper.innerHTML = `
            <div class="budget-header">
                <span>${escapeHtml(displayCategory(item.category))}</span>
                <span>${formatCurrency(item.spent)} / ${formatCurrency(item.budgetAmount)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${usedPercent}%"></div>
            </div>
            <p class="budget-status">${escapeHtml(translateText(item.status))} - ${usedPercent}%</p>
        `;
        budgetProgress.appendChild(wrapper);
    });
}

function renderBudgetList(items, progressItems = []) {
    const budgetList = document.getElementById("budget-list");
    budgetList.innerHTML = "";
    if (!items || items.length === 0) {
        budgetList.innerHTML = `<p>${t("Chưa có ngân sách cho tháng này. Tạo ngân sách theo danh mục, app sẽ tự cập nhật phần đã dùng từ giao dịch.", "No budget for this month yet. Create category budgets and the app will update spending from transactions automatically.")}</p>`;
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
                <span>${escapeHtml(displayCategory(item.category))}</span>
                <span>${formatCurrency(spentValue)} / ${formatCurrency(budgetValue)}</span>
            </div>
            <div class="budget-auto-row">
                <span>${t("Tháng", "Month")}: ${escapeHtml(item.month)}</span>
                <span>${escapeHtml(translateText(statusText))}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${remainingValue < 0 ? "danger-fill" : ""}" style="width: ${usedPercent}%"></div>
            </div>
            <div class="budget-auto-row">
                <span>${t("Đã dùng từ giao dịch", "Used from transactions")}: ${formatCurrency(spentValue)}</span>
                <span>${remainingValue >= 0 ? t("Còn lại", "Remaining") : t("Vượt", "Over")}: ${formatCurrency(Math.abs(remainingValue))}</span>
            </div>
            <div class="transaction-actions">
                <button class="edit-button" data-id="${item.id}">${t("Sửa", "Edit")}</button>
                <button class="delete-button" data-id="${item.id}">${t("Xóa ngân sách", "Delete budget")}</button>
            </div>
        `;
        wrapper.querySelector(".edit-button").addEventListener("click", () => startEditBudget(item));
        wrapper.querySelector(".delete-button").addEventListener("click", async () => {
            try {
                await deleteBudget(item.id);
                await refreshData();
            } catch (error) {
                alert(error.message || t("Xóa ngân sách thất bại. Vui lòng thử lại.", "Could not delete the budget. Please try again."));
            }
        });
        budgetList.appendChild(wrapper);
    });
}

function renderGoals(items) {
    goalsList.innerHTML = "";
    if (!items || items.length === 0) {
        goalsList.innerHTML = `<p>${t("Chưa có mục tiêu tiết kiệm.", "No savings goals yet.")}</p>`;
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
            <p>${formatCurrency(item.savedAmount)} / ${formatCurrency(item.targetAmount)} - ${t("Hạn", "Deadline")}: ${escapeHtml(item.deadline)}</p>
            <button class="delete-button" data-id="${item.id}">${t("Xóa mục tiêu", "Delete goal")}</button>
        `;
        const deleteBtn = wrapper.querySelector(".delete-button");
        deleteBtn.addEventListener("click", async () => {
            try {
                await deleteGoal(item.id);
                await refreshData();
            } catch (error) {
                alert(error.message || t("Xóa mục tiêu thất bại. Vui lòng thử lại.", "Could not delete the goal. Please try again."));
            }
        });
        goalsList.appendChild(wrapper);
    });
}

function renderOptimizationPlan(optimization) {
    optimizationPlan.innerHTML = "";
    if (!optimization) {
        optimizationPlan.innerHTML = `<p>${t("Không có dữ liệu tối ưu hóa.", "No optimization data available.")}</p>`;
        return;
    }
    const actions = document.createElement("div");
    actions.className = "optimization-actions";
    actions.innerHTML = `<h3>${t("Hành động đề xuất", "Recommended actions")}</h3>`;
    optimization.actions.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        actions.appendChild(p);
    });

    const summary = document.createElement("div");
    summary.className = "optimization-summary";
    summary.innerHTML = `
        <p><strong>${t("Dư khả dụng hàng tháng:", "Monthly available surplus:")}</strong> ${formatCurrency(optimization.availableSavings)}</p>
    `;

    const topList = document.createElement("div");
    topList.className = "optimization-block";
    topList.innerHTML = `<h4>${t("Top chi phí lớn", "Largest expenses")}</h4>`;
    optimization.topExpenseCategories.forEach((item) => {
        const row = document.createElement("div");
        row.className = "optimization-row";
        row.innerHTML = `<span>${escapeHtml(displayCategory(item.category))}</span><span>${formatCurrency(item.amount)}</span><p>${escapeHtml(currentLanguage === "en" ? translateText(item.suggestion) : item.suggestion)}</p>`;
        topList.appendChild(row);
    });

    const goalList = document.createElement("div");
    goalList.className = "optimization-block";
    goalList.innerHTML = `<h4>${t("Kế hoạch mục tiêu", "Goal plan")}</h4>`;
    optimization.goalAllocation.forEach((item) => {
        const row = document.createElement("div");
        row.className = "optimization-row";
        row.innerHTML = `<span>${escapeHtml(item.goal)}</span><span>${formatCurrency(item.recommendedMonthly)}</span><p>${escapeHtml(currentLanguage === "en" ? translateText(item.note) : item.note)}</p>`;
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
        riskLevelValue.textContent = t("Đang tải...", "Loading...");
        healthIndexValue.textContent = "--";
        budgetAdherenceValue.textContent = "--";
        return;
    }
    aiScoreValue.textContent = summary.aiScore || 0;
    riskLevelValue.textContent = translateText(summary.riskLevel || "Ổn định");
    healthIndexValue.textContent = summary.healthIndex ? `${summary.healthIndex} / 100` : "--";
    budgetAdherenceValue.textContent = translateText(summary.budgetAdherenceText || "Chưa có ngân sách");
}

function renderFinancialStrategy(summary) {
    if (!summary) {
        financialStyleValue.textContent = t("Đang tải...", "Loading...");
        spendingTargetValue.textContent = t("Đang tải...", "Loading...");
        savingsVelocityValue.textContent = t("Đang tải...", "Loading...");
        priorityGoalValue.textContent = t("Đang tải...", "Loading...");
        financialBlueprintText.textContent = t("Đang phân tích bản đồ tài chính...", "Analyzing your financial blueprint...");
        goalSuggestionList.innerHTML = `<li>${t("Đang tải...", "Loading...")}</li>`;
        return;
    }

    financialStyleValue.textContent = translateText(summary.financialStyle || "Chưa xác định");
    spendingTargetValue.textContent = summary.recommendedExpenseCap ? formatCurrency(summary.recommendedExpenseCap) : t("Chưa có dữ liệu", "No data yet");
    if (summary.monthlySavings || summary.recommendedSavingsGoal) {
        savingsVelocityValue.textContent = `${formatCurrency(summary.monthlySavings)} / ${formatCurrency(summary.recommendedSavingsGoal)}`;
    } else {
        savingsVelocityValue.textContent = t("Chưa có dòng tiền dương", "No positive cash flow yet");
    }
    priorityGoalValue.textContent = translateText(summary.priorityGoal || "Không có mục tiêu cần ưu tiên");
    financialBlueprintText.textContent = currentLanguage === "en"
        ? "Add transactions to receive a financial blueprint."
        : summary.financialBlueprint?.join(" ") || "Thêm giao dịch để nhận bản đồ tài chính.";

    goalSuggestionList.innerHTML = "";
    if (summary.goalRecommendations && summary.goalRecommendations.length > 0) {
        summary.goalRecommendations.forEach((advice) => {
            const item = document.createElement("li");
            item.textContent = currentLanguage === "en" ? translateText(advice) : advice;
            goalSuggestionList.appendChild(item);
        });
    } else {
        goalSuggestionList.innerHTML = `<li>${t("Chưa có đề xuất mục tiêu chi tiêu cụ thể.", "No specific goal suggestions yet.")}</li>`;
    }
}

function renderVipInsights(summary, dashboard) {
    vipInsightsList.innerHTML = "";
    if (!summary) {
        vipInsightsList.innerHTML = `<li>${t("Đang tải phân tích VIP...", "Loading VIP analysis...")}</li>`;
        vipInsightText.textContent = t("Đang phân tích dữ liệu tài chính...", "Analyzing financial data...");
        return;
    }

    const savingsRate = dashboard?.savingsRate ?? (summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 100) : 0);
    const trendTooltip = summary.forecast?.trend || "Ổn định";
    const topCategory = dashboard?.topSpendingCategory;
    const biggestExpense = dashboard?.biggestExpense;
    const comparison = dashboard?.comparison || {};
    const recurring = dashboard?.recurringTransactions || [];
    const topCategoryText = topCategory
        ? t(`${topCategory.category} đang dẫn đầu với ${formatCurrency(topCategory.total)}.`, `${displayCategory(topCategory.category)} leads spending with ${formatCurrency(topCategory.total)}.`)
        : t("Chưa đủ dữ liệu danh mục.", "Not enough category data yet.");
    const riskLabel = translateText(summary.riskLevel || (savingsRate < 10 ? "Cao" : savingsRate < 20 ? "Trung bình" : "Thấp"));
    const monthlyRunway = summary.expense > 0 ? Math.max(1, Math.round(summary.balance / Math.max(summary.expense, 1) * 30)) : 0;

    vipInsightText.textContent = summary.income > 0
        ? t(`Tháng ${dashboard?.month || filterMonth.value}, dòng tiền ròng ${formatCurrency(summary.balance)}, tỷ lệ tiết kiệm ${Number(savingsRate).toFixed(1)}%. ${topCategoryText}`, `Month ${dashboard?.month || filterMonth.value}: net cash flow ${formatCurrency(summary.balance)}, saving rate ${Number(savingsRate).toFixed(1)}%. ${topCategoryText}`)
        : t("Chưa có dữ liệu đủ mạnh. Bấm “Nạp dữ liệu mẫu 12 tháng” để xem bảng điều khiển và phân tích AI đầy đủ.", "Not enough data yet. Click Load 12-month sample data to see the full dashboard and AI insights.");

    vipRunwayValue.textContent = summary.expense > 0 ? t(`${monthlyRunway} ngày`, `${monthlyRunway} days`) : "--";
    vipFocusValue.textContent = topCategory ? displayCategory(topCategory.category) : t("Dữ liệu", "Data");
    vipRiskValue.textContent = riskLabel;

    const overspentCategoryTips = summary.topOverspentCategories || [];
    const insights = [
        t(`Nhịp tài chính: ${trendTooltip.toLowerCase()}, điểm VIP ${summary.aiScore || 0}/100, rủi ro ${riskLabel}.`, `Executive pulse: ${translateText(trendTooltip).toLowerCase()}, VIP score ${summary.aiScore || 0}/100, risk ${riskLabel}.`),
        t(`Tỷ lệ tiết kiệm: ${Number(savingsRate).toFixed(1)}%. ${savingsRate >= 20 ? "Có dư địa tốt để tăng đầu tư hoặc quỹ khẩn cấp." : "Nên đặt trần chi tiêu tuần cho danh mục lớn nhất."}`, `Saving rate: ${Number(savingsRate).toFixed(1)}%. ${savingsRate >= 20 ? "There is room to increase investing or emergency savings." : "Set a weekly cap for the largest spending category."}`),
        t(`Theo dõi danh mục: ${topCategoryText}`, `Category watch: ${topCategoryText}`),
        biggestExpense ? t(`Giao dịch lớn nhất: ${biggestExpense.note} (${formatCurrency(biggestExpense.amount)}).`, `Biggest transaction: ${displayNote(biggestExpense.note)} (${formatCurrency(biggestExpense.amount)}).`) : t("Giao dịch lớn nhất: chưa có dữ liệu chi tiêu tháng này.", "Biggest transaction: no expense data this month yet."),
        comparison.expenseChange !== undefined ? t(`Chênh lệch chi tiêu so với ${comparison.previousMonth}: ${formatCurrency(comparison.expenseChange)}.`, `Month-over-month expense delta: ${formatCurrency(comparison.expenseChange)} versus ${comparison.previousMonth}.`) : t("So với tháng trước: cần thêm dữ liệu tháng trước.", "Month-over-month: more previous-month data is needed."),
    ];
    if (recurring.length) {
        insights.push(t(`Khoản định kỳ: ${recurring.slice(0, 3).map((item) => item.note).join(", ")}.`, `Recurring radar: ${recurring.slice(0, 3).map((item) => displayNote(item.note)).join(", ")}.`));
    }
    overspentCategoryTips.forEach((tip) => insights.push(t(`Cảnh báo ngân sách: ${tip}`, `Budget alert: ${tip}`)));

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
        analyticsSummary.innerHTML = `<div class="empty-state compact-empty">${t("Chưa đủ dữ liệu 12 tháng để phân tích.", "Not enough 12-month data to analyze yet.")}</div>`;
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
        [t("Tổng thu", "Total income"), formatCurrency(summary.totalIncome)],
        [t("Tổng chi", "Total expense"), formatCurrency(summary.totalExpense)],
        [t("Dòng tiền ròng", "Net cash flow"), formatCurrency(summary.totalCashFlow)],
        [t("Chi TB/tháng", "Avg. monthly expense"), formatCurrency(summary.averageMonthlyExpense)],
        [t("Tỷ lệ tiết kiệm TB", "Avg. saving rate"), `${Number(summary.averageSavingsRate || 0).toFixed(1)}%`],
        [t("Tháng chi cao nhất", "Highest expense month"), summary.highestExpenseMonth ? `${summary.highestExpenseMonth.month} - ${formatCurrency(summary.highestExpenseMonth.total_expense)}` : "--"],
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
                <span>${t("Chi tiêu", "Expense")}</span>
                <strong>${expenseDelta <= 0 ? t("Thấp hơn", "Lower by") : t("Cao hơn", "Higher by")} ${formatCurrency(Math.abs(expenseDelta))}</strong>
            </div>
            <div class="comparison-row ${cashFlowDelta >= 0 ? "positive" : "negative"}">
                <span>${t("Dòng tiền", "Cash flow")}</span>
                <strong>${cashFlowDelta >= 0 ? "+" : "-"}${formatCurrency(Math.abs(cashFlowDelta))}</strong>
            </div>
            <div class="comparison-row ${savingsRateDelta >= 0 ? "positive" : "negative"}">
                <span>${t("Tỷ lệ tiết kiệm", "Saving rate")}</span>
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
                label: t("Dòng tiền ròng", "Net cash flow"),
                data: cashFlow,
                backgroundColor: cashFlow.map((value) => value >= 0 ? "rgba(34, 197, 94, 0.65)" : "rgba(239, 68, 68, 0.65)"),
                borderRadius: 8,
                yAxisID: "y",
            }, {
                type: "line",
                label: t("Tỷ lệ tiết kiệm %", "Saving rate %"),
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
                    label: displayCategory(item.category),
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
        budgetSuggestions.innerHTML = `<p class="empty-state">${t("Chưa đủ dữ liệu để gợi ý ngân sách. Hãy thêm giao dịch trong vài tháng.", "Not enough data for budget suggestions yet. Add transactions for a few months.")}</p>`;
        return;
    }
    items.slice(0, 6).forEach((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "budget-item suggestion-item";
        wrapper.innerHTML = `
            <div class="budget-header">
                <span>${escapeHtml(displayCategory(item.category))}</span>
                <span>${formatCurrency(item.suggestedAmount)}</span>
            </div>
            <div class="budget-auto-row">
                <span>${t("Trung bình", "Average")}: ${formatCurrency(item.averageExpense)}</span>
                <span>${t("Xu hướng", "Trend")}: ${escapeHtml(translateText(item.trend))}</span>
            </div>
            <div class="budget-auto-row">
                <span>${t("Ngân sách hiện tại", "Current budget")}: ${item.currentBudget === null ? t("Chưa có", "None") : formatCurrency(item.currentBudget)}</span>
                <span>${t(`Dựa trên ${item.basisMonths} tháng`, `Based on ${item.basisMonths} months`)}</span>
            </div>
            <button class="secondary-button apply-suggestion">${t("Dùng gợi ý này", "Use this suggestion")}</button>
        `;
        wrapper.querySelector(".apply-suggestion").addEventListener("click", () => {
            editingBudgetId = null;
            budgetCategory.value = item.category;
            budgetAmount.value = item.suggestedAmount;
            budgetMonth.value = item.targetMonth;
            budgetSubmit.textContent = t("Lưu ngân sách", "Save budget");
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
            <span>${t("Dự kiến mỗi tháng", "Estimated monthly")}</span>
            <strong>${formatCurrency(data?.totalEstimatedMonthly || 0)}</strong>
            <small>${t(`${activeCount} khoản đang theo dõi - ${items.length - activeCount} khoản đã bỏ qua`, `${activeCount} tracked - ${items.length - activeCount} ignored`)}</small>
        </div>
        <div class="recurring-summary-card">
            <span>${t("Kỳ dự báo", "Forecast period")}</span>
            <strong>${escapeHtml(data?.nextMonth || "--")}</strong>
            <small>${t("Dựa trên lịch sử giao dịch hiện có", "Based on available transaction history")}</small>
        </div>
    `;

    recurringList.innerHTML = "";
    if (!items.length) {
        recurringList.innerHTML = `
            <div class="empty-state">
                <strong>${t("Chưa phát hiện khoản định kỳ.", "No recurring items detected yet.")}</strong>
                <p>${t("Khi có ít nhất hai giao dịch giống nhau ở nhiều tháng, app sẽ tự gợi ý tại đây.", "When at least two similar transactions appear across months, the app will suggest them here.")}</p>
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
                <strong>${escapeHtml(displayNote(item.note))}</strong>
            </div>
            <p>${escapeHtml(displayCategory(item.category))} - ${t(`${item.occurrences} lần ghi nhận`, `${item.occurrences} records`)}</p>
            <div class="recurring-amount">${formatCurrency(item.estimatedAmount)}</div>
            <small>${t("Các tháng gần đây", "Recent months")}: ${escapeHtml((item.months || []).join(", "))}</small>
            <div class="recurring-actions">
                <button class="secondary-button confirm-recurring">${t("Xác nhận", "Confirm")}</button>
                <button class="secondary-button ignore-recurring">${t("Bỏ qua", "Ignore")}</button>
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
            authStatus.textContent = t(`Đang đăng nhập: ${status.user.name} (${status.user.email})${status.user.isAdmin ? " - Admin" : ""}. Giao dịch mới sẽ gắn với tài khoản này.`, `Signed in: ${status.user.name} (${status.user.email})${status.user.isAdmin ? " - Admin" : ""}. New transactions will be linked to this account.`);
            authLogoutBtn.disabled = false;
        } else {
            authStatus.textContent = status.userCount > 0
                ? t("Chưa đăng nhập. Bạn vẫn có thể dùng app local, nhưng dữ liệu mới không gắn với user.", "Not signed in. You can still use the local app, but new data will not be linked to a user.")
                : t("Chưa có tài khoản local. Tạo tài khoản nếu muốn gắn dữ liệu mới với user.", "No local account yet. Create one if you want new data linked to a user.");
            authLogoutBtn.disabled = true;
        }
        const canManageDb = Boolean(status.authenticated && status.user?.isAdmin);
        backupDbBtn.disabled = !canManageDb;
        if (restoreSubmitBtn) {
            restoreSubmitBtn.disabled = !canManageDb;
        }
        if (!canManageDb && dataStatus) {
            dataStatus.textContent = t("Sao lưu/khôi phục DB chỉ dành cho quản trị viên. Thiết lập ADMIN_EMAILS rồi đăng nhập bằng email quản trị để dùng.", "DB backup/restore is admin-only. Set ADMIN_EMAILS and sign in with an admin email to use it.");
        } else if (dataStatus && dataStatus.textContent.includes("chỉ dành cho admin")) {
            dataStatus.textContent = t("Sẵn sàng thao tác dữ liệu.", "Ready for data actions.");
        }
    } catch (error) {
        authStatus.textContent = error.message || t("Không thể kiểm tra tài khoản.", "Could not check the account.");
    }
}

function refreshPwaStatus() {
    if (!pwaStatus) {
        return;
    }
    const swSupported = "serviceWorker" in navigator;
    const standalone = window.matchMedia?.("(display-mode: standalone)").matches;
    pwaStatus.textContent = swSupported
        ? standalone ? t("Đang chạy ở chế độ app/PWA.", "Running in app/PWA mode.") : t("Trình duyệt hỗ trợ PWA. Có thể dùng Install app nếu trình duyệt hiển thị.", "This browser supports PWA. Use Install app if the browser shows it.")
        : t("Trình duyệt này chưa hỗ trợ service worker/PWA.", "This browser does not support service workers/PWA.");
}

async function refreshAiHealthStatus() {
    if (!aiHealthStatus) {
        return;
    }
    try {
        const health = await fetchHealthStatus();
        const mode = health.openai?.configured && health.openai?.sdkAvailable
            ? t(`OpenAI cloud sẵn sàng (${health.openai.model})`, `OpenAI cloud is ready (${health.openai.model})`)
            : t("Đang dùng AI local fallback vì chưa có OPENAI_API_KEY hoặc SDK.", "Using local AI fallback because OPENAI_API_KEY or SDK is missing.");
        aiHealthStatus.textContent = mode;
    } catch (error) {
        aiHealthStatus.textContent = error.message || t("Không thể kiểm tra trạng thái AI.", "Could not check AI status.");
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
                <strong>${t("Chưa đủ dữ liệu để AI phân tích.", "Not enough data for AI analysis yet.")}</strong>
                <p>${t("Thêm vài giao dịch thu/chi trong tháng đang xem hoặc bấm nạp dữ liệu mẫu 12 tháng để xem cách hoạt động.", "Add a few income/expense transactions for the selected month or load 12-month sample data to see how it works.")}</p>
            </div>
        `;
        return;
    }
    const hero = document.createElement("div");
    hero.className = "insight-hero";
    hero.innerHTML = `
        <span>${t("Tóm tắt AI", "AI brief")} ${escapeHtml(insight.month || filterMonth.value || "")}</span>
        <strong>${escapeHtml((insight.spending_insights || [])[1] || (insight.spending_insights || [])[0] || t("Phân tích dữ liệu tháng đang chọn.", "Analysis for the selected month."))}</strong>
        <small>${escapeHtml(insight.source === "openai" ? "OpenAI" : t("Dự phòng cục bộ", "Local fallback"))}</small>
    `;
    aiInsightResult.appendChild(hero);

    const sections = [
        [t("Tổng quan", "Overview"), insight.spending_insights || []],
        [t("Mẫu chi tiêu", "Spending patterns"), insight.patterns || []],
        [t("Hành động nên làm", "Recommended actions"), insight.suggestions || []],
    ];
    sections.forEach(([title, items]) => {
        const card = document.createElement("div");
        card.className = "insight-card";
        const heading = document.createElement("h4");
        heading.textContent = title;
        const list = document.createElement("ul");
        if (items.length === 0) {
            const item = document.createElement("li");
            item.textContent = t("Chưa có dữ liệu.", "No data yet.");
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
        <span class="report-scope">${escapeHtml(report.scope === "year" ? t("12 tháng", "12 months") : report.month)}</span>
        <h3>${escapeHtml(report.title)}</h3>
        <p>${escapeHtml(report.overview)}</p>
        <div class="report-grid">
            ${list(t("Rủi ro", "Risks"), report.risks)}
            ${list(t("Cơ hội", "Opportunities"), report.opportunities)}
            ${list(t("Hành động", "Actions"), report.actions)}
        </div>
    `;
    aiInsightResult.appendChild(wrapper);
}

async function generateAiReport(scope) {
    const button = scope === "year" ? generateYearReportBtn : generateMonthReportBtn;
    button.disabled = true;
    aiInsightStatus.textContent = scope === "year" ? t("Đang tạo report 12 tháng...", "Generating 12-month report...") : t("Đang tạo report tháng...", "Generating monthly report...");
    try {
        const report = await fetchAiReport(scope);
        renderAiReport(report);
        aiInsightStatus.textContent = t("Đã tạo report tài chính.", "Financial report generated.");
    } catch (error) {
        aiInsightStatus.textContent = error.message || t("Không thể tạo report.", "Could not generate report.");
    } finally {
        button.disabled = false;
    }
}

function renderDashboardExtras(dashboard) {
    savingsRateValue.textContent = `${Number(dashboard.savingsRate || 0).toFixed(1)}%`;
    topCategoryValue.textContent = dashboard.topSpendingCategory
        ? `${displayCategory(dashboard.topSpendingCategory.category)}`
        : "--";
    biggestExpenseValue.textContent = dashboard.biggestExpense
        ? `${displayNote(dashboard.biggestExpense.note)} - ${formatCurrency(dashboard.biggestExpense.amount)}`
        : "--";

    quickInsightsList.innerHTML = "";
    const quickInsightTexts = currentLanguage === "en"
        ? [
            dashboard.topSpendingCategory ? `Top spending category this month: ${displayCategory(dashboard.topSpendingCategory.category)} (${formatCurrency(dashboard.topSpendingCategory.total)}).` : "",
            dashboard.biggestExpense ? `Biggest expense: ${displayNote(dashboard.biggestExpense.note)} at ${formatCurrency(dashboard.biggestExpense.amount)}.` : "",
            dashboard.comparison?.expenseChange > 0 ? `Expenses increased ${formatCurrency(dashboard.comparison.expenseChange)} versus ${dashboard.comparison.previousMonth}.` : "",
            dashboard.comparison?.expenseChange < 0 ? `Expenses decreased ${formatCurrency(Math.abs(dashboard.comparison.expenseChange))} versus ${dashboard.comparison.previousMonth}.` : "",
        ].filter(Boolean)
        : (dashboard.quickInsights || []);
    quickInsightTexts.forEach((text) => {
        const item = document.createElement("div");
        item.className = "quick-insight";
        item.textContent = text;
        quickInsightsList.appendChild(item);
    });

    if (dashboard.recurringTransactions?.length) {
        const recurring = document.createElement("div");
        recurring.className = "quick-insight recurring-insight";
        recurring.textContent = t(`Có thể định kỳ: ${dashboard.recurringTransactions.map(item => item.note).slice(0, 3).join(", ")}`, `Likely recurring: ${dashboard.recurringTransactions.map(item => displayNote(item.note)).slice(0, 3).join(", ")}`);
        quickInsightsList.appendChild(recurring);
    }
}

function groupTransactionsByMonth(transactions) {
    return transactions.reduce((groups, tx) => {
        const month = (tx.date || "").slice(0, 7) || t("Không rõ tháng", "Unknown month");
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
                <strong>${t("Không tìm thấy giao dịch", "No transactions found")}</strong>
                <p>${t("Thử đổi bộ lọc hoặc thêm giao dịch mới để xem phân tích.", "Try changing filters or adding a new transaction to see analysis.")}</p>
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
                <span>${t(`${grouped[month].length} giao dịch - chi ${formatCurrency(monthTotal)}`, `${grouped[month].length} transactions - spent ${formatCurrency(monthTotal)}`)}</span>
            </div>
        `;
        grouped[month].forEach((tx) => {
            const item = document.createElement("div");
            item.className = `transaction-item ${tx.type === "income" ? "income-row" : "expense-row"}`;
            item.innerHTML = `
                <span><strong>${tx.type === "income" ? t("Thu", "Income") : t("Chi", "Expense")}</strong></span>
                <span>${escapeHtml(formatDate(tx.date))}</span>
                <span>${escapeHtml(displayNote(tx.note))}</span>
                <span>${escapeHtml(displayCategory(tx.category))}</span>
                <span class="source-badge source-${escapeHtml(tx.source || "manual")}">${escapeHtml({ sample: t("Mẫu", "Sample"), import: "CSV", manual: t("Tay", "Manual") }[tx.source] || tx.source || t("Tay", "Manual"))}</span>
                <span style="font-weight:700;">${formatCurrency(tx.amount)}</span>
                <div class="transaction-actions">
                    <button class="edit-button" data-id="${tx.id}">${t("Sửa", "Edit")}</button>
                    <button class="delete-button" data-id="${tx.id}">${t("Xóa", "Delete")}</button>
                </div>
            `;
            item.querySelector(".edit-button").addEventListener("click", () => startEditTransaction(tx));
            item.querySelector(".delete-button").addEventListener("click", async () => {
                if (!confirm(t("Bạn chắc chắn muốn xóa giao dịch này?", "Are you sure you want to delete this transaction?"))) {
                    return;
                }
                try {
                    await deleteTransaction(tx.id);
                    await refreshData();
                } catch (error) {
                    alert(error.message || t("Xóa giao dịch thất bại. Vui lòng thử lại.", "Could not delete the transaction. Please try again."));
                }
            });
            section.appendChild(item);
        });
        transactionsList.appendChild(section);
    });
}

async function refreshAiInsight() {
    generateAiInsightBtn.disabled = true;
    aiInsightStatus.textContent = t(`Đang phân tích dữ liệu tháng ${filterMonth.value || "hiện tại"}...`, `Analyzing data for ${filterMonth.value || "the current month"}...`);
    try {
        const insight = await fetchAiInsight();
        renderAiInsight(insight);
        aiInsightStatus.textContent = insight.source === "openai"
            ? t(`Đã tạo phân tích bằng OpenAI cho tháng ${insight.month || filterMonth.value}.`, `Generated OpenAI analysis for ${insight.month || filterMonth.value}.`)
            : insight.message || t("Đã tạo phân tích dự phòng.", "Generated fallback analysis.");
    } catch (error) {
        aiInsightStatus.textContent = error.message || t("Không thể tạo phân tích AI.", "Could not generate AI analysis.");
    } finally {
        generateAiInsightBtn.disabled = false;
    }
}

async function sendVipQuestion() {
    const message = vipAskInput.value.trim();
    if (!message) return;
    vipAskSend.disabled = true;
    vipAskAnswer.textContent = t("LUX AI đang đọc dữ liệu giao dịch...", "LUX AI is reading transaction data...");
    try {
        const data = await askAi(message);
        vipAskAnswer.textContent = data.source === "local-fallback" && data.message
            ? `${data.response}\n\n${data.message}`
            : data.response;
        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: data.response });
        vipAskInput.value = "";
    } catch (error) {
        vipAskAnswer.textContent = error.message || t("Không thể hỏi AI lúc này.", "Could not ask AI right now.");
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
            el.textContent = t("Đang tải...", "Loading...");
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
        trendText.textContent = translateText(summary.forecast.trend);
        forecastIncome.textContent = formatCurrency(summary.forecast.next30DaysIncome);
        forecastExpense.textContent = formatCurrency(summary.forecast.next30DaysExpense);
        forecastSavings.textContent = formatCurrency(summary.forecast.recommendedSavings);

        adviceList.innerHTML = "";
        summary.advice.forEach((line, index) => {
            const p = document.createElement("p");
            p.textContent = currentLanguage === "en" ? translateText(line) : line;
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
        errorMessage.textContent = error.message || t("Không thể tải dữ liệu. Vui lòng thử lại.", "Could not load data. Please try again.");
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
    submitTransactionBtn.textContent = t("Lưu giao dịch", "Save transaction");
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
    submitTransactionBtn.textContent = editingTransactionId ? t("Đang cập nhật...", "Updating...") : t("Đang lưu...", "Saving...");
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
        alert(error.message || t("Lưu giao dịch thất bại. Vui lòng thử lại.", "Could not save the transaction. Please try again."));
    } finally {
        submitTransactionBtn.disabled = false;
        submitTransactionBtn.textContent = editingTransactionId ? t("Cập nhật giao dịch", "Update transaction") : t("Lưu giao dịch", "Save transaction");
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
        alert(error.message || t("Cập nhật giao dịch thất bại. Vui lòng thử lại.", "Could not update the transaction. Please try again."));
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
        alert(error.message || t("Lưu ngân sách thất bại. Vui lòng thử lại.", "Could not save the budget. Please try again."));
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
        alert(error.message || t("Lưu mục tiêu thất bại. Vui lòng thử lại.", "Could not save the goal. Please try again."));
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
    loadDemoDataBtn.textContent = t("Đang nạp dữ liệu...", "Loading data...");
    try {
        const result = await loadDemoData();
        setActiveMonth(result.month, false);
        await refreshData();
        await refreshAiInsight();
        switchTab("overview");
    } catch (error) {
        alert(error.message || t("Không thể nạp dữ liệu mẫu.", "Could not load sample data."));
    } finally {
        loadDemoDataBtn.disabled = false;
        loadDemoDataBtn.textContent = t("Nạp dữ liệu mẫu 12 tháng", "Load 12-month sample data");
    }
});
clearChatBtn.addEventListener("click", () => {
    chatHistory = [];
    chatMessages.innerHTML = "";
    addChatMessage(t("Đã xóa hội thoại. Bạn có thể hỏi tôi về tháng hiện tại, danh mục rủi ro hoặc kế hoạch tiết kiệm tiếp theo.", "Conversation cleared. You can ask about the current month, risky categories, or the next savings plan."));
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
    params.set("language", currentLanguage);
    appendSourceParam(params);
    window.open(`/api/export/report?${params.toString()}`, "_blank");
});

authLoginBtn.addEventListener("click", async () => {
    authStatus.textContent = t("Đang đăng nhập...", "Signing in...");
    try {
        const result = await submitAuth("login");
        authStatus.textContent = translateText(result.message);
        authPassword.value = "";
        await refreshAuthStatus();
    } catch (error) {
        authStatus.textContent = error.message || t("Đăng nhập thất bại.", "Sign-in failed.");
    }
});

authRegisterBtn.addEventListener("click", async () => {
    authStatus.textContent = t("Đang tạo tài khoản...", "Creating account...");
    try {
        const result = await submitAuth("register");
        authStatus.textContent = translateText(result.message);
        authPassword.value = "";
        await refreshAuthStatus();
    } catch (error) {
        authStatus.textContent = error.message || t("Không thể tạo tài khoản.", "Could not create account.");
    }
});

authLogoutBtn.addEventListener("click", async () => {
    try {
        const result = await logoutAuth();
        authStatus.textContent = translateText(result.message);
        await refreshAuthStatus();
    } catch (error) {
        authStatus.textContent = error.message || t("Không thể đăng xuất.", "Could not sign out.");
    }
});

backupDbBtn.addEventListener("click", async () => {
    dataStatus.textContent = t("Đang chuẩn bị bản sao lưu DB...", "Preparing DB backup...");
    try {
        await downloadBackupDatabase();
        dataStatus.textContent = t("Đã tải bản sao lưu DB.", "DB backup downloaded.");
    } catch (error) {
        dataStatus.textContent = error.message || t("Không thể tải bản sao lưu DB.", "Could not download DB backup.");
    }
});

restoreForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!restoreFile.files.length) {
        dataStatus.textContent = t("Vui lòng chọn file sao lưu SQLite.", "Please choose a SQLite backup file.");
        return;
    }
    if (!confirm(t("Restore sẽ thay database hiện tại. App sẽ tạo bản .bak trước khi ghi đè. Tiếp tục?", "Restore will replace the current database. The app will create a .bak file before overwriting. Continue?"))) {
        return;
    }
    dataStatus.textContent = t("Đang restore database...", "Restoring database...");
    try {
        const result = await restoreDatabase();
        dataStatus.textContent = translateText(result.message);
        await refreshData();
        await refreshAuthStatus();
    } catch (error) {
        dataStatus.textContent = error.message || t("Restore thất bại.", "Restore failed.");
    }
});

resetSessionBtn?.addEventListener("click", async () => {
    sessionStatus.textContent = t("Đang làm mới phiên...", "Refreshing session...");
    resetSessionBtn.disabled = true;
    try {
        await resetClientSessionState();
        await refreshAuthStatus();
        await refreshAiHealthStatus();
        sessionStatus.textContent = t("Đã làm mới phiên. Bạn có thể thử lại thao tác vừa lỗi.", "Session refreshed. You can retry the action that failed.");
    } catch (error) {
        sessionStatus.textContent = error.message || t("Không thể làm mới phiên.", "Could not refresh session.");
    } finally {
        resetSessionBtn.disabled = false;
    }
});

csvFile.addEventListener("change", () => {
    populateCsvMappingOptions([]);
    csvPreview.className = "csv-preview empty-state";
    csvPreview.textContent = csvFile.files.length
        ? t("Bấm “Xem trước” để ứng dụng đọc tiêu đề cột và gợi ý ánh xạ.", "Click Preview so the app can read headers and suggest column mapping.")
        : t("Chọn file rồi bấm “Xem trước” để kiểm tra ánh xạ trước khi nhập.", "Choose a file and click Preview to check mapping before import.");
    csvImportResult.textContent = t("Chưa nhập file nào.", "No file imported yet.");
});

csvPreviewSubmit.addEventListener("click", async () => {
    if (!csvFile.files.length) {
        csvPreview.textContent = t("Vui lòng chọn file CSV/TSV/XLSX.", "Please choose a CSV/TSV/XLSX file.");
        return;
    }
    csvPreviewSubmit.disabled = true;
        csvPreviewSubmit.textContent = t("Đang xem trước...", "Previewing...");
    csvPreview.textContent = t("Đang đọc file và chuẩn hóa vài dòng đầu...", "Reading the file and normalizing the first rows...");
    try {
        const result = await previewCsvFile();
        csvPreview.className = "csv-preview";
        renderCsvPreview(result);
    } catch (error) {
        csvPreview.className = "csv-preview empty-state";
        csvPreview.textContent = error.message || t("Không thể xem trước file.", "Could not preview file.");
    } finally {
        csvPreviewSubmit.disabled = false;
        csvPreviewSubmit.textContent = t("Xem trước", "Preview");
    }
});

csvImportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!csvFile.files.length) {
        csvImportResult.textContent = t("Vui lòng chọn file CSV/TSV/XLSX.", "Please choose a CSV/TSV/XLSX file.");
        return;
    }
    csvImportSubmit.disabled = true;
    csvImportSubmit.textContent = t("Đang nhập...", "Importing...");
    csvImportResult.textContent = t("Đang đọc file...", "Reading file...");
    try {
        const result = await importCsvFile();
        const errorPreview = (result.errors || [])
            .slice(0, 3)
            .map((item) => `${t("Dòng", "Row")} ${item.row}: ${item.error}`)
            .join(" | ");
        csvImportResult.innerHTML = `
            <strong>${escapeHtml(result.message ? translateText(result.message) : t("Đã nhập file", "File imported"))}</strong>
            <p>${t("Thêm mới", "Inserted")}: ${Number(result.inserted || 0)} - ${t("Bỏ qua trùng", "Skipped duplicates")}: ${Number(result.skippedDuplicates || 0)} - ${t("Lỗi", "Errors")}: ${Number(result.errorCount || 0)}</p>
            ${errorPreview ? `<p>${escapeHtml(errorPreview)}</p>` : ""}
        `;
        await refreshData();
    } catch (error) {
        csvImportResult.textContent = error.message || t("Nhập file thất bại.", "File import failed.");
    } finally {
        csvImportSubmit.disabled = false;
        csvImportSubmit.textContent = t("Nhập file", "Import file");
    }
});

csvClearImport?.addEventListener("click", async () => {
    const confirmed = window.confirm(t("Xóa tất cả giao dịch đã nhập từ file? Dữ liệu mẫu và giao dịch nhập tay sẽ được giữ lại.", "Delete all imported transactions? Sample data and manual transactions will be kept."));
    if (!confirmed) {
        return;
    }
    csvClearImport.disabled = true;
    csvImportResult.textContent = t("Đang xóa dữ liệu đã nhập...", "Deleting imported data...");
    try {
        const result = await clearImportedTransactions();
        csvImportResult.innerHTML = `
            <strong>${escapeHtml(result.message ? translateText(result.message) : t("Đã xóa dữ liệu đã nhập", "Imported data deleted"))}</strong>
            <p>${t("Đã xóa", "Deleted")}: ${Number(result.deleted || 0)} ${t("giao dịch nhập từ file", "imported transactions")}.</p>
        `;
        await refreshData();
    } catch (error) {
        csvImportResult.textContent = error.message || t("Không thể xóa dữ liệu đã nhập.", "Could not delete imported data.");
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
        addChatMessage(error.message || t("Không thể kết nối với AI. Vui lòng thử lại.", "Could not connect to AI. Please try again."));
    }
}

chatSend.addEventListener("click", sendChatMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
});

// Add welcome message
initLanguage();
addChatMessage(t("Xin chào! Tôi là AI tài chính của bạn. Hãy hỏi tôi về tiết kiệm, chi tiêu, đầu tư, ngân sách hoặc mục tiêu nhé!", "Hello! I am your financial AI. Ask me about savings, spending, investing, budgets, or goals."));

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
