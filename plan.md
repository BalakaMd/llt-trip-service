Технічна архітектура LittleLifeTrip (TravelFinder) MVP

1. Загальний огляд
   Мета MVP:
   Швидко згенерувати персоналізований маршрут на вікенд (1-3 дні) з бюджетом, картою (Google Maps), прогнозом погоди і можливістю зберегти/поділитись/експортувати в Google Calendar.
   Ключові функції:
   Форма «Куди поїхати на вихідних?» (місце, дати, бюджет, інтереси, транспорт)
   Генерація маршруту (LLM + перевірки)
   Карта з полілінією й POI (Google Maps)
   Прогноз погоди на дати поїздки
   Калькулятор/зведення бюджету
   Збереження, шеринг, експорт у Google Calendar
2. Архітектурна схема

Деплой (AWS): EKS + ALB (Ingress) + WAF + cert-manager + ExternalDNS + External Secrets + ElastiCache + S3 + CloudWatch; PostgreSQL як StatefulSet у кластері; Terraform модулі для всього; CI/CD через GitHub Actions (OIDC) → ECR → Helm/kubectl в EKS. 3. Компоненти
Frontend (React)
SearchForm, TripViewer (карта + таймлайн), BudgetSummary, WeatherWidget, ShareLink, CalendarExport.
Google Maps (JS API) для візуалізації: полілінія від бекенду + маркери POI.
Auth через JWT (Google OAuth на бекенді).
API Gateway (Node.js/Express)
Термінує TLS, валідує JWT, маршрутизує запити до мікросервісів.
Rate limiting (наприклад, token bucket через Redis).
Auth & User Service (Node.js + PostgreSQL)
Реєстрація/логін (email+password), Google GIS.
Профіль, налаштування, уподобання (інтереси, транспорт).
JWT (access/refresh), ролі (user/admin).
Trip Service (Node.js + PostgreSQL)
CRUD маршрутів/ітинераріїв
Збереження, дублювання, шеринг read-only лінком.
Бюджет: агрегування вартості по етапах/POI.
Integration Service (Node.js)
Maps//Directions (Google): проксі до Google Maps/Geocoding/Directions; нормалізує POI.
Weather: проксі до OpenWeather; нормалізований формат.
Calendar (Google): інтеграція з Google Calendar (OAuth per user), створення подій з ітинерарію.
AI Recommender (Python FastAPI)
LLM (ChatGPT/Gemini) для генерації/пояснення маршрутів.
Постпроцесінг у структурований JSON (POI, час, бюджетні оцінки).
Embeddings/контент-бейзд фільтрація (за інтересами/транспортом/сезонністю).
Кеш відповідей у Redis. (Опціонально) 4. Структура бази даних (PostgreSQL)
Окремі схеми: auth, trip, integration. Нижче – ключові таблиці для MVP.

auth.users
id UUID PK
email (UNIQ), password_hash (nullable для OAuth)
name, avatar_url
auth_provider enum(local,google)
created_at, updated_at
auth.sessions (для refresh-токенів, якщо зберігаємо сервер-сайд)
id UUID PK, user_id FK
refresh_token_hash, expires_at, user_agent, ip, revoked
auth.user_preferences
user_id PK/FK
home_city, home_lat, home_lng
interests JSONB (наприклад: ["nature","food"])
transport_modes JSONB (наприклад: ["car","public"])
avg_daily_budget INT
trip.trips
id UUID PK
user_id FK (nullable для «гостьових»)
title, summary
start_date, end_date, duration_days
origin_city, origin_lat, origin_lng
transport_mode enum(car,public,bike,walk)
total_budget_estimate NUMERIC(10,2), currency CHAR(3)
visibility enum(private,unlisted,public)
share_slug (UNIQ)
status enum(draft,final)
created_at, updated_at
trip.itinerary_items
id UUID PK, trip_id FK ON DELETE CASCADE
day_index INT, order_index INT → UNIQUE (trip_id, day_index, order_index)
place_id FK → trip.places (nullable, для кастомного місця)
title, description
planned_start_at, planned_end_at TIMESTAMPTZ
transport_segment JSONB {mode, distanceKm, durationMin}
cost_estimate NUMERIC (10,2)
snapshot для карти: lat NUMERIC(9,6), lng NUMERIC(9,6), place_name_snapshot TEXT, address_snapshot TEXT
(щоб карта/маршрут не ламались, якщо POI змінено або видалено)
trip.places (нормалізація POI)
id UUID PK
external_ref (Google Place ID) UNIQ NOT NULL
name, lat, lng
address, categories JSONB
rating NUMERIC (2,1) nullable
opening_hours JSONB nullable
trip.budget_items
id UUID PK, trip_id FK
category enum(transport,stay,food,activities,other)
title, quantity int default 1
unit_price numeric(10,2), currency char(3)
source enum(ai,user,integration)
linked_itinerary_item_id FK nullable ON DELETE SET NULL
trip.route_cache (кеш поліліній/маршрутів для карти)
trip_id PK/FK
provider enum(google)
request_sig TEXT UNIQUE (sha256 від {origin, waypoints, destination, travelMode, trafficModel, дата})
encoded_polyline TEXT
bounds JSONB {ne:{lat,lng}, sw:{lat,lng}}
legs JSONB[] (початок/кінець, distanceMeters, durationSeconds)
distance_m INT, duration_s INT
fetched_at TIMESTAMPTZ
trip.calendar_events (замість зберігання всього в JSONB)
trip_id FK, item_id FK nullable
provider enum(google)
event_id TEXT
last_exported_at TIMESTAMPTZ
PK: (trip_id, provider, event_id); INDEX: (trip_id, provider)
integration.calendar_tokens
user_id PK/FK
provider enum(google)
access_token_enc TEXT, refresh_token_enc TEXT, expires_at TIMESTAMPTZ
scope TEXT, calendar_id TEXT nullable
scopes JSONB nullable, token_version INT DEFAULT 1, updated_at TIMESTAMPTZ
integration.weather_cache
id UUID PK,
query_hash UNIQUE
payload JSONB, fetched_at TIMESTAMPTZ
(TTL логіка на рівні застосунку)

integration.ai_runs
id UUID PK, user_id FK, trip_id FK nullable
provider enum(openai,gemini)
prompt TEXT, response JSONB (очищений), tokens_used INT
status enum, created_at TIMESTAMPTZ
Індекси:
trips(user_id, created_at DESC)
itinerary_items(trip_id, day_index, order_index) UNIQUE
places(external_ref); GIN на places.categories, user_preferences.interests
(якщо PostGIS) GiST на places(geom) / itinerary_items(geom)
Перевірки (CHECK):
planned_end_at > planned_start_at
duration_days = (end_date - start_date + 1) 5. API (MVP)
Префікс через API Gateway: /api/\*
Формат: JSON, версіонування через /v1/...
Авторизація: Bearer JWT (крім публічного share_slug)
Idempotency: підтримка заголовка Idempotency-Key на запитах із побічними ефектами.
Auth & User
POST /v1/auth/register — створення облікового запису (email, пароль, ім’я). Відповідь: профіль + токени доступу/оновлення.
POST /v1/auth/login — вхід по email/паролю.
POST /v1/auth/oauth/google/idtoken — отримання Google ID токена для авторизації в системі. Коли: швидкий синґл-сайн-он без пароля.
POST /v1/auth/refresh — оновлення access-токена за дійсним refresh.
Нотатка: ротація refresh-токена.
POST /v1/auth/logout — відкликання refresh-токена (лог-аут з поточного пристрою).
GET /v1/users/me — отримати профіль поточного користувача.
PATCH /v1/users/me — оновити базові поля профілю (ім’я, аватар, налаштування).
GET /v1/users/me/preferences — прочитати вподобання (інтереси, транспорт, бюджет)
PUT /v1/users/me/preferences — зберегти/замінити вподобання.
Нотатка: використовується як контекст для AI-рекомендацій.
Trips
POST /v1/trips/recommend - згенерувати план поїздки.
body: { origin, dates, durationDays, budget, interests[], transport, timezone? , dryRun? }
flow: AI → Integration Maps (directions/POI) → Integration Weather → нормалізація → (за потреби) збереження в trips + itinerary_items + budget_items
Resp: повний план (при dryRun=true – тільки прев’ю, без запису в БД.)
POST /v1/trips — створити/імпортувати трип з відомих блоків чи власних POI. Коли: ручне складання без AI
GET /v1/trips?cursor=&limit=&from=&to=&status= - список моїх поїздок
Пояснення: курсорна пагінація; фільтри за діапазоном дат і статусом.
GET /v1/trips/:id – деталі конкретної поїздки (повний об’єкт)
PATCH /v1/trips/:id – змінити метадані (назва, дати, видимість, timezone).
Нотатка: зсув часових полів застосовується на FE, бекенд зберігає в TZ
DELETE /v1/trips/:id - видалити поїздку та пов’язані елементи
POST /v1/trips/:id/clone – створити копію для редагування/альтернатив.
POST /v1/trips/:id/share – створити/оновити share_slug (посилання для read-only). Нотатка: відкликається повторним викликом (оновлення slug).
GET /v1/public/trips/:share_slug – публічний read-only перегляд трипу без JWT. Коли: поділитися маршрутом з друзями.
Ітинерарій/бюджет
POST /v1/trips/:id/itinerary — масове оновлення списку пунктів.
Коли: застосувати пакетні зміни після редагування на таймлайні.
PATCH /v1/trips/:id/itinerary/:itemId — точкова правка одного пункту. Нотатка: валідація часових перетинів і порядку.
POST /v1/trips/:id/budget/items — додати статтю витрат (ручна корекція).
PATCH /v1/trips/:id/budget/items/:bid - змінити конкретну статтю.
GET /v1/trips/:id/budget/summary — агрегований бюджет по категоріях. Коли: показати підсумки на екрані “Бюджет”.
Карти для фронтенду
GET /v1/trips/:id/map?withPlaces=true - легкий DTO для відображення карти.
Resp: { polyline, bounds, legs[], markers[] }
Навіщо: щоб не тягнути весь трип для рендера карти (швидший перший paint).
Integration – Maps (internal)
GET /internal/v1/maps/places/search?q=&lat=&lng=&radius=&category= - пошук POI. Нотатка: відповіді нормалізовані; кешуються.
GET /internal/v1/maps/place/:placeId - деталі одного POI (нормалізовано). Коли: відкриття інфо-вікна на мапі.
GET /internal/v1/maps/place-photo?ref=&maxWidth= — проксі картинок POI. Навіщо: ключ Google не світиться у фронтенді; контролюємо кеш-заголовки.
GET /internal/v1/maps/geocode?address= - геокодинг
GET /internal/v1/maps/reverse?lat=&lng= - реверс-геокодинг
Коли: перетворення адрес ↔ координати.
POST /internal/v1/maps/directions - розрахунок маршруту.
Body: { origin{lat,lng}, destination{lat,lng}, waypoints[], travelMode:"DRIVE|WALK|BICYCLE|TRANSIT", optimize?:true, departureTime?: "now"|ISO, trafficModel? }
Resp: { polyline, bounds{ne,sw}, legs[], distanceMeters, durationSeconds }
Integration – Weather (internal)
GET /internal/v1/weather/forecast?lat=&lng=&from=&to=&units=metric - прогноз на діапазон дат.
Resp (нормалізовано):
{
"provider":"openweather",
"location":{"lat":..,"lng":..},
"units":"metric",
"days":[{"date":"YYYY-MM-DD","temp":{"min":..,"max":..},"feelsLike":{"day":..},"precipProb":0.35,"wind":{"speedMps":..,"deg":..},"summary":"Light rain","icon":"rain"}],
"stale": false,
"fetchedAt":"...Z"
}

Нотатка: stale=true коли віддається останній валідний кеш (падіння провайдера).
Integration – Calendar
GET /v1/integrations/calendar/google/connect – згенерувати URL для OAuth-перенаправлення. Коли: користувач вмикає експорт у Google Calendar.
GET /v1/integrations/calendar/google/callback?code= – прийняти код, зберегти токени.
Нотатка: токени шифруються; зберігається calendar_id за замовчуванням (за потреби).
POST /v1/integrations/calendar/google/export – створити/синхронізувати події для трипу.
Body: { tripId, mode:"per-block"|"per-day", timezone, calendarId?, eventVisibility? }
Resp: { status, created, updated, links[] }
Idempotency: безпечно повторювати; мапінг itemId → eventId.
PATCH /v1/integrations/calendar/google/export – повторна синхронізація після змін у трипі.
DELETE /v1/integrations/calendar/google/export?tripId= – відкликати створені події.
AI Recommender Service (internal)
POST /internal/v1/ai/recommend – згенерувати маршрут
Body: { userProfile, origin, duration, dates?, budget, interests, transport, timezone? }
Resp: { title, summary, places[], itinerary[], budgetEstimate, rationale, alternatives[] }
POST /internal/v1/ai/explain — пояснення, чому система запропонувала саме цей план. Коли: UX-прозорість/довіра, help-тултіп/FAQ.
POST /internal/v1/ai/improve — оптимізація плану (вартість/час/пріоритети). Коли: “зроби дешевше/швидше/з меншими переходами”.
Загальні примітки:
Для internal-ендпойнтів використовується сервіс-то-сервіс авторизація (mTLS/JWT сервісів).
Кешування (Maps/Weather) на рівні Integration; фронтенд отримує мінімальні DTO.
У відповідях з картами завжди повертати bounds — фронту легше робити fitBounds(). 6. Безпека
JWT RS256 (JWKS), короткий access, refresh-rotation.
Google GIS (Calendar): мінімальні scope, токени шифруються (AES-GCM, ключ у KMS).
Роздільні Google ключі: Browser (referrer-restricted) і Server (IP-restricted).
Secrets тільки через Secrets Manager.
Валідація схем (Zod/pydantic), обмеження розміру запитів/відповідей.
LLM guardrails: schema-first, санітизація, ліміти токенів. 7. Спостережуваність і SLO
SLO: POST /trips/recommend успішність ≥ 99.5%, P95 < 1500 ms (за кеш-хітів Maps/Weather).
Метрики: RPS, P95, 401/429/5xx по Gateway; cache-hit інтеграцій; LLM latency/tokens; CB стан.
Алерти: 5xx > 2% (5 хв), RDS CPU > 70% (10 хв), Redis evictions > 0. 8. User Flow
Користувач на Forntend вводить: місто(а), дати, тривалість, бюджет, інтереси, транспорт.
Frontend → API Gateway → Trip Service (POST /trips/recommend)
Trip Service → AI Recommender (дані користувача + контекст)
AI Recommender → Integration Service (добір POI/маршруту, перевірка часу/відстані через Directions; підтягує погоду).
AI Recommender повертає структурований план (ітинерарій + rough бюджет).
Trip Service нормалізує, оцінює бюджет (агрегація), зберігає у БД.
Frontend показує карту/таймлайн, бюджет; користувач зберігає або шерить.
(Опція) Integration Service → Google Calendar створює подію.
