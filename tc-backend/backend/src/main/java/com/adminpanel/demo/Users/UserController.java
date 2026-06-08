package com.adminpanel.demo.Users;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/users")
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping("")
    public User addUser(@RequestBody User user){
        return userService.addUser(user);
    }

    @GetMapping("")
    public List<User> geAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public User editUser(@PathVariable Long id,@RequestBody User user){
        return userService.editUser(id,user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id){
         userService.deleteUser(id);
    }

    @GetMapping("/dashboard")
    public List <Object[]> countUsersByMonth(){
        return userService.countUsersByMonth();
    }
}
