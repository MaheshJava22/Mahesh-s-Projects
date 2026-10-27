package com.CustomerManage.SmartManage.Controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CustomerManage.SmartManage.CustomerDetails.AdminDetails;
import com.CustomerManage.SmartManage.CustomerRepo.AdminRepo;


@RestController
public class AdminController {
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@Autowired
	AdminRepo adminRepo;
	
	// http://localhost:8426/getadmin
	@GetMapping("/getadmin")
	List<AdminDetails> getAllAdminDetails() {
		return adminRepo.findAll();

	}

	// http://localhost:8426/getcustbyid
	@GetMapping("/getAdmin/{adminid}")
	AdminDetails getAdmin(@PathVariable int adminid) {
		return adminRepo.findById(adminid).orElseThrow();
	}

	// http://localhost:8426/postadmin
	@PostMapping("/Postadmin")
	AdminDetails registerAdminDetails(@Valid @RequestBody AdminDetails admin) {
		validateAdminPassword(admin.getPassword());
		admin.setPassword(passwordEncoder.encode(admin.getPassword()));
		return adminRepo.save(admin);
	}

	// http://localhost:8426/deladminbyid
	@DeleteMapping("/deladmin/{adminid}")
	String deleteAdminDetails(@PathVariable int adminid) {
		adminRepo.deleteById(adminid);
		return "Admin has been deleted sucessfully";
	}

	// http://localhost:8426/updateadminbyid
	@PutMapping("/updateadmin/{adminid}")
	AdminDetails updateAdmin(@Valid @RequestBody AdminDetails admin, @PathVariable int adminid) {
		AdminDetails adminFromDb = getAdmin(adminid);
		adminFromDb.setAdminname(admin.getAdminname());
		adminFromDb.setEmail(admin.getEmail());
		if (admin.getPassword() != null && !admin.getPassword().isBlank()) {
			validateAdminPassword(admin.getPassword());
			adminFromDb.setPassword(passwordEncoder.encode(admin.getPassword()));
		}

		return adminRepo.save(adminFromDb);

	}

	private void validateAdminPassword(String password) {
		if (password == null || password.length() < 8 || password.length() > 72) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin password must be between 8 and 72 characters");
		}
	}


}
