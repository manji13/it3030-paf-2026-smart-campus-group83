package com.smartcampushub.security;

import com.smartcampushub.enums.UserRole;
import com.smartcampushub.repository.member4.UserRepositoryMember4;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepositoryMember4 userRepositoryMember4;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.smartcampushub.model.member4.User user = userRepositoryMember4.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.builder()
                .username(user.getEmail())
                .password("N/A")
            .authorities("ROLE_" + user.getRole().name())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
            .disabled(!user.isActive())
                .build();
    }
}
