package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.Entity.ConnectionResults;
import com.Stack4Easy.Application.Repository.ConnResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConnResultsService {
    private final ConnResultRepository connResultRepository;

    public ConnectionResults createRoom(AddConnDto conn){
        return connResultRepository.save(
                new ConnectionResults(
                    conn.getUser_id(),
                    conn.getRef_id()
                )
        );
    }
}
