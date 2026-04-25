package com.smartcampushub.security;

import com.smartcampushub.dto.member4.AuthResponseMember4;
import com.smartcampushub.service.member4.AuthServiceMember4;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthServiceMember4 authServiceMember4;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = String.valueOf(oauthUser.getAttributes().get("email"));
        String fullName = String.valueOf(oauthUser.getAttributes().getOrDefault("name", email));
        String picture = String.valueOf(oauthUser.getAttributes().getOrDefault("picture", ""));

        AuthResponseMember4 auth = authServiceMember4.processOauth2Login(email, fullName, picture);
        String redirectUrl = frontendBaseUrl + "/auth/callback?token=" + URLEncoder.encode(auth.getToken(), StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);
    }
}
