package com.queuemanager.queue_system_Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<com.queuemanager.queue_system_Backend.entity.Token, Long> {

}
