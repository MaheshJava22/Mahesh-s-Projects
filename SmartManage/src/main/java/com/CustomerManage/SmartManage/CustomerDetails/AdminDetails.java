package com.CustomerManage.SmartManage.CustomerDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "AdminDetails")
@Setter
@Getter
public class AdminDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private int adminid;
	@NotBlank(message = "Admin name is required")
	@Size(max = 100, message = "Admin name must be 100 characters or fewer")
	private String adminname;
	@NotBlank(message = "Admin email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email must be 254 characters or fewer")
	private String email;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;
	

	@Override
	public String toString() {
		return "AdminDetails [adminid=" + adminid + ", adminname=" + adminname + ", email=" + email
				 + "]";
	}
}
