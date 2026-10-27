package com.CustomerManage.SmartManage.CustomerDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "StaffDetails")
@Setter
@Getter
public class StaffDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int sid;
	@NotBlank(message = "Staff name is required")
	@Size(max = 100, message = "Staff name must be 100 characters or fewer")
	private String sname;
	@NotBlank(message = "Staff email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email must be 254 characters or fewer")
	private String semail;
	@Size(max = 30, message = "Phone number must be 30 characters or fewer")
	private String sphone;
	@Size(max = 100, message = "Designation must be 100 characters or fewer")
	private String designation;
	@Pattern(regexp = "^$|^\\d{1,10}(\\.\\d{1,2})?$", message = "Salary must be a number with up to two decimal places")
	private String salary;

	@Override
	public String toString() {
		return "StaffDetails [sid=" + sid + ", sname=" + sname + ", semail=" + semail + ", sphone=" + sphone
				+ ", designation=" + designation + ", salary=" + salary + "]";
	}
}
