# HandlerMethodArgumentResolver 作用

在 Spring Boot 中，`HandlerMethodArgumentResolver` 是一个非常有用的接口，它允许你自定义解析器，以便在处理器方法（即控制器方法）中自动解析方法参数。通过实现这个接口，你可以定义如何从请求中提取数据并将其转换为控制器方法的参数。

`HandlerMethodArgumentResolver` 的主要作用是**允许你自定义处理器方法的参数解析逻辑，使得你可以根据请求的内容自动填充控制器方法的参数**。这种机制非常灵活，**适用于各种场景，例如从请求头、请求参数、Cookie 中提取数据，甚至是从复杂的自定义对象中提取数据**。

### 典型使用场景

1. **从请求中提取用户信息**：例如，从 JWT 令牌或会话中提取当前用户信息并注入到控制器方法参数中。
2. **从请求中提取特定参数**：例如，从请求头或请求参数中提取特定数据并注入到控制器方法参数中。
3. **处理复杂对象**：例如，将请求中的 JSON 数据自动转换为复杂的 Java 对象并注入到控制器方法参数中。

### 如何实现和使用 `HandlerMethodArgumentResolver`

以下是一个完整的示例，展示如何实现和使用 `HandlerMethodArgumentResolver`。

#### 自定义注解

首先，创建一个自定义注解，用于标记需要特殊处理的方法参数。

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
}
```

#### 实现 `HandlerMethodArgumentResolver`

然后，创建一个实现 `HandlerMethodArgumentResolver` 接口的类，定义如何解析方法参数。

```java
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // 判断参数是否有 @CurrentUser 注解
        return parameter.getParameterType().isAssignableFrom(User.class) &&
               parameter.hasParameterAnnotation(CurrentUser.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        // 从请求中获取用户信息，例如从 JWT 令牌中解析用户信息
        return getUserFromRequest(webRequest);
    }

    private User getUserFromRequest(NativeWebRequest webRequest) {
        // 实现从请求中获取用户信息的逻辑
        // 例如，从请求头中获取 JWT 令牌并解析用户信息
        String token = webRequest.getHeader("Authorization");
        return parseTokenAndGetUser(token);
    }

    private User parseTokenAndGetUser(String token) {
        // 实现解析 JWT 令牌并获取用户信息的逻辑
        return new User(...); // 返回一个 User 对象
    }
}
```

#### 注册 `HandlerMethodArgumentResolver`

在 Spring 配置中注册自定义的参数解析器。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new CurrentUserArgumentResolver());
    }
}
```

#### 在控制器中使用自定义注解

最后，在控制器方法中使用自定义注解来标记参数。

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {
    @GetMapping("/user")
    public String getUser(@CurrentUser User user) {
        // 现在 user 参数会被自动解析并注入
        return "Current user is: " + user.getUsername();
    }
}
```

### 总结

`HandlerMethodArgumentResolver` 在 Spring Boot 中的作用是提供了一种灵活的方式，以便根据请求的内容自动解析控制器方法的参数。通过自定义参数解析器，可以从请求中提取各种所需的数据，并将其转换为控制器方法的参数，从而简化了代码并增强了可维护性。