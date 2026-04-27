# LUX Money AI

Personal finance dashboard chạy local bằng Flask + SQLite + HTML/CSS/JavaScript. App có dữ liệu mẫu 12 tháng để demo ngay, đồng thời hỗ trợ nhập giao dịch thật bằng tay hoặc import CSV.

## Tính Năng Chính

- Dashboard theo tháng: tổng thu, tổng chi, dòng tiền ròng, savings rate, top category, giao dịch lớn nhất.
- Transaction CRUD: thêm, sửa, xóa, lọc theo tháng/loại/danh mục/tìm kiếm/sắp xếp.
- Bộ lọc nguồn dữ liệu: `Tất cả`, `Dữ liệu mẫu`, `Dữ liệu thật`, `Nhập tay`, `Import CSV`.
- CSV Import Wizard: preview file, tự nhận diện header, chọn mapping bằng dropdown, chống trùng giao dịch.
- Budget: tạo/sửa/xóa ngân sách theo tháng, tự tính đã dùng từ giao dịch thật trong cùng danh mục.
- Savings goals: tạo mục tiêu tiết kiệm và theo dõi tiến độ.
- Analytics 12 tháng: cash flow, savings rate, heatmap chi tiêu theo ngày, xu hướng top danh mục.
- Recurring/subscription: tự phát hiện khoản định kỳ, cho xác nhận hoặc bỏ qua.
- AI assistant:
  - AI insight theo tháng.
  - Chat hỏi đáp theo dữ liệu giao dịch.
  - Report tháng hoặc 12 tháng.
  - Có fallback local nếu chưa cấu hình OpenAI.
- Export:
  - CSV giao dịch.
  - HTML finance report để mở/lưu/in ra PDF bằng trình duyệt.
- Backup/restore SQLite database.
- Tài khoản local nhẹ: đăng ký/đăng nhập để dữ liệu mới có thể gắn với user.
- CSRF token cho các request ghi dữ liệu và rate-limit cơ bản cho đăng nhập.
- PWA manifest/service worker để trình duyệt hỗ trợ có thể cài như app.

## Cài Đặt

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Tạo file `.env` từ mẫu:

```powershell
Copy-Item .env.example .env
```

Nếu muốn dùng OpenAI thật, mở `.env` và điền:

```text
OPENAI_API_KEY=sk-your-key
SECRET_KEY=mot-chuoi-bi-mat-dai
```

Không có key thì app vẫn chạy; AI sẽ dùng fallback local dựa trên dữ liệu hiện có.

## Chạy App

```powershell
python app.py
```

Mở:

```text
http://127.0.0.1:5000
```

File SQLite mặc định là `finance.db` ở thư mục gốc. Khi chạy app, schema sẽ tự migrate các cột cần thiết như `date`, `note`, `source`.

## Dữ Liệu Mẫu

App có nút **Nạp dữ liệu mẫu 12 tháng** trong dashboard. Dữ liệu mẫu được đánh dấu `source = sample`, nên có thể lọc riêng khỏi dữ liệu nhập tay/import.

Các nguồn dữ liệu:

- `sample`: dữ liệu mẫu để demo.
- `manual`: giao dịch bạn nhập tay.
- `import`: giao dịch import từ CSV.
- `real`: gồm `manual` và `import`, không gồm dữ liệu mẫu.

## Import CSV / XLSX

Vào tab **Giao dịch**:

1. Chọn file `.csv`, `.tsv` hoặc `.xlsx`.
2. Bấm **Xem trước**.
3. Kiểm tra mapping cột ngày/số tiền/ghi chú/loại/danh mục và định dạng ngày.
4. Chỉnh dropdown nếu cần, ví dụ chọn `MM/DD/YYYY` cho dữ liệu ngày kiểu Mỹ.
5. Bấm **Import file**.

App tự bỏ qua giao dịch trùng theo:

```text
date + amount + type + note
```

Tên cột phổ biến được tự nhận diện, ví dụ: `date`, `date / time`, `amount`, `debit/credit`, `note`, `type`, `income/expense`, `category`, `debit`, `credit`, `description`, `transaction description`, `memo`, `nội dung`.

Khi preview/import, app tự suy luận thứ tự ngày theo toàn bộ file để tránh đảo `01/02/2018` thành `2018-02-01` với dữ liệu `MM/DD/YYYY`.

Nút **Xóa dữ liệu import** trong khu import sẽ xóa các giao dịch `source = import`, giữ nguyên dữ liệu mẫu và giao dịch nhập tay.

## AI

AI dùng backend route, không hardcode key ở frontend.

- Model: `gpt-4.1-mini`
- Env var: `OPENAI_API_KEY`
- Nếu thiếu key hoặc OpenAI lỗi, app trả về fallback local thay vì crash.
- Nếu chưa điền `OPENAI_API_KEY`, AI vẫn trả lời bằng phân tích local từ giao dịch. Muốn dùng OpenAI thật thì thêm key vào `.env`, lưu file rồi restart `python app.py`.

Ví dụ câu hỏi:

- `Tháng này tôi chi nhiều nhất ở đâu?`
- `Compare this month to last month`
- `Tôi có vượt ngân sách không?`
- `Gợi ý ngân sách tháng sau`
- `12 tháng gần đây tài chính của tôi thế nào?`

## Export Report

Trong tab **Giao dịch**:

- **Xuất báo cáo CSV**: tải file CSV theo filter tháng/nguồn dữ liệu.
- **Xuất report HTML**: tải báo cáo HTML gồm summary, insight, top categories, recurring và giao dịch gần đây.

Có thể mở file HTML trong trình duyệt rồi dùng `Ctrl+P` để in hoặc lưu PDF.

## Tài Khoản Local

Tab **Dữ liệu** có phần **Tài khoản local**:

- Không đăng nhập: app vẫn chạy như trước để demo/local.
- Đăng ký/đăng nhập: giao dịch mới, CSV import, budget/goal mới sẽ được gắn với `user_id`.
- App có CSRF token cho request ghi dữ liệu, session cookie `HttpOnly/SameSite=Lax`, và rate-limit cơ bản cho login.
- Backup/restore DB chỉ dành cho admin. Thiết lập `ADMIN_EMAILS=email-cua-ban@example.com`, đăng ký/đăng nhập đúng email đó rồi mới dùng được.
- Trên public deploy, nên để `ENABLE_DEMO_DATA=false` để user lạ không nạp lại dữ liệu mẫu, và chỉ bật `ENABLE_DB_RESTORE=true` tạm thời khi admin cần restore file backup tin cậy.
- Đây vẫn là lớp auth local đơn giản để chuẩn bị multi-user; nếu public production, nên chạy qua HTTPS, cấu hình `SESSION_COOKIE_SECURE=true`, dùng DB production và audit phân quyền kỹ hơn.

## Backup / Restore

Trong tab **Dữ liệu**:

- **Tải backup DB**: tải file `finance.db`.
- **Restore DB**: upload file SQLite backup để thay DB hiện tại.

Trước khi restore, app tự tạo bản backup dạng:

```text
finance.db.before-restore-YYYYMMDD-HHMMSS.bak
```

Restore sẽ thay dữ liệu hiện tại, nên chỉ dùng với file backup bạn tin tưởng.

## PWA

App có `manifest.json`, `icon.svg`, và `sw.js`. Trình duyệt hỗ trợ PWA có thể hiển thị tùy chọn **Install app**. API vẫn cần Flask server chạy local/deploy; service worker chỉ cache shell tĩnh.

## Deploy Render/Railway

Đã có:

- `Procfile`
- `render.yaml`
- `gunicorn` trong `requirements.txt`

Start command:

```text
gunicorn app:app
```

Biến môi trường nên cấu hình:

```text
SECRET_KEY=chuoi-random-dai
OPENAI_API_KEY=sk-your-key
SESSION_COOKIE_SECURE=true
DB_PATH=/data/finance.db
ADMIN_EMAILS=admin@example.com
ENABLE_DEMO_DATA=false
ENABLE_DB_RESTORE=false
MAX_UPLOAD_MB=5
```

Lưu ý quan trọng: nếu deploy với SQLite, cần persistent disk. `render.yaml` hiện mount disk vào `/data` và đặt `DB_PATH=/data/finance.db`; nếu deploy ở nền tảng khác, hãy cấu hình biến `DB_PATH` trỏ tới thư mục có lưu trữ bền vững.

## PostgreSQL / Production DB

Code hiện dùng SQLite trực tiếp để giữ app local đơn giản và dễ demo. Nếu muốn lên PostgreSQL thật, cần migration riêng:

- tạo schema PostgreSQL tương đương các bảng `transactions`, `budgets`, `goals`, `users`, `recurring_rules`;
- thay lớp `sqlite3` bằng driver như `psycopg`;
- đổi placeholder SQL từ `?` sang `%s` hoặc dùng query builder/ORM;
- chuyển backup/restore DB sang cơ chế dump/restore của PostgreSQL.

Không nên đổi nửa vời trong app hiện tại vì sẽ dễ phá dữ liệu SQLite local.

## Chạy Test

```powershell
.\venv\Scripts\python.exe -m pytest -q
```

Test dùng SQLite DB tạm trong thư mục temp, không dùng và không xóa `finance.db` hiện tại.

## Smoke Check / Health Check

Health endpoint:

```text
GET /api/health
```

Endpoint này kiểm tra nhanh SQLite DB, `PRAGMA integrity_check`, số lượng bản ghi trong các bảng chính, trạng thái OpenAI, PWA assets, session, CSRF và cookie.

Chạy smoke check local không cần browser:

```powershell
.\venv\Scripts\python.exe scripts\smoke_check.py
```

Script này dùng Flask test client trong process, chỉ đọc dữ liệu và không sửa `finance.db`.

## E2E Browser Test Tùy Chọn

Repo có sẵn cấu hình Playwright ở `package.json`, `playwright.config.js`, và `tests/e2e`.

Cần cài Node.js trước, sau đó:

```powershell
npm install
npx playwright install chromium
python app.py
```

Ở terminal khác:

```powershell
npm run e2e
```

Nếu máy chưa có `node` trong PATH, bỏ qua phần này; pytest và smoke check backend vẫn chạy được.

## QA / Demo Checklist

Dùng checklist này trước khi demo hoặc bàn giao:

- Chạy app bằng `python app.py` và mở `http://127.0.0.1:5000`.
- Nếu dashboard trống, bấm **Nạp dữ liệu mẫu 12 tháng**.
- Trong **Tổng quan**, đổi tháng và kiểm tra summary card, monthly chart, category chart, heatmap.
- Trong **Giao dịch**, thử filter theo `Dữ liệu mẫu`, `Dữ liệu thật`, `Nhập tay`, `Import CSV`.
- Thêm một giao dịch nhỏ, sửa giao dịch đó, rồi xóa giao dịch đó.
- Import một file CSV nhỏ, bấm **Xem trước**, kiểm tra mapping, rồi import.
- Trong **Ngân sách**, sửa một budget và kiểm tra progress tự đổi theo giao dịch cùng danh mục.
- Trong **Định kỳ**, xác nhận một khoản recurring rồi bỏ qua lại để kiểm tra trạng thái.
- Trong **AI**, hỏi: `Tháng này tôi chi nhiều nhất ở đâu?`
- Xuất **CSV** và **report HTML** theo tháng đang xem.
- Vào **Dữ liệu**, đăng ký tài khoản local, đăng xuất, đăng nhập lại.
- Bấm **Tải backup DB** để kiểm tra tải file backup.
- Kiểm tra restore DB bằng bản backup test nếu cần; không restore nhầm file thật khi đang demo.
- Chạy `.\venv\Scripts\python.exe -m pytest -q` và đảm bảo tất cả test pass.

## Troubleshooting

- Nếu `node --check static/app.js` lỗi `node is not recognized`: máy chưa cài Node.js hoặc chưa có trong PATH. App vẫn chạy vì frontend là JavaScript thuần trên trình duyệt.
- Nếu AI trả lời bằng fallback: kiểm tra `.env` có `OPENAI_API_KEY` chưa và đã cài `openai` chưa.
- Nếu import CSV lỗi ngày: dùng định dạng `YYYY-MM-DD`, `DD/MM/YYYY`, `DD-MM-YYYY`, hoặc chọn đúng cột ngày trong preview.
- Nếu dashboard trống: bấm **Nạp dữ liệu mẫu 12 tháng** hoặc import/thêm giao dịch mới.
