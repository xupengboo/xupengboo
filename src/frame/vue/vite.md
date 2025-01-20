# Vite 框架

## `import.meta.env.xxx` 作用

`import.meta.env.VITE_APP_API` 是 Vite 中用于访问环境变量的一种方式。

通过 `import.meta.env`，可以获取在 Vite 项目中定义的环境变量值，通常用于根据不同环境（如开发、测试、生产）动态设置项目中的一些配置。

### 作用与使用场景

1. **动态配置 API 接口**：例如，可以在 `.env` 文件中定义不同的 API 基础 URL (`VITE_APP_API`)，从而在不同环境中访问不同的接口地址。
2. **环境隔离**：在开发、测试、生产环境下，可以使用不同的配置文件，如 `.env.development`、`.env.production`，从而将环境变量分开管理，保证数据和行为的环境隔离。
3. **保护敏感数据**：一些敏感信息（如密钥、API 地址）可以使用环境变量方式引入，而不是直接硬编码在代码中，确保项目配置灵活、敏感数据保护更好。

例如：

```js
const apiBaseUrl = import.meta.env.VITE_APP_API; // 根据环境自动获取API URL

fetch(`${apiBaseUrl}/users`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 注意事项

- **在 Vite 中，所有用户自定义的环境变量名称需要以 `VITE_` 前缀开头，例如 `VITE_APP_API`。**
- 环境变量的值会在项目构建时写入，因此动态修改 `.env` 文件后，需重新启动开发服务器或重新构建项目才能生效。

![image-20241014092344340](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241014092344340.png)
