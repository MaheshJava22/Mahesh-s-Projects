package com.CustomerManage.SmartManage.CustomerRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CustomerManage.SmartManage.CustomerDetails.AdminDetails;

@Repository
public interface AdminRepo extends JpaRepository<AdminDetails,Integer> {

}
