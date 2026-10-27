package com.CustomerManage.SmartManage.CustomerRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.CustomerManage.SmartManage.CustomerDetails.StaffDetails;

@Repository
public interface StaffRepo extends JpaRepository<StaffDetails, Integer> {

}