package duan.sportify.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import duan.sportify.entities.VoucherOfUser;
import duan.sportify.service.VoucherOfUserService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("api/user/voucher-of-user")
public class VoucherOfUserController {
    @Autowired
    private  VoucherOfUserService voucherOfUserService;

   @GetMapping("/")
   public List<VoucherOfUser> getMethodName( HttpServletRequest request) {
       String userName = (String) request.getSession().getAttribute("username");
       return voucherOfUserService.findByUserName(userName);
   }
   
   
}
