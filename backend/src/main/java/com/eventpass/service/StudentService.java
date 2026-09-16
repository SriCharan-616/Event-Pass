package com.eventpass.service;

import com.eventpass.dto.request.LoginRequest;
import com.eventpass.dto.request.RegisterRequest;
import com.eventpass.dto.response.AuthResponse;
import com.eventpass.exception.ApiException;
import com.eventpass.model.Student;
import com.eventpass.repository.StudentRepository;
import com.eventpass.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setDob(request.getDob());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(request.getRole());

        Student saved = studentRepository.save(student);
        String token = jwtService.generateToken(saved.getEmail(), saved.getId(), saved.getRole().name());
        return new AuthResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), token);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        String token = jwtService.generateToken(student.getEmail(), student.getId(), student.getRole().name());
        return new AuthResponse(student.getId(), student.getName(), student.getEmail(), student.getRole(), token);
    }
}
