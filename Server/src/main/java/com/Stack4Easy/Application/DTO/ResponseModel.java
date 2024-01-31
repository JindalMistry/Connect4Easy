package com.Stack4Easy.Application.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseModel {
    private String Message;
    private Integer Status;
    private Object Data;
    public ResponseModel(String Message, Integer Status){
        this.Message = Message;
        this.Status = Status;
    }
}
