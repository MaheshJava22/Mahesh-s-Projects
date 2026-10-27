package com.CustomerManage.SmartManage.CustomerDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "CustomerDetails")
@Setter
@Getter

public class CustomerDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int cid;
	@NotBlank(message = "Customer name is required")
	@Size(max = 100, message = "Customer name must be 100 characters or fewer")
	private String cname;
	@NotBlank(message = "Customer email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email must be 254 characters or fewer")
	private String cemail;
	@Size(max = 30, message = "Phone number must be 30 characters or fewer")
	private String cphone;
	@Size(max = 100, message = "City must be 100 characters or fewer")
	private String City;
	@Size(max = 100, message = "State must be 100 characters or fewer")
	private String State;
	@ManyToOne
	@JoinColumn(name="Staff_id")
	private StaffDetails sid;
	@Override
	public String toString() {
		return "CustomersDetails [cid=" + cid + ", cname=" + cname + ", cemail=" + cemail + ", cphone=" + cphone
				+ ", City=" + City + ", State=" + State + "]";
	}
}
