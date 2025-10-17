package duan.sportify.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Cấu hình Web MVC cho ứng dụng Sportify
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    /**
     * Cấu hình các thư mục tài nguyên tĩnh
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Thêm handler cho tài nguyên tĩnh trong db/migration
        registry.addResourceHandler("/db/migration/**")
               .addResourceLocations("classpath:/db/migration/");
        
        // Thêm handler cho tài nguyên tĩnh trong sql folder
        registry.addResourceHandler("/sql/**")
               .addResourceLocations("classpath:/sql/");
    }
    
    /**
     * Cấu hình các interceptor
     * Interceptor kiểm tra xác thực cho các API yêu cầu đăng nhập
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthenticationInterceptor())
            .addPathPatterns("/api/user/**", "/api/admin/**")
            .excludePathPatterns("/api/sportify/**", "/api/login", "/api/register");
    }
    
    /**
     * Interceptor kiểm tra xác thực
     */
    private static class AuthenticationInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            HttpSession session = request.getSession();
            String username = (String) session.getAttribute("username");
            
            // Kiểm tra nếu đường dẫn yêu cầu xác thực và người dùng chưa đăng nhập
            if (username == null) {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                return false;
            }
            
            // Cho phép request tiếp tục xử lý
            return true;
        }
    }
}