package com.adminpanel.demo.Users;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @DirtiesContext
    @Test
    void shouldGetUsers() {
        List<User> users = userService.getAllUsers();

        assertNotNull(users);
    }

    @DirtiesContext
    @Test
    void shouldAddUser() {
        User user = new User();

        user.setName("Test");
        user.setEmail("test@test.com");
        user.setPassword("123456");
        user.setRole(Role.USER);

        User savedUser = userService.addUser(user);

        assertNotNull(savedUser.getId());
    }

    @DirtiesContext
    @Test
    void shouldEditUser() {
        User user = new User();

        user.setName("Before");
        user.setEmail("before@test.com");
        user.setPassword("123456");
        user.setRole(Role.USER);

        User saved = userService.addUser(user);

        User edited = new User();
        edited.setName("After");
        edited.setEmail("after@test.com");
        edited.setRole(Role.ADMIN);

        User result = userService.editUser(saved.getId(), edited);

        assertEquals("After", result.getName());
        assertEquals(Role.ADMIN, result.getRole());
    }

    @DirtiesContext
    @Test
    void shouldDeleteUser() {
        User user = new User();

        user.setName("Delete");
        user.setEmail("delete@test.com");
        user.setPassword("123456");
        user.setRole(Role.USER);

        User saved = userService.addUser(user);

        userService.deleteUser(saved.getId());

        assertThrows(RuntimeException.class, () -> userService.editUser(saved.getId(), user));
    }
}