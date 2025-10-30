package duan.sportify.DTO;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResDTO implements Serializable {
	private String Status;
	private String Message;
	private String URL;
	
	public void setStatus(String status) {
		this.Status = status;
	}
	
	public void setMessage(String message) {
		this.Message = message;
	}
	
	public void setURL(String url) {
		this.URL = url;
	}
}
