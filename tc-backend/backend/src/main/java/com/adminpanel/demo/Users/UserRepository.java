package com.adminpanel.demo.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    @Query(value= """
    SELECT EXTRACT(MONTH from created_at) as month,count(*) as total 
        from users 
        group by month 
        order by month""", nativeQuery = true)
    List<Object[]> countUsersByMonth();
    Optional<User> findByEmail(String email);
}
