package com.CustomerManage.SmartManage.Controller;

import java.util.List;

import jakarta.validation.Valid;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CustomerManage.SmartManage.CustomerDetails.StaffDetails;
import com.CustomerManage.SmartManage.CustomerRepo.StaffRepo;


@RestController
public class StaffController {

	@Autowired
	StaffRepo staffRepo;

	// http://localhost:8426/getstaff
	@GetMapping("/getstaff")
	List<StaffDetails> getAllStaffDetails() {
		return staffRepo.findAll();

	}

	// http://localhost:8426/getstaffbyid
	@GetMapping("/getstaff/{sid}")
	StaffDetails getStaff(@PathVariable int sid) {
		return staffRepo.findById(sid).orElseThrow();
	}

	// http://localhost:8426/poststaff
	@PostMapping("/Poststaff")
	StaffDetails registerCustomerDetails(@Valid @RequestBody StaffDetails staff) {
		return staffRepo.save(staff);
	}

	// http://localhost:8426/delstaffbyid
	@DeleteMapping("/delstaff/{sid}")
	String deletesatffDetails(@PathVariable int sid) {
		staffRepo.deleteById(sid);
		return "Staff has been deleted sucessfully with id of : " + sid;
	}

	// http://localhost:8426/updatestafftbyid
	@PutMapping("/updatestaff/{sid}")
	StaffDetails updateStaff(@Valid @RequestBody StaffDetails staff, @PathVariable int sid) {
		StaffDetails staffFromDb = getStaff(sid);
		staffFromDb.setSname(staff.getSname());
		staffFromDb.setSemail(staff.getSemail());
		staffFromDb.setSphone(staff.getSphone());
		staffFromDb.setDesignation(staff.getDesignation());
		staffFromDb.setSalary(staff.getSalary());

		return staffRepo.save(staffFromDb);

	}
}
