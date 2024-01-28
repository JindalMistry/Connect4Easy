package com.Stack4Easy.Application.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/test")
public class TestController {
    @GetMapping("/")
    public String test(){
        return "Ping success.";
    }
}
