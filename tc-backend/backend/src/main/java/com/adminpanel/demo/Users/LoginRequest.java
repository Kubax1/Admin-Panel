package com.adminpanel.demo.Users;

import lombok.Data;

@Data
public class LoginRequest{
    private String email;
    private String password;
}
