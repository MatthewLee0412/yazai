# Yazai 新生宝宝信息管理系统

Yazai 是一个面向家庭使用的新生宝宝信息管理系统，用来集中记录宝宝档案、成长变化、疫苗接种、就医记录和保险信息。

当前项目已经完成第一期 MVP：后端提供 REST API 和本地 JSON 持久化，前端提供独立 Vue 管理界面，也保留了一份 Spring Boot 静态页面版本。

## 功能范围

- 宝宝档案：姓名、性别、出生日期、出生医院、出生身高体重、血型、过敏史、监护人信息。
- 成长记录：身高、体重、头围、测量日期、备注，并支持成长趋势展示。
- 疫苗管理：内置 0-6 岁疫苗计划模板，支持记录计划日期、实际接种日期、接种地点、批号、医生和状态。
- 就医记录：医院、科室、医生、症状、诊断、用药、费用、复诊日期和备注。
- 保险管理：保险公司、保险名称、保单号、保障范围、生效/到期日期、保费、理赔记录。
- 首页总览：展示宝宝年龄、最新成长数据、待接种疫苗、保险到期和近期提醒。

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 后端 | Java 21, Spring Boot 3.5.14 |
| 构建 | Maven |
| 前端 | Vue 3, Vite, Pinia, Vue Router, Chart.js |
| 持久化 | 本地 JSON 文件 `data/yazai-store.json` |
| 测试 | Spring Boot Test, JUnit |

## 目录结构

```text
yazai
├── src/main/java/com/bkq/yazai
│   ├── controller      # REST API
│   ├── model           # 业务数据模型
│   ├── service         # 业务逻辑和本地持久化
│   ├── store           # JSON 存储状态对象
│   └── YazaiApplication.java
├── src/main/resources
│   ├── static          # Spring Boot 静态页面版本
│   └── application.yaml
├── frontend            # Vue 前端工程
├── data                # 本地运行数据，已忽略，不要提交
├── pom.xml
└── README.md
```

## 后端运行

环境要求：

- JDK 21+
- Maven 3.9+

运行测试：

```bash
mvn test
```

启动后端：

```bash
mvn spring-boot:run
```

或先打包再运行：

```bash
mvn package -DskipTests
java -jar target/yazai-0.0.1-SNAPSHOT.jar
```

默认地址：

```text
http://localhost:8080
```

说明：当前仓库的 `mvnw.cmd` 在部分 Windows PowerShell 环境可能因为 `Path/PATH` 环境变量冲突无法启动。如果遇到该问题，可先使用本机 Maven 的 `mvn` 命令。

## 前端运行

进入前端目录：

```bash
cd frontend
npm install
npm run dev
```

默认前端地址：

```text
http://localhost:5173
```

开发环境下，`frontend/vite.config.js` 会把 `/api` 请求代理到：

```text
http://localhost:8080
```

因此本地联调时需要先启动后端。

构建前端：

```bash
cd frontend
npm run build
```

## 数据与隐私

系统会在首次启动时生成本地数据文件：

```text
data/yazai-store.json
```

这个文件会保存宝宝档案、就医记录、保单号等真实家庭数据，已经通过 `.gitignore` 忽略，不能提交到 Git。

同样不要提交以下内容：

- `data/`
- `target/`
- `frontend/node_modules/`
- `frontend/dist/`
- `*.log`
- `*.local`
- 任何包含真实手机号、身份证号、保单号、就诊资料、API Key、Token、密码的文件

## 提交前检查

提交前建议执行：

```bash
git status --short
git status --ignored --short
rg -n -i "(password|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|authorization|bearer|jdbc:|mysql://|postgres://|mongodb://|redis://|BEGIN PRIVATE)" . -g "!frontend/node_modules/**" -g "!frontend/dist/**" -g "!target/**" -g "!data/**"
mvn test
```

正常情况下，`data/`、`target/`、`frontend/node_modules/`、`frontend/dist/` 应该只出现在 ignored 列表里，不应该出现在待提交文件中。

## 主要接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/dashboard` | 首页总览 |
| `GET/PUT` | `/api/baby` | 宝宝档案 |
| `GET/POST` | `/api/growth-records` | 成长记录 |
| `GET/POST` | `/api/medical-visits` | 就医记录 |
| `GET` | `/api/vaccine-templates` | 疫苗计划模板 |
| `GET/POST` | `/api/vaccine-records` | 宝宝接种记录 |
| `GET/POST` | `/api/insurance-policies` | 保险记录 |

带 `{id}` 的记录接口支持 `PUT` 更新和 `DELETE` 删除。
