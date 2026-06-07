# Yazai

![Java](https://img.shields.io/badge/Java-21-007396?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.14-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-Wrapper-C71A36?style=flat-square&logo=apachemaven&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-f59e0b?style=flat-square)

Yazai 是一个基于 **Spring Boot 3** 和 **Java 21** 构建的后端服务项目。项目当前处于早期开发阶段，已经具备标准的 Spring Boot 工程结构，可作为后续 REST API、业务服务、数据访问层和 Web 能力的基础骨架。

## 项目亮点

- **现代 Java 技术栈**：使用 Java 21 与 Spring Boot 3.5，适合构建稳定、可维护的后端服务。
- **开箱即用的 Web 能力**：集成 `spring-boot-starter-web`，可快速扩展 RESTful API。
- **Maven Wrapper 支持**：无需全局安装指定 Maven 版本，直接通过 `./mvnw` 构建和运行。
- **Lombok 预配置**：减少样板代码，便于后续实体类、DTO、配置类开发。
- **清晰工程结构**：保持 Spring Boot 默认分层习惯，后续扩展成本低。

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 语言 | Java 21 |
| 框架 | Spring Boot 3.5.14 |
| 构建工具 | Maven Wrapper |
| Web | Spring MVC / Servlet |
| 测试 | Spring Boot Test / JUnit |
| 工具库 | Lombok |

## 快速开始

### 环境要求

- JDK 21+
- Git

> 项目已包含 Maven Wrapper，因此本地无需额外安装 Maven。

### 克隆项目

```bash
git clone <your-repository-url>
cd yazai
```

### 运行应用

```bash
./mvnw spring-boot:run
```

应用启动后默认监听：

```text
http://localhost:8080
```

### 运行测试

```bash
./mvnw test
```

### 打包构建

```bash
./mvnw clean package
```

构建产物将生成在：

```text
target/
```

## 项目结构

```text
yazai
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com/bkq/yazai
│   │   │       └── YazaiApplication.java
│   │   └── resources
│   │       └── application.yaml
│   └── test
│       └── java
│           └── com/bkq/yazai
│               └── YazaiApplicationTests.java
├── pom.xml
├── mvnw
└── mvnw.cmd
```

## 配置说明

当前应用名称配置在 `src/main/resources/application.yaml`：

```yaml
spring:
  application:
    name: yazai
```

后续可以在这里继续补充端口、数据库、缓存、日志、第三方服务等配置。

## 开发路线

- [ ] 添加基础 REST API
- [ ] 设计业务模块分层
- [ ] 接入数据库与持久化框架
- [ ] 增加统一异常处理
- [ ] 增加接口参数校验
- [ ] 完善单元测试和集成测试
- [ ] 补充部署说明

## 贡献方式

欢迎提交 Issue 或 Pull Request 来完善项目。建议在提交代码前先运行：

```bash
./mvnw test
```

## License

当前项目尚未声明开源协议。发布到 GitHub 前，建议根据实际需要补充 `LICENSE` 文件。
