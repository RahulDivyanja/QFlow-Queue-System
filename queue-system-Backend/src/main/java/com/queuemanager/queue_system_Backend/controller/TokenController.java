package com.queuemanager.queue_system_Backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.queuemanager.queue_system_Backend.service.TokenService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queuemanager.queue_system_Backend.dto.CreateTokenRequest;
import com.queuemanager.queue_system_Backend.entity.Token;

@RestController
@RequestMapping("/api/tokens")
@RequiredArgsConstructor
public class TokenController {
    private final TokenService tokenService;

    @PostMapping
    public ResponseEntity<Token> createToken(@RequestBody CreateTokenRequest request) {
        Token token = tokenService.createToken(request.getUserName());
        return ResponseEntity.ok(token);
    }

    @GetMapping
    public ResponseEntity<List<Token>> getAllTokens() {
        return ResponseEntity.ok(tokenService.getAllTokens());
    }

    @PutMapping("/{id}/serve")
    public ResponseEntity<Token> markAsServed(@PathVariable Long id) {
        return ResponseEntity.ok(tokenService.updateTokenStatus(id));
    }

}
