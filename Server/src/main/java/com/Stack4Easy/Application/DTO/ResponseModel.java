package com.Stack4Easy.Application.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseModel {
    @JsonProperty("Message")
    private String Message;
    @JsonProperty("Status")
    private Integer Status;
    @JsonProperty("Data")
    private Object Data;
    public ResponseModel(String Message, Integer Status){
        this.Message = Message;
        this.Status = Status;
    }
}
