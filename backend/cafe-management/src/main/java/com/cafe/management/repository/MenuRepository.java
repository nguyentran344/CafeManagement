package com.cafe.management.repository;

import com.cafe.management.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MenuRepository extends MongoRepository<MenuItem, String> {
}
