package com.queuemanager.queue_system_Backend.service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.queuemanager.queue_system_Backend.entity.Token;
import com.queuemanager.queue_system_Backend.repository.TokenRepository;

@Service
public class TokenService {
    @Autowired
    private TokenRepository tokenRepository;

    // Counter to generate unique token numbers
    private AtomicInteger tokenCounter = new AtomicInteger(1);


    // Create a new token
    public Token createToken(String userName) {
        Token newToken = new Token();
        newToken.setUserName(userName);
        newToken.setTokenNumber("T-"+ tokenCounter.getAndIncrement());
        newToken.setIsServed(false);
        newToken.setDateTime(java.time.LocalDateTime.now());

        return tokenRepository.save(newToken);
    }

    // Retrieve all tokens
    public List<Token> getAllTokens() {
        return tokenRepository.findAll();
    }

    // Update token status
    public Token updateTokenStatus(Long id){
        Token token = tokenRepository.findById(id).orElseThrow(() -> new RuntimeException("Token not found"));
        token.setIsServed(true);
        System.out.println("Token with ID " + id + " marked as served.");
        return tokenRepository.save(token);
    }
    
}
