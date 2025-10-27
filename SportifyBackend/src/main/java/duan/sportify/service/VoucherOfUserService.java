package duan.sportify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import duan.sportify.entities.VoucherOfUser;
import duan.sportify.Repository.VoucherOfUserRepository;
import java.util.List;

@Service
public class VoucherOfUserService {

    @Autowired
    private VoucherOfUserRepository voucherOfUserRepository;

    public VoucherOfUser create(VoucherOfUser voucherOfUser) {
        return voucherOfUserRepository.save(voucherOfUser);
    }

    public VoucherOfUser update(VoucherOfUser voucherOfUser) {
        return voucherOfUserRepository.save(voucherOfUser);
    }

    public void delete(Long id) {
        voucherOfUserRepository.deleteById(id);
    }

    public VoucherOfUser findById(Long id) {
        return voucherOfUserRepository.findById(id).orElse(null);
    }

    public List<VoucherOfUser> findByUserName(String userName) {
        return voucherOfUserRepository.findByUserName(userName);
    }
}
