package com.CustomerManage.SmartManage.Controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CustomerManage.SmartManage.CustomerDetails.CustomerDetails;
import com.CustomerManage.SmartManage.CustomerRepo.CustomerRepo;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

	@Autowired
	CustomerRepo customerRepo;

	// http://localhost:8426/getcust
	@GetMapping("/getcust")
	List<CustomerDetails> getAllCustomerDetails() {
		return customerRepo.findAll();

	}

	// http://localhost:8426/getcustbyid
	@GetMapping("/getcust/{cid}")
	CustomerDetails getCustomer(@PathVariable int cid) {
		return customerRepo.findById(cid).orElseThrow();
	}

	// http://localhost:8426/postcust
	@PostMapping("/PostCust")
	CustomerDetails registerCustomerDetails(@Valid @RequestBody CustomerDetails customer) {
		return customerRepo.save(customer);
	}

	// http://localhost:8426/delcustbyid
	@DeleteMapping("/delcust/{cid}")
	String deleteCustomerDetails(@PathVariable int cid) {
		customerRepo.deleteById(cid);
		return "Customer has been deleted sucessfully with id of : " + cid;
	}

	// http://localhost:8426/updatecustbyid
	@PutMapping("/updatecust/{cid}")
	CustomerDetails updateCustomer(@Valid @RequestBody CustomerDetails customer, @PathVariable int cid) {
		CustomerDetails customerFromDb = getCustomer(cid);
		customerFromDb.setCname(customer.getCname());
		customerFromDb.setCemail(customer.getCemail());
		customerFromDb.setCphone(customer.getCphone());
		customerFromDb.setCity(customer.getCity());
		customerFromDb.setState(customer.getState());

		return customerRepo.save(customerFromDb);

	}

}
