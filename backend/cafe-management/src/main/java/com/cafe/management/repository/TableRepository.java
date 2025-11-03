package com.cafe.management.repository;

import com.cafe.management.model.CafeTable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TableRepository extends MongoRepository<CafeTable, String> {
}
