package duan.sportify.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import duan.sportify.entities.Orderdetails;

public interface OrderDetailDAO extends JpaRepository<Orderdetails, Integer> {
    @Query(value = "SELECT * FROM orderdetails where orderid = :orderid", nativeQuery = true)
    List<Orderdetails> detailOrder(@Param("orderid") Integer orderid);

    @Modifying
    @Transactional
    @Query("DELETE FROM Orderdetails d WHERE d.orders.orderid = :orderId")
    void deleteByOrderId(@Param("orderId") Integer orderId);

    @Query(value = "SELECT * FROM orderdetails where orderid = :orderid", nativeQuery = true)
    List<Orderdetails> findByOrderId(@Param("orderid") Integer orderid);
}
