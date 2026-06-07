package com.adminpanel.demo.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public List <User> getAllUsers(){
        return userRepository.findAll();
    }

    public User addUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User editUser(Long id,User user){
        User existingUser = userRepository.findById(id).orElseThrow(()-> new RuntimeException("user not found"));

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

    public List <Object[]> countUsersByMonth(){
        return userRepository.countUsersByMonth();
    }
}
