package com.CustomerManage.SmartManage.CustomerRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CustomerManage.SmartManage.CustomerDetails.CustomerDetails;

@Repository
public interface CustomerRepo extends JpaRepository<CustomerDetails, Integer> {

}
